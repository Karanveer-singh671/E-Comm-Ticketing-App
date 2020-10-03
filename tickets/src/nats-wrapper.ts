import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
	private _client?: Stan; // '?' might be undefined for some period of time
  // getter to get the client (defines client property on the instance so don't call with client())
	get client() {
		if (!this._client) {
			throw new Error("Cannot access NATS client before connecting");
		}
		return this._client;
	}
	connect(clusterId: string, clientId: string, url: string): Promise<void> {
		this._client = nats.connect(clusterId, clientId, { url });
		return new Promise((resolve, reject) => {
			this._client!.on("connect", () => {
				console.log("Connected to NATS");
				resolve();
			});
			this._client!.on("error", (err) => {
				reject(err);
			});
		});
	}
}

// export single instance of a client that will be shared among the specified files
export const natsWrapper = new NatsWrapper();
