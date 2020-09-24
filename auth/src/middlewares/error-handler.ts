import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";
export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// since calling Custom Error abstract class won't need to do instance of each custom error create only need to do once within middleware
	if (err instanceof CustomError) {
		// delegate each error formatting required for each error class within itself rather than the middleware
		// for scalability if have many custom error subclasses the middleware won't need to know implementation (abstraction)
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
