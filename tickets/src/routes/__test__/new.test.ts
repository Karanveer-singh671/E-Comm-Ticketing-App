import request from "supertest";
import { app } from "../../app";

it("Should have a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app)
  .post('/api/tickets')
  .send({})
  // should not be have a 404 status
  expect(response.status).not.toEqual(404)
});

it("can only be accessed if the user is signed in", async () => {});

it("returns an error if an invalid title is provided", async () => {});

it("returns an error if an invalid price is provided", async () => {});

it("should create a ticket with valid inputs", async () => {});
