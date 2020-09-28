import axios from "axios";

const LandingPage = ({ currentUser }) => {
	console.log("LandingPage -> I am in the component", currentUser);
	return <h1>Landing Page</h1>;
};
// get initial props is our chance to get data that we need in our application during SSR process! e.g current User
// when we try to receive this component this method is called first
LandingPage.getInitialProps = async () => {
	if (typeof window === "undefined") {
		// we are on the server so requests should be made to http://ingress-nginx.ingress-nginx.svc.cluster.local
		const response = await axios.get(
			"http://ingress-nginx-controler.ingress-nginx.svc.cluster.local//api/users/currentuser",
			{
				headers: {
					Host: "ticketing.dev",
				},
			}
		);
		return response.data;
	} else {
		// on the browser since window exists requests can be made w/ base url of ''
		const response = await axios.get("/api/users/currentuser");
		return response.data;
	}
	return {};
};

export default LandingPage;
