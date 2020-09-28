import "bootstrap/dist/css/bootstrap.css";
// global css added in _app file since this file will be loaded every time a user comes to application
// if do css in any other .js file in pages dir won't show so need to make custom wrapper to include the css
import buildClient from "../api/build-client";
const AppComponent = ({ Component, pageProps }) => {
	return;
	<div>
		<h1>Header for each page</h1>
		<Component {...pageProps} />
	</div>;
};

// Custom app component getInitialProps has different context from page component get initial props
// context === {req,res} for page
// context === {Component, ctx: {req,res}}
AppComponent.getInitialProps = async (appContext) => {
	const client = buildClient(appContext.ctx);
	const { data } = await client.get("/api/users/currentuser");
	return data;
};
export default AppComponent;
