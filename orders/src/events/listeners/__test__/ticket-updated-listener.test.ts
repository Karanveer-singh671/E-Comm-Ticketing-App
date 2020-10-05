import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import mongoose from "mongoose";
import { TicketUpdatedEvent } from "@ksticketing/common";
import { Message } from "node-nats-streaming";
const setup = async () => {
	// create a Listener
	const listener = new TicketUpdatedListener(natsWrapper.client);
	// create and save a ticket
	const ticket = Ticket.build({
		id: mongoose.Types.ObjectId().toHexString(),
		title: "concert",
		price: 10,
	});
	await ticket.save();
	// create a fake data object
	const data: TicketUpdatedEvent["data"] = {
		id: ticket.id,
		version: ticket.version + 1,
		title: "newTitle",
		price: 1000,
		userId: "asdnhdshn",
	};
	// create a fake msg object
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};
	// return all
	return { listener, ticket, data, msg };
};

it("finds, updates, and saves a ticket", async () => {
	const { data, listener, msg, ticket } = await setup();

	await listener.onMessage(data, msg);

	const updatedTicket = await Ticket.findById(ticket.id);

	expect(updatedTicket!.title).toEqual(data.title);
	expect(updatedTicket!.price).toEqual(data.price);
	expect(updatedTicket!.version).toEqual(data.version);
});

it("acks the message", async () => {
	const { msg, data, listener } = await setup();

	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event has a skipped version number", async () => {
	const { msg, data, ticket, listener } = await setup();
	data.version = 10;
	// use try catch so won't throw error because then will return an error in test suite
	try {
		await listener.onMessage(data, msg);
	} catch (err) {}
	expect(msg.ack).not.toHaveBeenCalled();
});
