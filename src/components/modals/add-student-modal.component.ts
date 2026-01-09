
import { Component, ChangeDetectionStrategy, output, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Student } from '../../models/student.model';

@Component({
  selector: 'add-student-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-student-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddStudentModalComponent implements OnInit {
  student = input<Student | null>(null);
  closeModal = output<void>();
  saveStudent = output<Student>();
  
  studentForm: FormGroup;
  isEditMode = false;
  statuses: Student['status'][] = ['New', 'Application Submitted', 'Visa Approved'];

  constructor(private fb: FormBuilder) {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      mobile: ['', Validators.required],
      destinationCountry: ['', Validators.required],
      status: ['New' as Student['status'], Validators.required],
    });
  }

  ngOnInit() {
    const studentToEdit = this.student();
    if (studentToEdit) {
      this.isEditMode = true;
      this.studentForm.patchValue(studentToEdit);
    }
  }
  
  onClose() {
    this.closeModal.emit();
  }

  onSubmit() {
    if (this.studentForm.valid) {
      this.saveStudent.emit({ ...this.student(), ...this.studentForm.value });
    } else {
      this.studentForm.markAllAsTouched();
    }
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
