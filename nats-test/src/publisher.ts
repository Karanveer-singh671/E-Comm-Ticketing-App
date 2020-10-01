import nats from "node-nats-streaming";
// client is often referred to as 'stan' in documentation
const stan = nats.connect("ticketing", "abc", {
	url: "http://localhost:4222",
}); // client

// have to take event driven approach
stan.on("connect", () => {
	console.log("Publisher connected to NATS");
});

const data = JSON.stringify({
	id: "123",
	title: "concert",
	price: 20,
});
// subject name and data (referred to as a message, even tho it is an event) as params
stan.publish("ticket:created", data, () => {
	console.log("Event Published");
});
