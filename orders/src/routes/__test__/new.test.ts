import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("returns an error if the ticket does not exist", async () => {
	const ticketId = mongoose.Types.ObjectId();

	await request(app)
		.post("/api/orders")
		.set("Cookie", global.signin())
		.send({ ticketId })
		.expect(404);
});

it("returns an error if the ticket is already reserved", async () => {});

it("reserves a ticket", async () => {});

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
