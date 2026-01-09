
import { Component, ChangeDetectionStrategy, output, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Expense, ExpenseCategory } from '../../models/expense.model';

@Component({
  selector: 'add-expense-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-expense-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddExpenseModalComponent implements OnInit {
  expense = input<Expense | null>(null);
  closeModal = output<void>();
  saveExpense = output<Expense>();
  
  expenseForm: FormGroup;
  isEditMode = false;
  categories: ExpenseCategory[] = ['Office Rent', 'Utilities', 'Salaries', 'Agent Commission', 'Marketing', 'Other'];

  constructor(private fb: FormBuilder) {
    this.expenseForm = this.fb.group({
      date: [new Date().toISOString().split('T')[0], Validators.required],
      category: ['Other' as ExpenseCategory, Validators.required],
      description: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    const expenseToEdit = this.expense();
    if (expenseToEdit) {
      this.isEditMode = true;
      this.expenseForm.patchValue(expenseToEdit);
    }
  }
  
  onClose() {
    this.closeModal.emit();
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      this.saveExpense.emit({ ...this.expense(), ...this.expenseForm.value });
    } else {
      this.expenseForm.markAllAsTouched();
    }
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
