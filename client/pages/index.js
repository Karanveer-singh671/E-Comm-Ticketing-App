import axios from "axios";

const LandingPage = ({ curretnUser }) => {
	console.log("LandingPage -> I am in the component", curretnUser);
	return <h1>Landing Page</h1>;
};
// get initial props is our chance to get data that we need in our application during SSR process! e.g current User
// when we try to receive this component this method is called first
LandingPage.getInitialProps = async () => {
	const response = await axios.get("/api/users/currentuser");

	return response.data;
};

export default LandingPage;
