import { useEffect, useState } from "react";
const OrderShow = ({ order }) => {
	const [timeLeft, setTimeLeft] = useState("");
	// call only 1 time when component first displays on screen use []
	useEffect(() => {
		const findTimeLeft = () => {
			const msLeft = new Date(order.expiresAt) - new Date();
			setTimeLeft(Math.round(msLeft / 1000));
		};
		// invoke function for the first time since setInterval will call for the first time 1 sec after component loads
		// so would be 1 sec off if did that
		findTimeLeft();
		// will update timer every 1 second and call findTimeLeft in that time and if navigate away need to stop interval
		const timerId = setInterval(findTimeLeft, 1000);
		// return a function inside use effect will be called when navigate away from component but need [] on useEffect
		// else will call clearInterval since it will be renderend
		return () => {
			clearInterval(timerId);
		};
		// put order in array if referencing dependency like order need to add to array
	}, [order]);
	const msLeft = new Date(order.expiresAt) - new Date();

	return <div>Time left to pay: {timeLeft} seconds </div>;
};
OrderShow.getInitialProps = async (context, client) => {
	const { orderId } = context.query;
	const { data } = await client.get(`/api/orders/${orderId}`);
	return { order: data };
};
export default OrderShow;
