import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// used to see if user logged in since React app will not be able to look at the cookie and check if has a valid JWT
router.get("/api/users/currentUser", (req, res) => {
	// if session or jwt does not exist then the user is not logged in
	// '!req.session || req.session.jwt' === to '!req.session?.jwt'
	// '?' used to see if property exists or not
	if (!req.session?.jwt) {
		return res.send({ currentUser: null });
	}
	// verify the signature of the JWT to make sure that the jwt has not been modified by the user in any way
	// if the jwt has not been modified by the user, the decoded payload
	try {
		const payload = jwt.verify(req.session!.jwt, process.env.JWT_KEY!);
		res.send({ currentUser: payload });
	} catch (err) {
		res.send({ currentUser: null });
	}
});

export { router as currentUserRouter };
