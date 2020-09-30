import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  // object inside find is the filter property so in this case no filter to get all tickets inside collection
  const tickets = await Ticket.find({})

  res.send(tickets)
});

export {router as indexTicketRouter}