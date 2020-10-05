import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@ksticketing/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
	readonly subject = Subjects.TicketUpdated;
	queueGroupName = queueGroupName;

	async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
		const ticket = await Ticket.findOne({
			// underscore id since in mongo it is saved like this and will only change when we call toJSON
			_id: data.id,
			// version for the listener should have the event version - 1 (event should have updated version to update the service's old version)
			version: data.version - 1,
		});
		const { title, price } = data;
		if (!ticket) {
			throw new Error("Ticket not found");
		}

		ticket.set({
			title,
			price,
		});
		await ticket.save();

		msg.ack();
	}
}
