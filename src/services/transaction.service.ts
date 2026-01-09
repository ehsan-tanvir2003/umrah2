
import { Injectable, computed, inject } from '@angular/core';
import { BookingService } from './booking.service';
import { VisaService } from './visa.service';
import { ExpenseService } from './expense.service';
import { Transaction, TransactionType } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private bookingService = inject(BookingService);
  private visaService = inject(VisaService);
  private expenseService = inject(ExpenseService);

  public transactions = computed(() => {
    const allTransactions: Transaction[] = [];

    // 1. Customer Payments (Credit)
    this.bookingService.bookings().forEach(booking => {
      booking.payments.forEach(payment => {
        allTransactions.push({
          id: `TRN-PAY-${payment.id}`,
          date: payment.paymentDate,
          type: 'Credit',
          source: 'Customer Payment',
          description: `Payment for package: ${booking.packageName}`,
          amount: payment.amount,
          reference: booking.customerName
        });
      });
    });

    // 2. Visa Fees (Debit - assuming agency pays it first)
    this.visaService.visas().forEach(visa => {
      if (visa.status !== 'Pending') {
        allTransactions.push({
          id: `TRN-VISA-${visa.id}`,
          date: visa.submissionDate || new Date().toISOString().split('T')[0],
          type: 'Debit',
          source: 'Visa Fee',
          description: `Visa fee for Omrah application`,
          amount: visa.visaFee,
          reference: visa.customerName
        });
      }
    });

    // 3. Expenses (Debit)
    this.expenseService.expenses().forEach(expense => {
      allTransactions.push({
        id: `TRN-EXP-${expense.id}`,
        date: expense.date,
        type: 'Debit',
        source: 'Expense',
        description: expense.description,
        amount: expense.amount,
        reference: expense.category
      });
    });

    // Sort by date, newest first
    return allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  private calculateTotalByType = (type: TransactionType) => computed(() => 
    this.transactions()
      .filter(t => t.type === type)
      .reduce((sum, t) => sum + t.amount, 0)
  );
  
  private calculateTodayTotalByType = (type: TransactionType) => computed(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return this.transactions()
      .filter(t => t.type === type && t.date === todayStr)
      .reduce((sum, t) => sum + t.amount, 0);
  });
  
  public totalCredit = this.calculateTotalByType('Credit');
  public todaysCredit = this.calculateTodayTotalByType('Credit');
  public totalDebit = this.calculateTotalByType('Debit');
  public todaysDebit = this.calculateTodayTotalByType('Debit');
  
  public todaysDeposit = this.todaysCredit; // Alias for dashboard
}
