import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";

it("marks an order as cancelled", async () => {
	// create ticket with Ticket model
	const ticket = Ticket.build({
		id: mongoose.Types.ObjectId().toHexString(),
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

it("should return a 404 if the order is not found", async () => {
	const cookie = global.signin();
	const fakeOrderId = mongoose.Types.ObjectId();
	// try to get order that does not exist
	await request(app)
		.delete(`/api/orders/${fakeOrderId}`)
		.set("Cookie", cookie)
		.expect(404);
});

it("returns a 401 if one user tries to delete another users order", async () => {
	const cookie = global.signin();
	// create a ticket
	const ticket = Ticket.build({
		id: mongoose.Types.ObjectId().toHexString(),
		title: "concert",
		price: 20,
	});
	// save ticket to db
	await ticket.save();
	// make request to build order with this ticket destructure body and rename it as order
	const { body: order } = await request(app)
		.post("/api/orders")
		.set("Cookie", cookie)
		.send({
			ticketId: ticket.id,
		})
		.expect(201);
	// make request to fetch the order as the same user
	const { body: fetchedOrder } = await request(app)
		.delete(`/api/orders/${order.id}`)
		.set("Cookie", global.signin())
		.send()
		.expect(401);
});

it("emits a order cancelled event", async () => {
	const ticket = Ticket.build({
		id: mongoose.Types.ObjectId().toHexString(),
		title: "concert",
		price: 20,
	});
	await ticket.save();

	const user = global.signin();
	// make a request to create an order
	const { body: order } = await request(app)
		.post("/api/orders")
		.set("Cookie", user)
		.send({ ticketId: ticket.id })
		.expect(201);

	// make a request to cancel the order
	await request(app)
		.delete(`/api/orders/${order.id}`)
		.set("Cookie", user)
		.send()
		.expect(204);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
