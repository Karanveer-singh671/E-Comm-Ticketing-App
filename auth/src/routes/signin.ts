import express from "express";
const router = express.Router();

router.post("/api/users/signin", (erq, res) => {
	res.send("Hello");
});

export { router as signinRouter };
