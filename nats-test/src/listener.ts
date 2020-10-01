import nats, { Message } from "node-nats-streaming";
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
	// set setManualAckMode to true then won't lose event until set event passed to true
	const options = stan.subscriptionOptions().setManualAckMode(true);
	const subscription = stan.subscribe(
		"ticket:created",
		"listenerQueueGroup",
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
