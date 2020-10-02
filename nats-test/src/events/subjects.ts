// save event name as hard coded string inside enum and can reference from Subjects enum instead of hardcoded inside each file
export enum Subjects {
	TicketCreated = "ticket:created",
	OrderUpdated = "order:updated",
}

const printSubject = (subject: Subjects) => {};
