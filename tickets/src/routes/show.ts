import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { NotFoundError } from "@ksticketing/common";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
	const ticket = await Ticket.findById(req.params.id);
	if (!ticket) {
		throw new NotFoundError();
	}
	// if leave off status code will default to 200
	res.send(ticket);
});

export { router as showTicketRouter };
