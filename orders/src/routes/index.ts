import express, { Request, Response } from "express";
import { requireAuth } from "@ksticketing/common";
import { Order } from "../models/order";

const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
	const orders = await Order.find({
		// filter orders by person making the requests
		userId: req.currentUser!.id,
	}).populate("ticket");

	res.send(orders);
});

export { router as indexOrderRouter };
