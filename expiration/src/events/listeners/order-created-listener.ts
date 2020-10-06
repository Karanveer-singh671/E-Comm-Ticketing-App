import { Listener, OrderCreatedEvent, Subjects } from "@ksticketing/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated;
	queueGroupName = queueGroupName;

	async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
		// create new job and queue it
		await expirationQueue.add({
			// orderId comes from data part of OrderCreatedEvent
			orderId: data.id,
		});

		msg.ack();
	}
}
