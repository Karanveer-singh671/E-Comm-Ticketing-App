import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";

it("marks an order as cancelled", async () => {
	// create ticket with Ticket model
	const ticket = Ticket.build({
		title: "concert",
		price: 10,
	});
	await ticket.save();

	const user = global.signin();
	// make request to create an order
	const { body: order } = await request(app)
		.post("/api/orders")
		.set("Cookie", user)
		.send({
			ticketId: ticket.id,
		})
		.expect(201);
	// make a request to cancel the Order
	const response = await request(app)
		.delete(`/api/orders/${order.id}`)
		.set("Cookie", user)
		.send()
		.expect(204);
	// expectation to make sure the thing is cancelled
	const updatedOrder = await Order.findById(order.id);
	// fail to find an order
	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});
