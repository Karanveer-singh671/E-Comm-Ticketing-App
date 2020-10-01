import nats, { Message, Stan } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
	url: "http://localhost:4222",
});

stan.on("connect", () => {
	console.log("Listener is connected NATS");

	stan.on("close", () => {
		console.log("NATS connection closed!");
		// close client
		process.exit();
	});

	new TicketCreatedListener(stan).listen();

	// set setManualAckMode to true then won't lose event until set event passed to true
	// get history of events setDeliverAllAvailable() if service goes down but if list of events super large
	// -> durable subscription to see if a service has processed that event and NATS will store what events a service has processed and what missed out on
	// when service comes back online with same client ID it will send what need to process (instead of process all events over again)
	// still need setDeliverAllAvailable since bring a service online for the first time can get all events emitted in the past
	// then when restart service will only send unprocessed events from there
	const options = stan
		.subscriptionOptions()
		.setDeliverAllAvailable()
		.setDurableName("some-service")
		.setManualAckMode(true);
	const subscription = stan.subscribe(
		"ticket:created",
		"listenerQueueGroup", // makes sure even if we disconnect will not dump away durable service storage and only send event to one service
		options
	);
	subscription.on("message", (msg: Message) => {
		const data = msg.getData();

		if (typeof data === "string") {
			console.log(
				`Received event # ${msg.getSequence()}, with data: ${JSON.parse(data)}`
			);
		}
		// event has been processed and acknowledged
		msg.ack();
	});
});
// when restart a listener call close
process.on("SIGINT", () => stan.close());

process.on("SIGTERM", () => stan.close());

// every listerer will need what is inside the listener abstract class
abstract class Listener {
	abstract onMessage(data: any, msg: Message): void;
	abstract subject: string;
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

class TicketCreatedListener extends Listener {
	subject = "ticket:created";
	queueGroupName = "payments-service";
	onMessage(data: any, msg: Message) {
		// handle what need to do from Message
		console.log("Event Data!", data);
		// mark message as successful parsed
		msg.ack();
	}
}