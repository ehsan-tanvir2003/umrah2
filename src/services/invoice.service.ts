
import { Injectable, signal, WritableSignal, inject, computed } from '@angular/core';
import { Invoice } from '../models/invoice.model';
import { Booking } from '../models/booking.model';
import { Customer } from '../models/customer.model';
import { OmrahPackage } from '../models/package.model';
import { BookingService } from './booking.service';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private _invoices = signal<Invoice[]>([]);
  public readonly invoices = this._invoices.asReadonly();
  
  // This is a bit of a hack for mock data. In a real app, you'd fetch this relationally.
  private bookingService = inject(BookingService);

  constructor() {
    // Pre-generate invoices for existing mock bookings
    const initialInvoices: Invoice[] = this.bookingService.bookings().map((booking, index) => {
      const amountPaid = booking.payments.reduce((acc, p) => acc + p.amount, 0);
      const dueDate = new Date();
      dueDate.setDate(new Date(booking.payments[0].paymentDate).getDate() + 15);

      return {
        id: `INV-${String(index + 1).padStart(3, '0')}`,
        bookingId: booking.id,
        invoiceDate: booking.payments[0].paymentDate,
        dueDate: dueDate.toISOString().split('T')[0],
        // These would be looked up from services in a real app
        customer: { id: booking.customerId, fullName: booking.customerName } as Customer,
        packageDetails: { id: booking.packageId, packageName: booking.packageName } as OmrahPackage,
        payments: booking.payments,
        totalAmount: booking.totalAmount,
        amountPaid: amountPaid,
        amountDue: booking.totalAmount - amountPaid,
      };
    });
    this._invoices.set(initialInvoices);
  }

  getInvoiceByBookingId(bookingId: string): Invoice | undefined {
    return this._invoices().find(inv => inv.bookingId === bookingId);
  }

  // This would be called when a new booking is confirmed
  generateInvoiceForBooking(booking: Booking, customer: Customer, pkg: OmrahPackage): Invoice {
    const newId = `INV-${String(this._invoices().length + 1).padStart(3, '0')}`;
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 15); // Due in 15 days

    const amountPaid = booking.payments.reduce((acc, p) => acc + p.amount, 0);

    const newInvoice: Invoice = {
      id: newId,
      bookingId: booking.id,
      invoiceDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      customer: customer,
      packageDetails: pkg,
      payments: booking.payments,
      totalAmount: booking.totalAmount,
      amountPaid: amountPaid,
      amountDue: booking.totalAmount - amountPaid,
    };

    this._invoices.update(invoices => [...invoices, newInvoice]);
    return newInvoice;
  }
}
