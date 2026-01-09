
import { Component, ChangeDetectionStrategy, output, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Ticket } from '../../models/ticket.model';

@Component({
  selector: 'add-ticket-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-ticket-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTicketModalComponent implements OnInit {
  ticket = input<Ticket | null>(null);
  closeModal = output<void>();
  saveTicket = output<Ticket>();
  
  ticketForm: FormGroup;
  isEditMode = false;
  passengerTypes: Ticket['passengerType'][] = ['Customer', 'Manpower', 'Student', 'Other'];

  constructor(private fb: FormBuilder) {
    this.ticketForm = this.fb.group({
      passengerName: ['', Validators.required],
      passengerType: ['Customer' as Ticket['passengerType'], Validators.required],
      pnr: ['', Validators.required],
      airline: ['', Validators.required],
      flightNumber: [''],
      departureDateTime: ['', Validators.required],
      returnDateTime: [''],
      cost: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    const ticketToEdit = this.ticket();
    if (ticketToEdit) {
      this.isEditMode = true;
      const formattedTicket = {
          ...ticketToEdit,
          departureDateTime: this.formatDateTimeForInput(ticketToEdit.departureDateTime),
          returnDateTime: ticketToEdit.returnDateTime ? this.formatDateTimeForInput(ticketToEdit.returnDateTime) : ''
      };
      this.ticketForm.patchValue(formattedTicket);
    }
  }

  private formatDateTimeForInput(dateString: string): string {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().slice(0, 16); // Format to 'YYYY-MM-DDTHH:mm'
  }
  
  onClose() {
    this.closeModal.emit();
  }

  onSubmit() {
    if (this.ticketForm.valid) {
      this.saveTicket.emit({ ...this.ticket(), ...this.ticketForm.value });
    } else {
      this.ticketForm.markAllAsTouched();
    }
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
