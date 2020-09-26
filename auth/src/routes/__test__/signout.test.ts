import request from "supertest";
import { app } from "../../app";

it("Should clear the cookie after signing out", async () => {
	// sign up
	await request(app)
		.post("/api/users/signup")
		.send({
			email: "a@a.com",
			password: "password",
		})
		.expect(201);

	const response = await request(app)
		.post("/api/users/signout")
		.send({
			// send empty object since post request
		})
		.expect(200);

	expect(response.get("Set-Cookie")).toBeDefined();
});
