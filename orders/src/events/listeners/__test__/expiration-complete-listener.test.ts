import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../../models/order";
import { ExpirationCompleteEvent } from "@ksticketing/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
	const listener = new ExpirationCompleteListener(natsWrapper.client);

	const ticket = Ticket.build({
		id: mongoose.Types.ObjectId().toHexString(),
		title: "concert",
		price: 10,
	});
	await ticket.save();
	const order = Order.build({
		status: OrderStatus.Created,
		userId: "asdf",
		expiresAt: new Date(),
		ticket,
	});
	await order.save();

	const data: ExpirationCompleteEvent["data"] = {
		orderId: order.id,
	};
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, order, ticket, data, msg };
};

it("updates the order status to cancelled", async () => {
	const { listener, order, ticket, data, msg } = await setup();
	await listener.onMessage(data, msg);

	const updatedOrder = await Order.findById(order.id);

	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emit an orderCancelledEvent", async () => {
	const { listener, order, ticket, data, msg } = await setup();
	await listener.onMessage(data, msg);
	expect(natsWrapper.client.publish).toHaveBeenCalled();
	// first arg is time it was called 0 is first time called and second argument is data property since first prop is subject
	const eventData = JSON.parse(
		(natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
	);
	expect(eventData.id).toEqual(order.id);
});

it("ack the message", async () => {
	const { listener, order, ticket, data, msg } = await setup();
	await listener.onMessage(data, msg);
	expect(msg.ack).toHaveBeenCalled();
});
