// now path nextJS uses will be auth/signup
import { useState } from "react";
import router, { Router } from "next/router";
import useRequest from "../../hooks/use-request";

export default () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { doRequest, errors } = useRequest({
		url: "/api/users/signin",
		method: "post",
		body: {
			email,
			password,
		},
		onSuccess: () => Router.push("/"),
	});
	const onSubmit = async (e) => {
		e.preventDefault();
		// caught error in use-request so will move to router.push regardless so need to throw error in use Request if caught
		// or onSuccess callback ned
		doRequest();
	};

	return (
		<form onSubmit={onSubmit}>
			<h1>Sign In</h1>
			<div className="form-group">
				<label>Email Address</label>
				<input
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="form-control"
					placeholder="Enter Email..."
				/>
				<div className="form-group">
					<label>Password</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="form-control"
						placeholder="Enter Password..."
					/>
				</div>
			</div>
			{errors}
			<button className="btn btn-primary">Sign In</button>
		</form>
	);
};
