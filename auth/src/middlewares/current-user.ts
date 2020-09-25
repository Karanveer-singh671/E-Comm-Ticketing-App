import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// create interface of what payload will be
interface UserPayLoad {
	id: string;
	email: string;
}

// how to reach into existing type definition and make modification to it
// This tells Typescript that inside the express project
// find interface of Request already there and add this property that may or may not be defined
declare global {
	namespace Express {
		// do not need to extend an existing interface
		interface Request {
			// added currentUser property to req
			currentUser?: UserPayLoad;
		}
	}
}

// used to check if user logged in or not
// when any other route handler needs to know who the current user is we can use this middleware
export const currentUser = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// if no session exists or jwt then move to next middleware in chain
	if (!req.session?.jwt) {
		return next();
	}

	// if exists need to decode and see if hasn't been modified
	try {
		// now payload will be of the type UserPayLoad instead of string | object
		const payload = jwt.verify(
			req.session!.jwt,
			process.env.JWT_KEY!
		) as UserPayLoad;
		// set currentUser to be the payload since signature verified successfully
		req.currentUser = payload;
	} catch (err) {}
	// go to next middleware
	next();
};
