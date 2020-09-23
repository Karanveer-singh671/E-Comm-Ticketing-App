import express from "express";
const router = express.Router();

router.post("/api/users/signup", (erq, res) => {
	res.send("Hello");
});

export { router as signupRouter };
