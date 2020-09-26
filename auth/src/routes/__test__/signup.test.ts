import request from "supertest";
import { app } from "../../app";

it("should return a 201 on a successful signup", async () => {
	return request(app)
		.post("/api/users/signup")
		.send({
			// body of request
			email: "a@a.com",
			password: "password",
		})
		.expect(201);
});
