
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Student } from '../models/student.model';

@Injectable({ providedIn: 'root' })
export class StudentService {
    private _students: WritableSignal<Student[]> = signal([
        { id: 'STU-001', name: 'Rahim Islam', mobile: '01711223344', destinationCountry: 'Malaysia', status: 'Visa Approved' },
        { id: 'STU-002', name: 'Fatima Khatun', mobile: '01811223344', destinationCountry: 'Canada', status: 'Application Submitted' },
        { id: 'STU-003', name: 'Jamil Ahmed', mobile: '01911223344', destinationCountry: 'UK', status: 'New' },
    ]);
    public readonly students = this._students.asReadonly();

    addStudent(studentData: Omit<Student, 'id'>) {
        const newStudent: Student = {
            ...studentData,
            id: `STU-${Date.now()}`
        };
        this._students.update(students => [newStudent, ...students]);
    }

    updateStudent(updatedStudent: Student) {
        this._students.update(students => 
            students.map(s => s.id === updatedStudent.id ? updatedStudent : s)
        );
    }

    deleteStudent(studentId: string) {
        this._students.update(students => students.filter(s => s.id !== studentId));
    }
}