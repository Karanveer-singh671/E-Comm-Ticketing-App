import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { OrderStatus } from "../../../../common/src/events/types/order-status";
const buildTicket = async () => {
	const ticket = Ticket.build({
		title: "concert",
		price: 20,
	});
	await ticket.save();

	return ticket;
};
it("fetches order for a particular user", async () => {
	// create 3 tickets
	const buildTicketOne = await buildTicket();
	const buildTicketTwo = await buildTicket();
	const buildTicketThree = await buildTicket();
	// create 1 order as User #1
	const userOne = global.signin();
	const userTwo = global.signin(); // save global sign in since making follow up request as same user

	await request(app)
		.post("/api/orders")
		.set("Cookie", userOne)
		.send({
			ticketId: buildTicketOne.id,
		})
		.expect(201);
	// create two orders as User #2
	// get body out of response and rename to orderOne
	const { body: orderOne } = await request(app)
		.post("/api/orders")
		.set("Cookie", userTwo)
		.send({
			ticketId: buildTicketTwo.id,
		})
		.expect(201);
	const { body: OrderTwo } = await request(app)
		.post("/api/orders")
		.set("Cookie", userTwo)
		.send({
			ticketId: buildTicketThree.id,
		})
		.expect(201);
	// make request to get orders for User #2
	const response = await request(app)
		.get("/api/orders")
		.set("Cookie", userTwo)
		.expect(200);
	// make sure we only got the orders for user #2
	expect(response.body.length).toEqual(2); // got 2 orders in response
	expect(response.body[0].id).toEqual(orderOne.id); // first order id is first id in response body
	expect(response.body[1].id).toEqual(OrderTwo.id);
	expect(response.body[0].ticket.id).toEqual(buildTicketTwo.id);
	expect(response.body[1].ticket.id).toEqual(buildTicketThree.id);
});
