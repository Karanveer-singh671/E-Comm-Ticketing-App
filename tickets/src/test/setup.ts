import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";

declare global {
	namespace NodeJS {
		interface Global {
			// returns Promise that will resolve with array of strings
			signin(): string[];
		}
	}
}
// all tests will look for the mock NATS client 
jest.mock("../nats-wrapper.ts");
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
// as soon as async used typescript will think promise is returned
global.signin = () => {
	// EACH REQUEST SHOULD HAVE A NEW ID
	const id = mongoose.Types.ObjectId().toHexString();
	// build a JWT payload. {id, email}
	const payload = {
		id: id, // randomBytes
		email: "a@a.com",
	};
	// create the JWT! use sign method to create
	const token = jwt.sign(payload, process.env.JWT_KEY!);
	// Build up the session object. {jwt: MY_JWT}
	const session = {
		jwt: token,
	};
	// Turn that session into json
	const sessionJSON = JSON.stringify(session);
	// Take JSON and encode it as base64 string
	const base64 = Buffer.from(sessionJSON).toString("base64");
	// return a string thats the cookie with the encoded data
	// expectation with supertest is to include all cookies into an array
	return [`express:sess=${base64}`];
};
