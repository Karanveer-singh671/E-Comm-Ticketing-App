import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@ksticketing/common";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { NotFoundError } from "../../../common/src/errors/not-found-error";
import { OrderStatus } from "../../../common/src/events/types/order-status";
import { BadRequestError } from "../../../common/src/errors/bad-request-error";
const router = express.Router();

router.post(
	"/api/orders",
	requireAuth,
	[
		body("ticketId")
			.not()
			.isEmpty()
			.custom((input: string) => mongoose.Types.ObjectId.isValid(input))
			.withMessage("TicketId must be provided"),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		// Find the ticket the user is trying to order in the Database
		const { ticketId } = req.body;
		// Make sure that this ticket is not already reserved
		const ticket = await Ticket.findById(ticketId);

		if (!ticket) {
			throw new NotFoundError();
		}

		// run query to look at all order. Find an order where the ticket is the ticket we just found and the order status is
		// not cancelled. If we find an order from that means the ticket is reserved

		// find where ticket in db is ticket that got on line 25
		const isReserved = await ticket.isReserved();
		if (isReserved) {
			throw new BadRequestError("Ticket is already reserved");
		}
		// Calculate expiration date for the Order

		// build the order and save to the Database

		// publish an event saying that an order was created
		res.send({});
	}
);

export { router as newOrderRouter };
