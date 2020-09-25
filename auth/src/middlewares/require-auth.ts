import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors/not-authorized-error";
// prevents access to routes if user is not logged in to protect specific endpoints
export const requireAuth = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// current user doesn't exist throw Error
	if (!req.currentUser) {
		throw new NotAuthorizedError();
	}
	// otherwise we go to next middleware
	next();
};
