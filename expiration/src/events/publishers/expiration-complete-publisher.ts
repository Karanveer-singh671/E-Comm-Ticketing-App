import {
	Subjects,
	Publisher,
	ExpirationCompleteEvent,
} from "@ksticketing/common";

export class ExpirationCompletePublisher extends Publisher<
	ExpirationCompleteEvent
> {
	readonly subject = Subjects.ExpirationComplete;
}
