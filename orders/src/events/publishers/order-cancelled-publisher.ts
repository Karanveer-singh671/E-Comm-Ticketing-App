import { Subjects, Publisher, OrderCancelledEvent } from "@ksticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
