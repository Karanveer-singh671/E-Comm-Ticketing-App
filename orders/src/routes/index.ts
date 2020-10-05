import express, { Request, Response } from "express";
import { requireAuth } from "@ksticketing/common";
import { Order } from "../models/order";
const router = express.Router();
// don't need validateRequest since get request and not checking a body
// find all orders that relate to a particular user
router.get("/api/order", requireAuth, async (req: Request, res: Response) => {
	const orders = await Order.find({
		userId: req.currentUser!.id,
	})
		// fetch the ticket that is associated with the order
		.populate("ticket");

	res.send(orders);
});

export { router as indexOrderRouter };
