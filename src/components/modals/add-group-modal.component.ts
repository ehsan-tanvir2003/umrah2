
import { Component, ChangeDetectionStrategy, output, input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Group } from '../../models/group.model';

@Component({
  selector: 'add-group-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-group-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddGroupModalComponent implements OnInit {
  group = input<Group | null>(null);
  closeModal = output<void>();
  saveGroup = output<{ name: string, description: string, travelDate: string, id?: string }>();
  
  private fb = inject(FormBuilder);
  groupForm: FormGroup;
  isEditMode = false;

  constructor() {
    this.groupForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      travelDate: ['', Validators.required],
    });
  }

  ngOnInit() {
    const groupToEdit = this.group();
    if (groupToEdit) {
      this.isEditMode = true;
      this.groupForm.patchValue(groupToEdit);
    }
  }
  
  onClose() {
    this.closeModal.emit();
  }

  onSubmit() {
    if (this.groupForm.valid) {
      const output = { ...this.groupForm.value, id: this.group()?.id };
      this.saveGroup.emit(output);
    } else {
      this.groupForm.markAllAsTouched();
    }
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
