import { OrderCancelledEvent, Subjects, Listener } from "@ksticketing/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
	readonly subject = Subjects.OrderCancelled;
	queueGroupName = queueGroupName;

	async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
		// need to await since won't be able to find ticket or set / save async operation
		const ticket = await Ticket.findById(data.ticket.id);

		if (!ticket) {
			throw new Error("Ticket Not Found");
		}
		ticket.set({ orderId: undefined });

		await ticket.save();
		// emit publishing event to keep ticket version in sync with order service
		await new TicketUpdatedPublisher(this.client).publish({
			id: ticket.id,
			orderId: ticket.orderId,
			version: ticket.version,
			title: ticket.title,
			price: ticket.price,
			userId: ticket.userId,
		});
		// ack the message
		msg.ack();
	}
}
