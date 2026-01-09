
import { Component, ChangeDetectionStrategy, output, input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Supplier, SupplierCategory } from '../../models/supplier.model';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'add-supplier-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-supplier-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddSupplierModalComponent implements OnInit {
  supplier = input<Supplier | null>(null);
  closeModal = output<void>();
  saveSupplier = output<Supplier>();
  
  private fb = inject(FormBuilder);
  private settingsService = inject(SettingsService);
  
  supplierForm: FormGroup;
  isEditMode = false;
  
  countries = this.settingsService.countries;
  categories: SupplierCategory[] = ['Hotel', 'Transport', 'Mofa Provider', 'Catering', 'Other'];

  constructor() {
    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      category: ['Hotel' as SupplierCategory, Validators.required],
      country: ['', Validators.required],
      contactPerson: ['', Validators.required],
      mobile: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    const supplierToEdit = this.supplier();
    if (supplierToEdit) {
      this.isEditMode = true;
      this.supplierForm.patchValue(supplierToEdit);
    }
  }
  
  onClose() {
    this.closeModal.emit();
  }

  onSubmit() {
    if (this.supplierForm.valid) {
      this.saveSupplier.emit({ ...this.supplier(), ...this.supplierForm.value });
    } else {
      this.supplierForm.markAllAsTouched();
    }
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}