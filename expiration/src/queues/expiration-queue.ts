import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { natsWrapper } from "../nats-wrapper";

// create interface to describe properties need in job object
interface Payload {
	orderId: string;
}

// name of bucket in redis server / channel 'can be anything'
// set generic type of queue to be Payload so typescript knows type of data going into queue
const expirationQueue = new Queue<Payload>("order:expiration", {
	redis: {
		host: process.env.REDIS_HOST,
	},
});
// job is not actual data but wraps up data about the job
expirationQueue.process(async (job) => {
	new ExpirationCompletePublisher(natsWrapper.client).publish({
		orderId: job.data.orderId,
	});
});

export { expirationQueue };
