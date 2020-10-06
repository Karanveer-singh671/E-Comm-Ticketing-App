import {
	Listener,
	ExpirationCompleteEvent,
	Subjects,
	OrderStatus,
} from "@ksticketing/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class ExpirationCompleteListener extends Listener<
	ExpirationCompleteEvent
> {
	readonly subject = Subjects.ExpirationComplete;
	queueGroupName = queueGroupName;

	async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
		const order = await Order.findById(data.orderId).populate("ticket");

		if (!order) {
			throw new Error("Order Not Found");
		}
		// expiration has been complete so update the order status to cancelled
		order.set({
			status: OrderStatus.Cancelled,
		});
		await order.save();
		// emit a order cancelled event
		await new OrderCancelledPublisher(this.client).publish({
			id: order.id,
			version: order.version,
			ticket: {
				id: order.ticket.id,
			},
		});

		msg.ack();
	}
}
