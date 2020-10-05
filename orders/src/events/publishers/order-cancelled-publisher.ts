import { Subjects, Publisher, OrderCancelledEvent } from "@ksticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	readonly subjects = Subjects.OrderCancelled;
}
