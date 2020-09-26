import request from "supertest";
import { app } from "../../app";
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
  await request(app)
  .post("/api/users/signup")
  .send({
    // body of request
    email: "a@a.com",
  })
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
