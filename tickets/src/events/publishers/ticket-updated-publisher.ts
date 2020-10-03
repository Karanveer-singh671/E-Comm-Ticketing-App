import { Publisher, Subjects, TicketUpdatedEvent } from "@ksticketing/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	// not allowed to change this value
	readonly subject = Subjects.TicketUpdated;
}
