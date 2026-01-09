
import { Injectable, signal, WritableSignal, computed, inject } from '@angular/core';
import { Booking } from '../models/booking.model';
import { Payment } from '../models/payment.model';
import { CustomerService } from './customer.service';
import { PackageService } from './package.service';
import { LogService } from './log.service';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private customerService = inject(CustomerService);
  private packageService = inject(PackageService);
  private logService = inject(LogService);

  private _bookings: WritableSignal<Booking[]> = signal([]);
  public readonly bookings = this._bookings.asReadonly();

  public totalRevenue = computed(() => {
    return this._bookings().reduce((total, booking) => {
      return total + booking.payments.reduce((sum, payment) => sum + payment.amount, 0);
    }, 0);
  });
  
  public totalDue = computed(() => {
     return this._bookings().reduce((total, booking) => {
      const paid = booking.payments.reduce((sum, payment) => sum + payment.amount, 0);
      return total + (booking.totalAmount - paid);
    }, 0);
  });

  constructor() {
    const customers = this.customerService.customers();
    const packages = this.packageService.packages();

    if (customers.length >= 3 && packages.length >= 2) {
      this._bookings.set([
        {
          id: 'BOOK-001',
          customerId: customers[0].id,
          customerName: customers[0].fullName,
          packageId: packages[1].id,
          packageName: packages[1].packageName,
          totalAmount: packages[1].price,
          payments: [
            { id: 'PAY-001', amount: 100000, paymentDate: '2024-04-15', method: 'Bank' },
            { id: 'PAY-002', amount: 50000, paymentDate: '2024-05-01', method: 'bKash' },
          ],
        },
        {
          id: 'BOOK-002',
          customerId: customers[2].id,
          customerName: customers[2].fullName,
          packageId: packages[0].id,
          packageName: packages[0].packageName,
          totalAmount: packages[0].price,
          payments: [{ id: 'PAY-003', amount: 125000, paymentDate: '2024-05-10', method: 'Cash' }],
        },
        {
          id: 'BOOK-003',
          customerId: customers[3].id,
          customerName: customers[3].fullName,
          packageId: packages[2].id,
          packageName: packages[2].packageName,
          totalAmount: packages[2].price,
          payments: [{ id: 'PAY-004', amount: 100000, paymentDate: '2024-05-20', method: 'Bank' }],
        },
      ]);
    }
  }
  
  addPayment(bookingId: string, payment: Omit<Payment, 'id'>) {
    this._bookings.update(bookings => {
        return bookings.map(booking => {
            if (booking.id === bookingId) {
                const newPayment: Payment = {
                    ...payment,
                    id: `PAY-${Date.now()}`
                };
                
                this.logService.addLog({
                    type: 'payment',
                    description: `Payment of ৳${payment.amount.toLocaleString('en-BD')} recorded for ${booking.customerName} via ${payment.method}.`,
                    user: 'Fatema Akter (Accountant)'
                });

                return {
                    ...booking,
                    payments: [...booking.payments, newPayment]
                };
            }
            return booking;
        });
    });
  }
}
