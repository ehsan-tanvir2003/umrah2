
import { Injectable, signal, WritableSignal, inject } from '@angular/core';
import { Expense } from '../models/expense.model';
import { LogService } from './log.service';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private logService = inject(LogService);
  private _expenses: WritableSignal<Expense[]> = signal([]);
  public readonly expenses = this._expenses.asReadonly();

  constructor() {
    this._expenses.set([
      {
        id: 'EXP-001',
        date: '2024-05-01',
        category: 'Office Rent',
        description: 'May Office Rent - Gulshan',
        amount: 80000
      },
      {
        id: 'EXP-002',
        date: '2024-05-05',
        category: 'Utilities',
        description: 'Electricity & Internet Bill',
        amount: 15000
      },
      {
        id: 'EXP-003',
        date: '2024-05-15',
        category: 'Agent Commission',
        description: 'Commission Payout to Faria Islam',
        amount: 25000
      },
      {
        id: 'EXP-004',
        date: '2024-05-28',
        category: 'Salaries',
        description: 'Staff Salaries - May',
        amount: 150000
      }
    ]);
  }

  addExpense(expenseData: Omit<Expense, 'id'>) {
    const newExpense: Expense = {
        ...expenseData,
        id: `EXP-${Date.now()}`
    };
    this._expenses.update(expenses => [newExpense, ...expenses].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    this.logService.addLog({
        type: 'payment', 
        description: `Expense recorded: ${expenseData.description} for ৳${expenseData.amount}`,
        user: 'Fatema Akter (Accountant)'
    });
  }
  
  updateExpense(updatedExpense: Expense) {
    this._expenses.update(expenses =>
      expenses.map(e => e.id === updatedExpense.id ? updatedExpense : e)
    );
     this.logService.addLog({
        type: 'payment',
        description: `Expense updated: ${updatedExpense.description} to ৳${updatedExpense.amount}`,
        user: 'Fatema Akter (Accountant)'
    });
  }

  deleteExpense(expenseId: string) {
    const expenseToDelete = this.expenses().find(e => e.id === expenseId);
    this._expenses.update(expenses => expenses.filter(e => e.id !== expenseId));
    if (expenseToDelete) {
        this.logService.addLog({
            type: 'payment',
            description: `Expense deleted: ${expenseToDelete.description} (৳${expenseToDelete.amount})`,
            user: 'System Admin'
        });
    }
  }
}
