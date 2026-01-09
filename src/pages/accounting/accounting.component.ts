
import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingListComponent } from '../../components/booking-list/booking-list.component';
import { AddPaymentModalComponent } from '../../components/add-payment-modal/add-payment-modal.component';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking.model';
import { Payment } from '../../models/payment.model';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-accounting',
  standalone: true,
  imports: [CommonModule, BookingListComponent, AddPaymentModalComponent],
  templateUrl: './accounting.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountingComponent {
  isModalOpen = signal(false);
  selectedBooking = signal<Booking | null>(null);

  private bookingService = inject(BookingService);
  private uiService = inject(UiService);

  totalRevenue = this.bookingService.totalRevenue;
  totalDue = this.bookingService.totalDue;
  totalBookings = computed(() => this.bookingService.bookings().length);

  openAddPaymentModal(booking: Booking) {
    this.selectedBooking.set(booking);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedBooking.set(null);
  }

  handlePaymentAdded(payment: Omit<Payment, 'id'>) {
    const booking = this.selectedBooking();
    if (booking) {
      this.bookingService.addPayment(booking.id, payment);
      this.uiService.showToast(`Payment of ৳${payment.amount.toLocaleString('en-BD')} added successfully.`);
    }
    this.closeModal();
  }
}
