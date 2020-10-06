import { Subjects, Publisher, PaymentCreatedEvent } from "@ksticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	readonly subject = Subjects.PaymentCreated;
}
