// fake implementation for testing
export const natsWrapper = {
	client: {
		// need mock function so can invoke
		publish: jest
			.fn()
			.mockImplementation(
				(subject: string, data: string, callback: () => void) => {
					callback();
				}
			),
	},
};
