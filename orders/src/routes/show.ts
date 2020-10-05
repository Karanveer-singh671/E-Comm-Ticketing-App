import express, { Request, Response } from "express";
import {
	requireAuth,
	NotFoundError,
	NotAuthorizedError,
} from "@ksticketing/common";
import { Order } from "../models/order";
import mongoose from "mongoose";

const router = express.Router();

router.get(
	"/api/orders/:orderId",
	requireAuth,
	async (req: Request, res: Response) => {
		mongoose.Types.ObjectId.isValid(req.params.orderId); // check if valid param
		const order = await Order.findById(req.params.orderId).populate("ticket");
		// if no order then return 404
		if (!order) {
			throw new NotFoundError();
		}
		// if user is not the user associated with order
		if (order.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError();
		}
		res.send(order);
	}
);

export { router as showOrderRouter };
