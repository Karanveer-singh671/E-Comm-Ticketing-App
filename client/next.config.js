module.exports = {
	// file automatically loaded when start nextJS, reads and calls config
	// instead of watch, just pull all files inside our project directory every 300 ms
	webpackDevMiddleware: (config) => {
		config.watchOptions.poll = 300;
		return config;
	},
};
