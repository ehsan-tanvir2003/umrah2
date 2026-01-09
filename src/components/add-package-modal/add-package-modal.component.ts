
import { Component, ChangeDetectionStrategy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { OmrahPackage } from '../../models/package.model';

@Component({
  selector: 'add-package-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-package-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPackageModalComponent {
  closeModal = output<void>();
  packageAdded = output<Omit<OmrahPackage, 'id'>>();

  packageForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.packageForm = this.fb.group({
      packageName: ['', Validators.required],
      duration: [14, [Validators.required, Validators.min(1)]],
      makkahHotel: ['', Validators.required],
      madinahHotel: ['', Validators.required],
      hotelDistance: [''],
      roomType: ['Quad', Validators.required],
      transportType: ['Bus', Validators.required],
      airline: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      inclusions: [''],
      exclusions: [''],
    });
  }

  onClose() {
    this.closeModal.emit();
  }

  onSubmit() {
    if (this.packageForm.valid) {
      const formValue = this.packageForm.value;
      const newPackageData = {
        ...formValue,
        inclusions: formValue.inclusions.split(',').map((s: string) => s.trim()).filter(Boolean),
        exclusions: formValue.exclusions.split(',').map((s: string) => s.trim()).filter(Boolean)
      };
      this.packageAdded.emit(newPackageData);
    } else {
      this.packageForm.markAllAsTouched();
    }
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
