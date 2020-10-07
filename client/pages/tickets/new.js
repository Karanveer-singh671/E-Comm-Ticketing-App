import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";
const newTicket = () => {
	const [title, setTitle] = useState("");
	const [price, setPrice] = useState("");
	const { doRequest, errors } = useRequest({
		url: "/api/tickets",
		method: "post",
		body: {
			title,
			price,
		},
		onSuccess: (ticket) => Router.push("/"),
	});

	const onBlur = () => {
		// make sure a user is typing in an actual number
		const value = parseFloat(price);
		if (isNaN(value)) {
			return;
		}
		// setPrice will ROUND TO 2 DECIMALS
		setPrice(value.toFixed(2));
	};
	const onSubmit = (event) => {
		event.preventDefault();

		doRequest();
	};

	return (
		<div>
			<h1>Create a new ticket</h1>
			<form onSubmit={onSubmit}>
				<div className="form-group">
					<label>Title</label>
					<input
						value={title}
						// additional price handling and communicating that on clientSide
						// onBlur is when a user is in a input field and clicks out of input field it triggers onBlur
						onBlur={onBlur}
						onChange={(e) => setTitle(e.target.value)}
						className="form-control"
					/>
				</div>
				<div className="form-group">
					<label>Price</label>
					<input
						value={price}
						onChange={(e) => setPrice(e.target.value)}
						className="form-control"
					/>
				</div>
				{errors}
				<button className="btn btn-primary">Submit</button>
			</form>
		</div>
	);
};

export default newTicket;
