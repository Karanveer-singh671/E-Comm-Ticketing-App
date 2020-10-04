import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";

interface TicketAttrs {
	title: string;
	price: number;
}

export interface TicketDoc extends mongoose.Document {
	title: string;
	price: number;
	isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
	build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
			},
		},
	}
);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
	return new Ticket(attrs);
};
// need function keyword not arrow function since using this keyword and modify the method in TicketDoc
ticketSchema.methods.isReserved = async function () {
	// this === the ticket document we just called 'isReserved' on
	const existingOrder = await Order.findOne({
		ticket: this,
		status: {
			$in: [
				// $in is Mongo operator to say find all statuses with the following values -> meaning reserved in this case
				OrderStatus.Created,
				OrderStatus.AwaitingPayment,
				OrderStatus.Complete,
			],
		},
	});
	// turn the existing order to a boolean
	return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
