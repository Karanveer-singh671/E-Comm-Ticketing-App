import { CustomError } from "./custom-error";
// extends abstract class to make sure implementing custom error classes correctly and have specific properties signatures
// extends since it is a abstract class, could have also used an interface and implemented that for each error class but interfaces not available in JS
export class DatabaseConnectionError extends CustomError {
	statusCode = 500;
	reason = "Error connecting to database";
	constructor() {
		super("Error connecting to db");
		Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
	}

	serializeErrors() {
		return [{ message: this.reason }];
	}
}
