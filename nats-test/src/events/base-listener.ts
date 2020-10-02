import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
	subject: Subjects;
	data: any;
}
// set up listener as generic class so when try to extend listener need to provide custom type to it!
// 'T' is like an argument for types
export abstract class Listener<T extends Event> {
	abstract onMessage(data: T['data'], msg: Message): void;
	// subject is subject provided as the argument!
	abstract subject: T['subject'];
	abstract queueGroupName: string;
	private client: Stan;
	protected ackWait = 5 * 1000;

	constructor(client: Stan) {
		this.client = client;
	}
	subscriptionOptions() {
		return this.client
			.subscriptionOptions()
			.setDeliverAllAvailable()
			.setManualAckMode(true)
			.setAckWait(this.ackWait)
			.setDurableName(this.queueGroupName);
	}
	listen() {
		const subscription = this.client.subscribe(
			this.subject,
			this.queueGroupName,
			this.subscriptionOptions()
		);
		subscription.on("message", (msg: Message) => {
			console.log(`Message Received: ${this.subject} / ${this.queueGroupName}`);

			const parsedData = this.parseMessage(msg);
			this.onMessage(parsedData, msg);
		});
	}
	parseMessage(msg: Message) {
		const data = msg.getData();
		return typeof data === "string"
			? JSON.parse(data)
			: // how to get data from a buffer
			  JSON.parse(data.toString("utf8"));
	}
}
