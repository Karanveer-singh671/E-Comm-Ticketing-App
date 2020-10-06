import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@ksticketing/common";
import { stripe } from "../../stripe";

jest.mock("../../stripe");

it("returns a 404 when purchasing order that does not exist", async () => {
	await request(app)
		.post("/api/payments")
		.set("Cookie", global.signin())
		.send({
			token: "asdf",
			orderId: mongoose.Types.ObjectId().toHexString(),
		})
		.expect(404);
});

it("returns a 401 when purchasing order that does not belong to the user", async () => {
	// create and save an order
	const order = Order.build({
		id: mongoose.Types.ObjectId().toHexString(),
		userId: mongoose.Types.ObjectId().toHexString(),
		status: OrderStatus.Created,
		version: 0,
		price: 5,
	});
	await order.save();

	// make a request to pay for that saved order and should fail
	await request(app)
		.post("/api/payments")
		.set("Cookie", global.signin())
		.send({
			token: "asdf",
			orderId: order.id,
		})
		.expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
	const userId = mongoose.Types.ObjectId().toHexString();
	// create and save an order
	const order = Order.build({
		id: mongoose.Types.ObjectId().toHexString(),
		userId,
		status: OrderStatus.Cancelled,
		version: 0,
		price: 5,
	});
	await order.save();
	// need to make sure that the userId of order is the same as the current user Id when making a payment request
	await request(app)
		.post("/api/payments")
		.set("Cookie", global.signin(userId))
		.send({
			orderId: order.id,
			token: "asdf",
		})
		.expect(400);
});

it("returns a 201 with valid inputs", async () => {
	const userId = mongoose.Types.ObjectId().toHexString();
	// create and save an order
	const order = Order.build({
		id: mongoose.Types.ObjectId().toHexString(),
		userId,
		status: OrderStatus.Created,
		version: 0,
		price: 5,
	});
	await order.save();

	await request(app)
		.post("/api/payments")
		.set("Cookie", global.signin(userId))
		.send({
			token: "tok_visa",
			orderId: order.id,
		})
		.expect(201);

	const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

	expect(chargeOptions.source).toEqual("tok_visa");
	expect(chargeOptions.amount).toEqual(order.price * 100);
	expect(chargeOptions.currency).toEqual("usd");
});
