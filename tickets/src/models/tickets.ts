import mongoose from "mongoose";

interface TicketAttrs {
	title: string;
	price: number;
	userId: string;
}
// purpose is if need to add additional properties in the future / if mongo adds properties automatically e.g createdAt
interface TicketDoc extends mongoose.Document {
	title: string;
	price: number;
	userId: string;
}
// to build we need to take in TicketAttrs properties and it should return type TicketDoc since making an instance
interface TicketModel extends mongoose.Model<TicketDoc> {
	build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
	title: {
		// mongoose type (not typescript) hence referring to constructor
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
	// customize Stringify method
	toJSON: {
		transform(doc, ret) {
			// ret is what is being turned to json
			ret.id = ret._id;
			delete ret._id;
		},
	},
});

// only way to build new records so typescript can do type inference on it
ticketSchema.statics.build = (attrs: TicketAttrs) => {
	return new Ticket(attrs);
};
// define ticket model ('Ticket' is name of collection)
const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
