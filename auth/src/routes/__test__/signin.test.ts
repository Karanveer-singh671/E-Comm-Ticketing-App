import request from "supertest";
import { app } from "../../app";

it("should fail when a email that does not exist is given", async () => {
	await request(app)
		.post("/api/users/signin")
		.send({
			email: "a@a.com",
			password: "password",
		})
		.expect(400);
});

it('should fail when an incorrect password is given', async() => {
  // need to sign up first for sign in 
  await request(app)
  .post('/api/users/signup')
  .send({
    email: "a@a.com",
    password: "password",
  })
  .expect(201)

  await request(app)
  .post('/api/users/signin')
  .send({
    email: "a@a.com",
    password: "wrongPassword",
  })
  .expect(400)
})

it('responds with a cookie when given valid credentials', async() => {
  // need to sign up first for sign in 
  await request(app)
  .post('/api/users/signup')
  .send({
    email: "a@a.com",
    password: "password",
  })
  .expect(201)

  const response = await request(app)
  .post('/api/users/signin')
  .send({
    email: "a@a.com",
    password: "password",
  })
  .expect(200)

  expect(response.get('Set-Cookie')).toBeDefined()
})
