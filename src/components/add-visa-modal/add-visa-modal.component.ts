
import { Component, ChangeDetectionStrategy, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Visa } from '../../models/visa.model';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'add-visa-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-visa-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddVisaModalComponent {
  closeModal = output<void>();
  visaAdded = output<Omit<Visa, 'id'>>();
  
  private fb = inject(FormBuilder);
  private customerService = inject(CustomerService);
  
  customers = this.customerService.customers;
  visaForm: FormGroup;

  constructor() {
    this.visaForm = this.fb.group({
      customerId: ['', Validators.required],
      visaFee: [15000, [Validators.required, Validators.min(0)]],
      submissionDate: [''],
      status: ['Pending', Validators.required],
    });
  }

  onClose() {
    this.closeModal.emit();
  }

  onSubmit() {
    if (this.visaForm.valid) {
      const selectedCustomer = this.customers().find(c => c.id === this.visaForm.value.customerId);
      if (!selectedCustomer) return;

      const newVisaData = {
        customerName: selectedCustomer.fullName,
        passportNumber: selectedCustomer.passportNumber,
        visaType: 'Omrah' as const,
        approvalDate: null,
        ...this.visaForm.value,
      };
      this.visaAdded.emit(newVisaData);
    } else {
      this.visaForm.markAllAsTouched();
    }
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
