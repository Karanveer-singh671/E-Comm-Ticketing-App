import {
	OrderCancelledEvent,
	Subjects,
	Listener,
	OrderStatus,
} from "@ksticketing/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
	readonly subject = Subjects.OrderCancelled;
	queueGroupName = queueGroupName;

	async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
		// find record with appropriate id and version need to findOne since may be multiple with ids
		const order = await Order.findOne({
			_id: data.id,
			version: data.version - 1,
		});

		if (!order) {
			throw new Error("Order not Found");
		}
		order.set({ status: OrderStatus.Cancelled });
		await order.save();
		msg.ack();
	}
}
