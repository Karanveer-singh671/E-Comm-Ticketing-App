import express from "express";
// if throw an error express automatically sends to error handling middleware
// if have an async route need the request to receive the next function and need next(new Error)instead of throw new error
// solution install express-async-errors
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
// for routes that don't exist for any http verb
app.all("*", async () => {
	throw new NotFoundError();
});
app.use(errorHandler);
// need to have inside  variable else some versions of node image won't allow async await otherwise
const start = async () => {
	// to connect to service:port/dbname if dbname does not exist mongoose will create it for us
	try {
		await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log('connected to MongoDB')
	} catch (err) {
		console.log(err);
	}

	app.listen(3000, () => {
		console.log("Listening on port 3000!!!!");
	});
};

start();
