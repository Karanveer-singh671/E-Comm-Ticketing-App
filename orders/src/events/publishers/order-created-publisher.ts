import {
	Publisher,
  OrderCreatedEvent,
  Subjects
} from "@ksticketing/common";


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
}