
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Ticket } from '../models/ticket.model';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private _tickets: WritableSignal<Ticket[]> = signal([
    { id: 'TKT-001', passengerName: 'Abdur Rahim', passengerType: 'Customer', pnr: 'AB12CD', airline: 'Saudia Airlines', flightNumber: 'SV805', departureDateTime: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(), cost: 65000 },
    { id: 'TKT-002', passengerName: 'Jamal Mia', passengerType: 'Manpower', pnr: 'EF34GH', airline: 'Biman Bangladesh', flightNumber: 'BG035', departureDateTime: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(), cost: 48000 },
    { id: 'TKT-003', passengerName: 'Rahim Islam', passengerType: 'Student', pnr: 'IJ56KL', airline: 'Malaysia Airlines', flightNumber: 'MH197', departureDateTime: new Date(new Date().getTime() + 12 * 24 * 60 * 60 * 1000).toISOString(), cost: 35000 },
  ]);
  public readonly tickets = this._tickets.asReadonly();

  addTicket(ticketData: Omit<Ticket, 'id'>) {
    const newTicket: Ticket = {
      ...ticketData,
      id: `TKT-${Date.now()}`
    };
    this._tickets.update(tickets => [newTicket, ...tickets]);
  }

  updateTicket(updatedTicket: Ticket) {
    this._tickets.update(tickets =>
      tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t)
    );
  }

  deleteTicket(ticketId: string) {
    this._tickets.update(tickets => tickets.filter(t => t.id !== ticketId));
  }
}
