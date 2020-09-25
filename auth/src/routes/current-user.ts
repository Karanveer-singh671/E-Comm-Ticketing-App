import express from "express";
import jwt from "jsonwebtoken";
import { currentUser } from "../middlewares/current-user";
import { requireAuth } from "../middlewares/require-auth";

const router = express.Router();

// used to see if user logged in since React app will not be able to look at the cookie and check if has a valid JWT
router.get("/api/users/currentUser", currentUser, requireAuth, (req, res) => {
	// abstracted information to middleware
	res.send({
		// set as current user or null so won't default to undefined
		currentUser: req.currentUser || null,
	});
});

export { router as currentUserRouter };
