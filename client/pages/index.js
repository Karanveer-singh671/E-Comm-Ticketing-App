import axios from "axios";
import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
	return currentUser ? (
		<h1>You are signed in</h1>
	) : (
		<h1> you are not signed in</h1>
	);
};
// get initial props is our chance to get data that we need in our application during SSR process! e.g current User
// when we try to receive this component this method is called first
LandingPage.getInitialProps = async (context) => {
	const client = await buildClient(context);
	const { data } = await client.get("/api/users/currentuser");
	return data;
};

export default LandingPage;
