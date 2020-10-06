import { Listener, OrderCreatedEvent, Subjects } from "@ksticketing/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated;
	queueGroupName = queueGroupName;

	async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
		// Find the ticket that the order is reserving
		const ticket = await Ticket.findById(data.ticket.id);
		// if no ticket, throw errorHandler
		if (!ticket) {
			throw new Error("Ticket not found");
		}
		//mark the ticket as being reserved by setting its orderId property
		ticket.set({ orderId: data.id });
		// save the ticket
		await ticket.save();

		// emit an event to say that the ticket has been changed to keep services synced
		new TicketUpdatedPublisher(natsWrapper);
		// ack the message
		msg.ack();
	}
}
