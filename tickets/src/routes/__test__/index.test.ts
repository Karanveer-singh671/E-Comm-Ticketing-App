import request from "supertest";
import { app } from "../../app";

const createTicket = () => {
	return request(app).post("/api/tickets").set("Cookie", global.signin()).send({
		title: "dsj",
		price: 20,
	});
};

it("can fetch a list of tickets", async () => {
	await createTicket();
	await createTicket();
	await createTicket();

	const response = await request(app).post("/api/tickets").send().expect(200);

	expect(response.body.length).toEqual(3);
});
