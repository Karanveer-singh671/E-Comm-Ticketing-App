import { Subjects } from './subjects';

// every event will have its own interface with associated subject and data 
export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number 
  }
}