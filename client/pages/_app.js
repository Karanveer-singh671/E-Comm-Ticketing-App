import "bootstrap/dist/css/bootstrap.css";
// global css added in _app file since this file will be loaded every time a user comes to application
// if do css in any other .js file in pages dir won't show so need to make custom wrapper to include the css
import buildClient from "../api/build-client";
const AppComponent = ({ Component, pageProps, currentUser }) => {
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
	// call getInitialProps for individual page since when add in appComponent get Initial props the page
  // get InitialProps are no longer invoked, do a check to make sure the page has getInitialProps since 
  // some pages do not have getInitialProps
	let pageProps;
	if (appContext.Component.getInitialProps) {
		const pageProps = await appContext.Component.getInitialProps(
			appContext.ctx
		);
  }
  return {
    pageProps,
    currentUser: data.currentUser
  }
};
export default AppComponent;
