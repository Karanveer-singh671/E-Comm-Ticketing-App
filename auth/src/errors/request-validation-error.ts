import { ValidationError } from "express-validator";

export class RequestValidationError extends Error {
  statusCode = 400
	// private errors is same as putting this.errors = errors inside constructor
	constructor(public errors: ValidationError[]) {
		super();

		// To extend a built in class need line below
		Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  // add this method so error-handling middleware does not need to know about each specific error class 
  // then can just return the associated methods in the middleware
  serializeErrors() {
    return this.errors.map((err) => {
			return { message: err.msg, field: err.param };
		});
  }
}
