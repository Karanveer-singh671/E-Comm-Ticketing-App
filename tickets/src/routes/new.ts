import express, { Request, Response } from "express";
import { requireAuth } from "@ksticketing/common";

const router = express.Router();

router.post("/api/tickets", requireAuth, (req: Request, res: Response) => {
	res.sendStatus(200);
});

router;

export { router as createTicketRouter };
