import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
interface TicketAttrs {
	title: string;
	price: number;
	userId: string;
}

interface TicketDoc extends mongoose.Document {
	title: string;
	price: number;
	userId: string;
	// to add version instead of writing ticket.__v
	version: number;
	orderId?: string
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
		},
		userId: {
			type: String,
			required: true,
		},
		orderId: {
			type: String,
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
// change __v to version (name change)
ticketSchema.set("versionKey", "version");
// use updateIfCurrentPlugin library for concurrency control to process emitted events in order
ticketSchema.plugin(updateIfCurrentPlugin);
ticketSchema.statics.build = (attrs: TicketAttrs) => {
	return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
