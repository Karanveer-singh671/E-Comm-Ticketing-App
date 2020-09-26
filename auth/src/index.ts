import mongoose from "mongoose";
import { app } from "./app";
const start = async () => {
	// do this check so know when we do deploy that something is wrong not after when applicaton has been running for some time
	if (!process.env.JWT_KEY) {
		throw new Error("JWT_KEY must be defined in yaml file");
	}
	try {
		await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log("Connected to MongoDb");
	} catch (err) {
		console.error(err);
	}

	app.listen(3000, () => {
		console.log("Listening on port 3000!!!!!!!!");
	});
};

start();
