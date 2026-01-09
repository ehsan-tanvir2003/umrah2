
import { Component, ChangeDetectionStrategy, output, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { User, UserRole, UserStatus } from '../../models/user.model';

@Component({
  selector: 'add-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-user-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUserModalComponent implements OnInit {
  user = input<User | null>(null);
  closeModal = output<void>();
  saveUser = output<User>();
  
  userForm: FormGroup;
  isEditMode = false;
  
  roles: UserRole[] = ['Super Admin', 'Branch Manager', 'Agent', 'Accountant', 'Data Entry', 'Read Only'];
  statuses: UserStatus[] = ['Active', 'Inactive'];

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['Agent' as UserRole, Validators.required],
      status: ['Active' as UserStatus, Validators.required],
    });
  }

  ngOnInit() {
    const userToEdit = this.user();
    if (userToEdit) {
      this.isEditMode = true;
      this.userForm.patchValue(userToEdit);
    }
  }
  
  onClose() {
    this.closeModal.emit();
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.saveUser.emit({ ...this.user(), ...this.userForm.value });
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}