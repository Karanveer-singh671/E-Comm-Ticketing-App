import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-requests";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import { Password } from "../services/password";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
	"/api/users/signin",
	[
		body("email").isEmail().withMessage("Email must be valid"),
		body("password").trim().notEmpty().withMessage("Password must be valid"),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body;

		// get existing user for sign in
		const existingUser = await User.findOne({ email });
		// if user doesn't exist sign in fail
		if (!existingUser) {
			throw new BadRequestError("invalid credentials");
		}
		// user exists, check if the password provided matches
		const passwordsMatch = await Password.compare(
			existingUser.password,
			password
		);
		if (!passwordsMatch) {
			throw new BadRequestError("Invalid credentials");
		}
		// passed all checks so need to assign JWT
		// generate JWT and set it into the req.session (created by the cookie-session middleware)
		const userJwt = jwt.sign(
			{
				id: existingUser.id,
				email: existingUser.email,
			},
			// private key to verify signature
			// '!' at end means we are sure this has been checked and not null | undefined
			process.env.JWT_KEY!
		);
		// type definition file does not want to assume that there is an object on req.session
		// req.session.jwt = {
		// 	jwt: userJwt,
		// };
		// says expression is not null
		req.session!.jwt = userJwt;

		res.status(200).send(existingUser);
	}
);

export { router as signinRouter };
