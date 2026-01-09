
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction.model';

interface ReportData {
    income: Transaction[];
    expenses: Transaction[];
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
}

@Component({
  selector: 'app-profit-loss-report',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profit-loss.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfitLossReportComponent {
    private fb = inject(FormBuilder);
    private transactionService = inject(TransactionService);

    filterForm: FormGroup;
    reportData = signal<ReportData | null>(null);

    constructor() {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        const todayStr = today.toISOString().split('T')[0];

        this.filterForm = this.fb.group({
            startDate: [firstDayOfMonth],
            endDate: [todayStr]
        });
    }

    generateReport() {
        const { startDate, endDate } = this.filterForm.value;
        const allTransactions = this.transactionService.transactions();

        const filtered = allTransactions.filter(t => t.date >= startDate && t.date <= endDate);

        const income = filtered.filter(t => t.type === 'Credit');
        const expenses = filtered.filter(t => t.type === 'Debit');

        const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
        const netProfit = totalIncome - totalExpenses;

        this.reportData.set({
            income,
            expenses,
            totalIncome,
            totalExpenses,
            netProfit
        });
    }
    
    printReport() {
        window.print();
    }
}
