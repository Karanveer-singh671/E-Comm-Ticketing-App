import { ValidationError } from "express-validator";

export class RequestValidationError extends Error {
	// private errors is same as putting this.errors = errors inside constructor
	constructor(public errors: ValidationError[]) {
		super();

		// To extend a built in class need line below
		Object.setPrototypeOf(this, RequestValidationError.prototype);
	}
}
