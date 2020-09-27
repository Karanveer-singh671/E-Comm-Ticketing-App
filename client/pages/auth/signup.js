// now path nextJS uses will be auth/signup
import { useState } from "react";

export default () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const onSubmit = (e) => {
		e.preventDefault();
		console.log(email, password);
	};

	return (
		<form onSubmit={onSubmit}>
			<h1>Sign Up</h1>
			<div className="form-group">
				<label>Email Address</label>
				<input
					type="email"
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
			<button className="btn btn-primary">Sign Up</button>
		</form>
	);
};
