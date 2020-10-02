import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();
// client is often referred to as 'stan' in documentation
const stan = nats.connect("ticketing", "abc", {
	url: "http://localhost:4222",
}); // client

// have to take event driven approach
stan.on("connect", async () => {
	console.log("Publisher connected to NATS");

	const publisher = new TicketCreatedPublisher(stan);
	// publish is a async event so need to do await so
	// manually return a new promise in the publish function and resolve reject there
	// now can use await keyword here since returning a promise
	await publisher.publish({
		id: "123",
		title: "c",
		price: 10,
	});
});
