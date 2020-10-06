import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { OrderCancelledEvent } from "@ksticketing/common";
import { Message } from "node-nats-streaming";
const setup = async () => {
	const listener = new OrderCancelledListener(natsWrapper.client);
	const orderId = mongoose.Types.ObjectId().toHexString();
	// oirderId does not exist when build a ticket only when create or cancel an order so if want to add
	const ticket = Ticket.build({ title: "concert", price: 10, userId: "asdf" });
	// need to set property after building (PUT)
	ticket.set({ orderId: orderId });
	await ticket.save();

	const data: OrderCancelledEvent["data"] = {
		id: orderId,
		version: 0,
		ticket: {
			id: ticket.id,
		},
	};
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, ticket, orderId, data, msg };
};

it("updates the ticket order cancelled (remove orderId), publishes the event to keep version field in sync between ticket and order service, and acks the message", async () => {
	const { data, msg, listener, orderId, ticket } = await setup();

	await listener.onMessage(data, msg);

	const updatedTicket = await Ticket.findById(ticket.id);
	expect(updatedTicket!.orderId).not.toBeDefined();
	expect(msg.ack()).toHaveBeenCalled();
	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
