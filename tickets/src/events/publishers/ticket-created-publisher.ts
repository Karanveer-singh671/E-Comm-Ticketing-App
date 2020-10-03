import { Publisher, Subjects, TicketCreatedEvent } from "@ksticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	// not allowed to change this value
	readonly subject = Subjects.TicketCreated;
}
