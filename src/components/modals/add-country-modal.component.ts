
import { Component, ChangeDetectionStrategy, output, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Country } from '../../models/country.model';

@Component({
  selector: 'add-country-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-country-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCountryModalComponent implements OnInit {
  country = input<Country | null>(null);
  closeModal = output<void>();
  saveCountry = output<Country>();
  
  countryForm: FormGroup;
  isEditMode = false;

  constructor(private fb: FormBuilder) {
    this.countryForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', [Validators.required, Validators.maxLength(3)]],
    });
  }

  ngOnInit() {
    const countryToEdit = this.country();
    if (countryToEdit) {
      this.isEditMode = true;
      this.countryForm.patchValue(countryToEdit);
      this.countryForm.get('code')?.disable(); // Don't allow editing the unique code
    }
  }
  
  onClose() {
    this.closeModal.emit();
  }

  onSubmit() {
    if (this.countryForm.valid) {
      this.saveCountry.emit(this.countryForm.getRawValue());
    } else {
      this.countryForm.markAllAsTouched();
    }
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}