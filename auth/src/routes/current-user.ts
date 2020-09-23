import express from "express";
const router = express.Router();

router.get("/api/users/currentUser", (erq, res) => {
	res.send("Hello");
});

export { router as currentUserRouter };
