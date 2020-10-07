import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../../models/user";
import jwt from "jsonwebtoken";
import { validateRequest, BadRequestError } from "@ksticketing/common";
const router = express.Router();

router.post(
	"/api/users/signup",
	[
		body("email").isEmail().withMessage("Email must be valid"),
		body("password")
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage("Password must be between 4 and 20 characters"),
	],
	// validate request middleware should run after validation since runs sequentially
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body;

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			throw new BadRequestError("Email in use");
		}

		const user = User.build({ email, password });
		await user.save();

		// generate JWT and set it into the req.session (created by the cookie-session middleware)
		const userJwt = jwt.sign(
			{
				id: user.id,
				email: user.email,
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

		res.status(201).send(user);
	}
);

export { router as signupRouter };
