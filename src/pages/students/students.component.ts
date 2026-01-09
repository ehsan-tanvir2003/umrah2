
import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student.service';
import { UiService } from '../../services/ui.service';
import { AddStudentModalComponent } from '../../components/modals/add-student-modal.component';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, AddStudentModalComponent],
  templateUrl: './students.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentsComponent {
  private studentService = inject(StudentService);
  private uiService = inject(UiService);

  students = this.studentService.students;
  isModalOpen = signal(false);
  editingStudent = signal<Student | null>(null);

  getStatusClass(status: Student['status']): string {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Application Submitted': return 'bg-yellow-100 text-yellow-800';
      case 'Visa Approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  openModal(student: Student | null = null) {
    this.editingStudent.set(student);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingStudent.set(null);
  }

  handleSaveStudent(student: Student) {
    if (student.id) {
      this.studentService.updateStudent(student);
    } else {
      this.studentService.addStudent(student);
    }
    this.closeModal();
  }

  handleDeleteStudent(student: Student) {
    const message = `Are you sure you want to delete the record for "${student.name}"?`;
    this.uiService.showConfirmation('Delete Student', message, () => {
      if (student.id) this.studentService.deleteStudent(student.id);
    });
  }
}
