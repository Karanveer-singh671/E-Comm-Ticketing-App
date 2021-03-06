import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { OrderCreatedEvent, OrderStatus } from "@ksticketing/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
	// create an instance of the Listener
	const listener = new OrderCreatedListener(natsWrapper.client);
	// create and save the ticket
	const ticket = Ticket.build({
		title: "concert",
		price: 10,
		userId: "asdf",
	});
	await ticket.save();

	// create the fake data event
	const data: OrderCreatedEvent["data"] = {
		id: mongoose.Types.ObjectId().toHexString(),
		version: 0,
		status: OrderStatus.Created,
		userId: "asdf",
		expiresAt: "asdf",
		ticket: {
			id: ticket.id,
			price: ticket.price,
		},
	};
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, ticket, data, msg };
};

it("sets the userId of the ticket", async () => {
	const { listener, data, msg, ticket } = await setup();

	await listener.onMessage(data, msg);

	const updatedTicket = await Ticket.findById(ticket.id);

	expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acks the message", async () => {
	const { listener, data, msg, ticket } = await setup();

	await listener.onMessage(data, msg);
	expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
	const { listener, ticket, data, msg } = await setup();

	await listener.onMessage(data, msg);

	expect(natsWrapper.client.publish).toHaveBeenCalled();

	const ticketUpdatedData = JSON.parse(
		// use jest.Mock to tell typescript this is a mock function so no need to @ts-ignore
		(natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
	);

	expect(data.id).toEqual(ticketUpdatedData.orderId);
});
