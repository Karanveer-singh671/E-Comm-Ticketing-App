import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

it("fetches an order", async () => {
	const cookie = global.signin();
	// create a ticket
	const ticket = Ticket.build({
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
		.get(`/api/orders/${order.id}`)
		.set("Cookie", cookie)
		.send()
		.expect(200);

	expect(fetchedOrder.id).toEqual(order.id);
});

it("should return a 404 if the order is not found", async () => {
	const cookie = global.signin();
	const fakeOrderId = mongoose.Types.ObjectId();
	// try to get order that does not exist
	await request(app)
		.get(`/api/orders/${fakeOrderId}`)
		.set("Cookie", cookie)
		.expect(404);
});

it("returns a 401 if one user tries to fetch another users order", async () => {
	const cookie = global.signin();
	// create a ticket
	const ticket = Ticket.build({
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
		.get(`/api/orders/${order.id}`)
		.set("Cookie", global.signin())
		.send()
		.expect(401);
});
