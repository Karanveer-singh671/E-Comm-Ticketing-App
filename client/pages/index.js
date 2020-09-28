const LandingPage = ({ color }) => {
  console.log("LandingPage -> I am in the component", color)
	return <h1>Landing Page</h1>;
};
// get initial props is our chance to get data that we need in our application during SSR process! e.g current User
// when we try to receive this component this method is called first
LandingPage.getInitialProps = () => {
	"I am on";
	console.log("I am on the server");

	return { color: "red" };
};

export default LandingPage;
