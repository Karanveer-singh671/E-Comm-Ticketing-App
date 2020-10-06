import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
	requireAuth,
	validateRequest,
	BadRequestError,
	NotAuthorizedError,
	NotFoundError,
	OrderStatus,
} from "@ksticketing/common";
import { Order } from "../models/order";

const router = express.Router();

router.post(
	"/api/payments",
	requireAuth,
	[body("token").not().isEmpty(), body("orderId").not().isEmpty()],
	validateRequest,
	async (req: Request, res: Response) => {
		const { token, orderId } = req.body;

		const order = await Order.findById(orderId);
		// no order throw not found
		if (!order) {
			throw new NotFoundError();
		}
		// make sure that the user that is tied to the order is the equal to the current user
		if (order.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError();
		}
		if (order.status === OrderStatus.Cancelled) {
			throw new BadRequestError("Cannot pay for cancelled order");
		}
		res.send({ success: true });
	}
);

export { router as createChargeRouter };
