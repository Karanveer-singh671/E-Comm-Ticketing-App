import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

declare global {
	namespace NodeJS {
		interface Global {
			// returns Promise that will resolve with array of strings
			signin(): Promise<string[]>;
		}
	}
}

let mongo: any;
// before any tests start up create MongoMemoryServer instance in memory
// allow us to run multiple different test suites at same time across different micro-services
// w/ out them trying to reach to same instance of MongoDB
// define a hook function here that will run before all our tests
beforeAll(async () => {
	process.env.JWT_KEY = "someString"; // set here for testing since this environment variable only gets defined when we run our code inside a pod
	mongo = new MongoMemoryServer();
	const mongoUri = await mongo.getUri();

	// connect mongoose to in memory MongoMemoryServer
	await mongoose.connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
});
// before each test is run hook, reset all data before each test
beforeEach(async () => {
	const collections = await mongoose.connection.db.collections();
	for (let collection of collections) {
		// delete all documents in a collection
		await collection.deleteMany({});
	}
});
// disconnect from mongo server instance after all tests complete
afterAll(async () => {
	await mongo.stop();
	await mongoose.connection.close();
});

// use global so don't need to import for each test file using
global.signin = async () => {
	const email = "a@a.com";
	const password = "password";

	const response = await request(app)
		.post("/api/users/signup")
		.send({
			email,
			password,
		})
		.expect(201);

	const cookie = response.get("Set-Cookie");

	return cookie;
};
