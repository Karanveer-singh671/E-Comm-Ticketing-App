import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("returns an error if the ticket does not exist", async () => {
	const ticketId = mongoose.Types.ObjectId();

	await request(app)
		.post("/api/orders")
		.set("Cookie", global.signin())
		.send({ ticketId })
		.expect(404);
});

it("returns an error if the ticket is already reserved", async () => {
	const ticket = Ticket.build({
		title: "concert",
		price: 20,
	});
	// save ticket
	await ticket.save();
	// associate saved ticket with the order
	const order = Order.build({
		ticket,
		userId: "randomUserId",
		status: OrderStatus.Created,
		expiresAt: new Date(),
	});
	// save the order
	await order.save();
	// now try to create an order w the ticket already saved in order after saving order
	await request(app)
		.post("/api/orders")
		.set("Cookie", global.signin())
		.send({
			// try the ticket id that already made order with
			ticketId: ticket.id,
		})
		.expect(400);
});

it("reserves a ticket", async () => {
	const ticket = Ticket.build({
		title: "concert",
		price: 20,
	});

	// cookie for user
	const cookie = global.signin();
	// save ticket
	await ticket.save();
	const { body: ticketCreated } = await request(app)
		.post("/api/orders")
		.set("Cookie", cookie)
		.send({
			// send ticket with an order that wasn't made yet
			ticketId: ticket.id,
		})
		.expect(201);
	// check if was able to save order into db and that it had ticket id equal to one above
	const response = await request(app)
		.get("/api/orders")
		.set("Cookie", cookie)
		.expect(200);
	expect(response.body[0].ticket.id).toEqual(ticket.id);
	expect(response.body.length).toEqual(1);
});

it("should throw 400 bad request if it does not have a body with a ticketId", async () => {
	await request(app)
		.post("/api/orders")
		.set("Cookie", global.signin())
		.send({})
		.expect(400);
});

it("can only be accessed if the user is signed in", async () => {
	await request(app).post("/api/orders").send({}).expect(401);
});

it("emits an order created event", async () => {
	const ticket = Ticket.build({
		title: "concert",
		price: 20,
	});
	await ticket.save();

	await request(app)
		.post("/api/orders")
		.set("Cookie", global.signin())
		.send({ ticketId: ticket.id })
		.expect(201);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
