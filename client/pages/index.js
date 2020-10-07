import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {
	const ticketList = tickets.map((ticket) => {
		return (
			<tr key={ticket.id}>
				<td>{ticket.title}</td>
				<td>{ticket.price}</td>
				<td>
					<Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
						<button className="btn btn-info">
							<a>View</a>
						</button>
					</Link>
				</td>
			</tr>
		);
	});

	return (
		<div>
			<h1>Tickets</h1>
			<table className="table table-hover">
				<thead className="thead-dark">
					<tr>
						<th scope="col">Title</th>
						<th scope="col">Price</th>
						<th scope="col">Link</th>
					</tr>
				</thead>
				<tbody>{ticketList}</tbody>
			</table>
		</div>
	);
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
	const { data } = await client.get("/api/tickets");

	return { tickets: data };
};

export default LandingPage;
