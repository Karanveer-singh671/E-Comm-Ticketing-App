import { Listener } from "./base-listener";
import { Message } from "node-nats-streaming";
export class TicketCreatedListener extends Listener {
	subject = "ticket:created";
	queueGroupName = "payments-service";
	onMessage(data: any, msg: Message) {
		// handle what need to do from Message
		console.log("Event Data!", data);
		// mark message as successful parsed
		msg.ack();
	}
}
