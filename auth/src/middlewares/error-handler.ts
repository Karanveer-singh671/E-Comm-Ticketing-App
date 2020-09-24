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
		const formattedErrors = err.errors.map((err) => {
			return { message: err.msg, field: err.param };
		});
		return res.status(400).send({ errors: formattedErrors });
	}
	if (err instanceof DatabaseConnectionError) {
		return res.status(500).send({ errors: [{ message: err.reason }] });
	}
	// need consistent structure for error handling middleware
	res.status(400).send({
		// string what gave to the Error when threw it
		// errors: [{ message: err.message }],
		// generic error message
		errors: [{ message: "Something went wrong" }],
	});
};
