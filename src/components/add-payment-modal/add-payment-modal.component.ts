
import { Component, ChangeDetectionStrategy, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Booking } from '../../models/booking.model';
import { Payment } from '../../models/payment.model';

@Component({
  selector: 'add-payment-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-payment-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPaymentModalComponent {
  booking = input.required<Booking>();
  closeModal = output<void>();
  paymentAdded = output<Omit<Payment, 'id'>>();

  paymentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    const today = new Date().toISOString().substring(0, 10);
    this.paymentForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
      paymentDate: [today, Validators.required],
      method: ['Cash', Validators.required],
    });
  }

  onClose() {
    this.closeModal.emit();
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      this.paymentAdded.emit(this.paymentForm.value);
    } else {
      this.paymentForm.markAllAsTouched();
    }
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
