import express, { Request, Response } from "express";
import { Order, OrderStatus } from "../models/order";
import { NotFoundError, NotAuthorizedError } from "@ksticketing/common";

const router = express.Router();
router.delete("/api/orders/:orderId", async (req: Request, res: Response) => {
	const { orderId } = req.params;

	const order = await Order.findById(orderId);

	if (!order) {
		throw new NotFoundError();
	}
	if (order.userId !== req.currentUser!.id) {
		throw new NotAuthorizedError();
	}
	order.status = OrderStatus.Cancelled;
	await order.save();

	// TODO publish an event to say order was cancelled

	res.status(204).send(order);
});

export { router as deleteOrderRouter };
