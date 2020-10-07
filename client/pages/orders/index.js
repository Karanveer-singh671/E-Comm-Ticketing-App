const OrderIndex = ({ orders, currentUser }) => {
	const orderList = orders.map((order) => {
		return (
			<tr key={order.id}>
				<td>{order.ticket.title}</td>
				<td>{order.status}</td>
				<td>{currentUser.email}</td>
			</tr>
		);
	});
	return (
		<div>
			<h1>Orders</h1>
			<table className="table table-hover">
				<thead className="thead-dark">
					<tr>
						<th scope="col">Title</th>
						<th scope="col">Price</th>
						<th scope="col">Email</th>
					</tr>
				</thead>
				<tbody>{orderList}</tbody>
			</table>
		</div>
	);
};
OrderIndex.getInitialProps = async (context, client) => {
	// want to get list of orders so client call
	const { data } = await client.get("/api/orders");
	return { orders: data };
};

export default OrderIndex;
