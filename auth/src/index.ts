import express from "express";
// if throw an error express automatically sends to error handling middleware
// if have an async route need the request to receive the next function and need next(new Error)instead of throw new error
// solution install express-async-errors
import "express-async-errors";
import { json } from "body-parser";
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

app.listen(3000, () => {
	console.log("Listening on port 3000!!!!");
});
