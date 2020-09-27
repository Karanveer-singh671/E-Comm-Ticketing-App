import "bootstrap/dist/css/bootstrap.css";
// global css added in _app file since this file will be loaded every time a user comes to application
// if do css in any other .js file in pages dir won't show so need to make custom wrapper to include the css
export default ({ Component, pageProps }) => {
	return <Component {...pageProps} />;
};
