import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler, NotFoundError } from "@ksticketing/common";

const app = express();
// traffic is being proxy'd to our app thru ingress-nginx
// makes express aware of this and trust this proxy since default is not to trust
app.set("trust proxy", true);
app.use(json());
app.use(
	cookieSession({
		signed: false, // no encryption
		// says when we set equal to test it will be false else we require it to be true
		// to allow supertest to work since it doesn't send request thru https connection
		secure: process.env.NODE_ENV !== "test", // Https connection
	})
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*", async (req, res) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app }; // named export so use curly brace
