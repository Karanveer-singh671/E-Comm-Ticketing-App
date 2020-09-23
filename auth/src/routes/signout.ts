import express from "express";
const router = express.Router();

router.post("/api/users/signout", (erq, res) => {
	res.send("Hello");
});

export { router as signoutRouter };
