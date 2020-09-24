export abstract class CustomError extends Error {
	// abstract here used to say the class that extends the CustomError class must have statusCode
	// very similar to interface for type checking but abstract classes implemented in JS so can use
	// instance of property within the middleware just once and use instance of CustomError
	abstract statusCode: number;
	// add message property for server logging (won't be sent out to user side)
	constructor(message: string) {
		// needed for defining constructor equivalent to calling new Error()
		super(message);
		// special line to extend a built in class
		Object.setPrototypeOf(this, CustomError.prototype);
	}
	// must include serializeErrors method format array of objects containing message as string and optional field as string
	abstract serializeErrors(): { message: string; field?: string }[];
}
