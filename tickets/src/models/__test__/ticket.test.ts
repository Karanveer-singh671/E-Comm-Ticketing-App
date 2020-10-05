import { Ticket } from "../ticket";
// take in done to tell jest that test is done e.g if do a return
it("implements optimistic concurrency control", async (done) => {
	// create an instance of a Ticket
	const ticket = Ticket.build({
		title: "concert",
		price: 100,
		userId: "123",
	});
	// save the ticket to the database
	await ticket.save();
	// fetch the ticket twice
	const firstInstance = await Ticket.findById(ticket.id);
	const secondInstance = await Ticket.findById(ticket.id);
	// make two separate changes to the tickets we fetched
	firstInstance!.set({ price: 10 });
	secondInstance!.set({ price: 20 });
	// save the first fetched ticket
	await firstInstance!.save();
	// save the second fetched ticket and expect an error (out of date version)
	try {
		await secondInstance!.save();
	} catch (err) {
		return done();
	}
	throw new Error("Should not reach this error");
});

it("increments the version number on multiple saves", async () => {
	const ticket = Ticket.build({
		title: "concert",
		price: 200,
		userId: "123",
	});
	await ticket.save();
	expect(ticket.version).toEqual(0);
	// after each save after creating should increment the version number
	await ticket.save();
	expect(ticket.version).toEqual(1);
	await ticket.save();
	expect(ticket.version).toEqual(2);
});
