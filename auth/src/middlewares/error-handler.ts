import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";
// express distinguishes between an error handling middleware and normal one by the
// number of arguments that the function accepts
export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err instanceof CustomError) {
		return res.status(err.statusCode).send({ errors: err.serializeErrors() });
	}

	res.status(400).send({
		errors: [{ message: "Something went wrong" }],
	});
};
