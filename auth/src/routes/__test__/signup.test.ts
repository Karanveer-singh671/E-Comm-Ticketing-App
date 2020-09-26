import request from "supertest";
import { app } from "../../app";
import { Password } from "../../services/password";
// return or await request
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

it("should return a 400 with an invalid email", async () => {
	return request(app)
		.post("/api/users/signup")
		.send({
			// body of request
			email: "acom",
			password: "password",
		})
		.expect(400);
});

it("should return a 400 with an invalid password", async () => {
	return request(app)
		.post("/api/users/signup")
		.send({
			// body of request
			email: "a@a.com",
			password: "1",
		})
		.expect(400);
});

it("should return a 400 with missing email and/or password", async () => {
	await request(app).post("/api/users/signup").send({
		// body of request
		email: "a@a.com",
	});
	await request(app)
		.post("/api/users/signup")
		.send({
			// body of request
			password: "12345",
		})
		.expect(400);
	await request(app)
		.post("/api/users/signup")
		.send({
			// body of request
		})
		.expect(400);
});

it("does not allow duplicate emails", async () => {
	await request(app)
		.post("/api/users/signup")
		.send({
			// body of request
			email: "a@a.com",
			password: "password",
		})
		.expect(201);
	await request(app)
		.post("/api/users/signup")
		.send({
			email: "a@a.com",
			Password: "123456",
		}) // duplicate
		.expect(400);
});
//  session object will turn to string by cookie session
//  then the cookie session middleware will try to send back cookie to user browser inside response
//  to send the info back the cookie session will send a header of set-cookie in the response
it("sets a cookie after successful signup", async () => {
	// the await call returns the entire response by super test so can store in const
	const response = await request(app)
		.post("/api/users/signup")
		.send({
			// body of request
			email: "a@a.com",
			password: "password",
		})
		.expect(201);

	expect(response.get("Set-Cookie")).toBeDefined();
});
