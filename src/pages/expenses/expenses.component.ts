
import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../services/expense.service';
import { UiService } from '../../services/ui.service';
import { Expense } from '../../models/expense.model';
import { AddExpenseModalComponent } from '../../components/modals/add-expense-modal.component';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, AddExpenseModalComponent],
  templateUrl: './expenses.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesComponent {
  private expenseService = inject(ExpenseService);
  private uiService = inject(UiService);

  expenses = this.expenseService.expenses;
  isModalOpen = signal(false);
  editingExpense = signal<Expense | null>(null);
  
  totalExpensesThisMonth = computed(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    return this.expenses()
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  });

  openModal(expense: Expense | null = null) {
    this.editingExpense.set(expense);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingExpense.set(null);
  }

  handleSaveExpense(expense: Expense) {
    if (expense.id) {
      this.expenseService.updateExpense(expense);
      this.uiService.showToast('Expense updated successfully!');
    } else {
      this.expenseService.addExpense(expense);
      this.uiService.showToast('Expense added successfully!');
    }
    this.closeModal();
  }

  handleDeleteExpense(expense: Expense) {
    const message = `Are you sure you want to delete the expense "${expense.description}"? This action cannot be undone.`;
    this.uiService.showConfirmation('Delete Expense', message, () => {
      if (expense.id) {
          this.expenseService.deleteExpense(expense.id);
          this.uiService.showToast('Expense deleted.');
      }
    });
  }
}
