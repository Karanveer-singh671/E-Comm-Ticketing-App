import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from './events/ticket-created-listener';

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


