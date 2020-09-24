import { Request, Response, NextFunction } from "express";
import { RequestValidationError } from "../errors/request-validation-error";
import { DatabaseConnectionError } from "../errors/database-connection-error";
export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err instanceof RequestValidationError) {
		// delegate each error formatting required for each error class within itself rather than the middleware
		// for scalability if have many custom error subclasses the middleware won't need to know implementation (abstraction)
		return res.status(err.statusCode).send({ errors: err.serializeErrors() });
	}
	if (err instanceof DatabaseConnectionError) {
		return res.status(err.statusCode).send({ errors: err.serializeErrors() });
	}
	// need consistent structure for error handling middleware
	res.status(400).send({
		// string what gave to the Error when threw it
		// errors: [{ message: err.message }],
		// generic error message
		errors: [{ message: "Something went wrong" }],
	});
};
