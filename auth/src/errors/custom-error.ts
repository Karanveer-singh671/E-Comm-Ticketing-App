// want an object like an 'Error' but need to add in custom properties to it -> subclass
// create abstract class to say whatever class extends it must have the following properties
// setup requirements for subclasses and abstract is valid in JS unlike interface
export abstract class CustomError extends Error {
	abstract statusCode: number;

	constructor(message: string) {
		super(message);

		Object.setPrototypeOf(this, CustomError.prototype);
	}

	abstract serializeErrors(): { message: string; field?: string }[];
}
