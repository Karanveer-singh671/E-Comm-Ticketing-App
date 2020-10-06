import { Subjects, Listener, PaymentCreatedEvent } from "@ksticketing/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order, OrderStatus } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
	readonly subject = Subjects.PaymentCreated;
	queueGroupName = queueGroupName;

	async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
		const order = await Order.findById(data.orderId);

		if (!order) {
			throw new Error("Order not Found");
		}

		order.set({
			status: OrderStatus.Complete,
		});
		order.save();

		msg.ack();
	}
}