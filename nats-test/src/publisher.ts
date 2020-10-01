import nats from "node-nats-streaming";
// client is often referred to as 'stan' in documentation
const stan = nats.connect("ticketing", "abc", {
	url: "http://localhost:4222",
}); // client

// have to take event driven approach
stan.on("connect", () => {
	console.log("Publisher connected to NATS");
});
