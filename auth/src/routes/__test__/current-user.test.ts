import { send } from "process";
import request from "supertest";
import { app } from "../../app";

it("Should respond with details about the current user", async () => {
	const cookie = await global.signin();
	// cookie is given after first request but supertest does not send that cookie thru subsequent requests
	// so server assumes we are not authenticated -> need to create auth helper function
	const response = await request(app)
		.get("/api/users/currentuser")
		// set cookie
		.set("Cookie", cookie)
		.send()
		.expect(200);

	expect(response.body.currentUser.email).toEqual("a@a.com");
});

it("should respond with null if not authenticated", async () => {
	// request should be 200 but no cookie should be set so not authenticated
	const response = await request(app)
		.get("/api/users/currentuser")
		// set cookie
		.send()
		.expect(200);

	expect(response.body.currentUser).toEqual(null);
});
