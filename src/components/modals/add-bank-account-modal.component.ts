
import { Component, ChangeDetectionStrategy, output, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BankAccount } from '../../models/bank-account.model';

@Component({
  selector: 'add-bank-account-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-bank-account-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddBankAccountModalComponent implements OnInit {
  account = input<BankAccount | null>(null);
  closeModal = output<void>();
  saveAccount = output<BankAccount>();
  
  accountForm: FormGroup;
  isEditMode = false;

  constructor(private fb: FormBuilder) {
    this.accountForm = this.fb.group({
      bankName: ['', Validators.required],
      accountName: ['', Validators.required],
      accountNumber: ['', Validators.required],
      branch: ['', Validators.required],
    });
  }

  ngOnInit() {
    const accountToEdit = this.account();
    if (accountToEdit) {
      this.isEditMode = true;
      this.accountForm.patchValue(accountToEdit);
    }
  }
  
  onClose() {
    this.closeModal.emit();
  }

  onSubmit() {
    if (this.accountForm.valid) {
      this.saveAccount.emit({ ...this.account(), ...this.accountForm.value });
    } else {
      this.accountForm.markAllAsTouched();
    }
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}