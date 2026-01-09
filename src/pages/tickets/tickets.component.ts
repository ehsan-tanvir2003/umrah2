
import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ticket } from '../../models/ticket.model';
import { TicketService } from '../../services/ticket.service';
import { UiService } from '../../services/ui.service';
import { AddTicketModalComponent } from '../../components/modals/add-ticket-modal.component';

@Component({
  selector: 'app-ticket-management',
  standalone: true,
  imports: [CommonModule, AddTicketModalComponent],
  templateUrl: './tickets.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketManagementComponent {
  private ticketService = inject(TicketService);
  private uiService = inject(UiService);

  tickets = this.ticketService.tickets;
  isModalOpen = signal(false);
  editingTicket = signal<Ticket | null>(null);

  openModal(ticket: Ticket | null = null) {
    this.editingTicket.set(ticket);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingTicket.set(null);
  }

  handleSaveTicket(ticket: Ticket) {
    if (ticket.id) {
      this.ticketService.updateTicket(ticket);
    } else {
      this.ticketService.addTicket(ticket);
    }
    this.closeModal();
  }

  handleDeleteTicket(ticket: Ticket) {
    const message = `Are you sure you want to delete the ticket for "${ticket.passengerName}" (PNR: ${ticket.pnr})?`;
    this.uiService.showConfirmation('Delete Ticket', message, () => {
      if (ticket.id) this.ticketService.deleteTicket(ticket.id);
    });
  }
}
