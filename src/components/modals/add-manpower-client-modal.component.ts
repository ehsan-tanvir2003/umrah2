
import { Component, ChangeDetectionStrategy, output, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ManpowerClient } from '../../models/manpower.model';

@Component({
  selector: 'add-manpower-client-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-manpower-client-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddManpowerClientModalComponent implements OnInit {
  client = input<ManpowerClient | null>(null);
  closeModal = output<void>();
  saveClient = output<ManpowerClient>();
  
  clientForm: FormGroup;
  isEditMode = false;
  statuses: ManpowerClient['status'][] = ['New', 'Documents Submitted', 'Visa Processing', 'Deployed'];

  constructor(private fb: FormBuilder) {
    this.clientForm = this.fb.group({
      fullName: ['', Validators.required],
      passportNumber: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      destinationCountry: ['', Validators.required],
      trade: ['', Validators.required],
      status: ['New' as ManpowerClient['status'], Validators.required],
    });
  }

  ngOnInit() {
    const clientToEdit = this.client();
    if (clientToEdit) {
      this.isEditMode = true;
      this.clientForm.patchValue(clientToEdit);
    }
  }
  
  onClose() {
    this.closeModal.emit();
  }

  onSubmit() {
    if (this.clientForm.valid) {
      this.saveClient.emit({ ...this.client(), ...this.clientForm.value });
    } else {
      this.clientForm.markAllAsTouched();
    }
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
