import express from "express";

const router = express.Router();

// to sign out send back a header telling browser to empty the cookie
router.post("/api/users/signout", (req, res) => {
	req.session = null;
	// need to send back response so empty object
	res.send({});
});

export { router as signoutRouter };
