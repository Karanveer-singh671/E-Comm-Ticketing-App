import { Listener } from "./base-listener";
import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
	// provide type annotation so won't change type of subject to anything else
	// or use readonly!
	readonly subject = Subjects.TicketCreated;
	queueGroupName = "payments-service";
	onMessage(data: TicketCreatedEvent["data"], msg: Message) {
		// handle what need to do from Message
		console.log("Event Data!", data);
		// mark message as successful parsed
		msg.ack();
	}
}
