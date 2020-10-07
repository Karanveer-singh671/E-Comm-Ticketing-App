import { useEffect, useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";
import StripeCheckout from "react-stripe-checkout";
const OrderShow = ({ order, currentUser }) => {
	const [timeLeft, setTimeLeft] = useState(0);
	const { doRequest, errors } = useRequest({
		url: "/api/payments",
		method: "post",
		body: {
			orderId: order.id,
		},
		onSuccess: (payment) => Router.push("/orders"),
	});
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

	if (timeLeft < 0) {
		return <div>Order Expired</div>;
	}
	const msLeft = new Date(order.expiresAt) - new Date();

	return (
		<div className=" centre display-4">
			Payment With Stripe
			<div class="py-5">
				<div class="row">
					<div class="col-lg-8 mx-auto">
						<div className="rounded bg-gradient-2 text-black shadow p-5 text-center mb-5">
							<p class="mb-4 font-weight-normal text-uppercase">
								Time left to pay: {timeLeft} seconds
							</p>
							<StripeCheckout
								token={({ id }) => doRequest({ token: id })}
								stripeKey="pk_test_j4FVORmnyI2bG6DlBqeqcnAC"
								amount={order.ticket.price * 100}
								email={currentUser.email}
							/>
							{errors}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
OrderShow.getInitialProps = async (context, client) => {
	const { orderId } = context.query;
	const { data } = await client.get(`/api/orders/${orderId}`);
	return { order: data };
};
export default OrderShow;
