
import { Component, ChangeDetectionStrategy, output, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'booking-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingListComponent {
  addPayment = output<Booking>();
  private bookingService = inject(BookingService);

  bookingsWithPayment = computed(() => {
    return this.bookingService.bookings().map(booking => {
      const paidAmount = booking.payments.reduce((sum, p) => sum + p.amount, 0);
      const dueAmount = booking.totalAmount - paidAmount;
      return { ...booking, paidAmount, dueAmount };
    });
  });

  onAddPayment(booking: Booking) {
    this.addPayment.emit(booking);
  }
}
