const LandingPage = ({ currentUser }) => {
	// loop over array of tickets and build the table record with the row value as title and price
	const ticketList = tickets.map((ticket) => {
		return (
			<tr key={ticket.id}>
				<td>{ticket.title}</td>
				<td>{ticket.price}</td>
			</tr>
		);
	});

	return (
		<div>
			<h1>Tickets</h1>
			<table className="table">
				<thead>
					<tr>
						<th>Title</th>
						<th>Price</th>
					</tr>
				</thead>
				<tbody>{TicketList}</tbody>
			</table>
		</div>
	);
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
	const { data } = await client.get("api/tickets");
	// will be merged as props in component of LandingPage
	return { tickets: data };
};

export default LandingPage;
