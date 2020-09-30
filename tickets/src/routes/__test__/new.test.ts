import request from "supertest";
import { app } from "../../app";

it("Should have a route handler listening to /api/tickets for post requests", async () => {
	const response = await request(app).post("/api/tickets").send({});
	// should not be have a 404 status
	expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
	await request(app).post("/api/tickets").send({}).expect(401);
});

it("returns a status other than 401 if user is signed in", async () => {
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", global.signin())
		.send({});

	expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
	await request(app)
		.post("/api/tickets")
		.set("Cookie", global.signin())
		.send({
			title: "",
			price: 10,
		})
		.expect(400);
	await request(app)
		.post("/api/tickets")
		.set("Cookie", global.signin())
		.send({
			price: 10,
		})
		.expect(400);
});

it("returns an error if an invalid price is provided", async () => {
	await request(app)
		.post("/api/tickets")
		.set("Cookie", global.signin())
		.send({
			title: "ticket",
			price: -10,
		})
		.expect(400);
	await request(app)
		.post("/api/tickets")
		.set("Cookie", global.signin())
		.send({
			title: "tickets",
		})
		.expect(400);
});

it("should create a ticket with valid inputs", async () => {});