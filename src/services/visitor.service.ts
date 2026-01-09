
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Visitor } from '../models/visitor.model';

@Injectable({ providedIn: 'root' })
export class VisitorService {
  private _visitors: WritableSignal<Visitor[]> = signal([]);
  public readonly visitors = this._visitors.asReadonly();

  constructor() {
    this._visitors.set([
      {
        id: 'VISIT-001',
        name: 'Mr. Jashim Uddin',
        mobile: '01711223344',
        address: 'Gulshan, Dhaka',
        purpose: 'Umrah',
        inquiryDate: '2024-06-10',
        followUpDate: '2024-06-15',
        status: 'Follow-up',
        assignedUser: 'Rahim Khan',
        remarks: 'Wants a 5-star package in December.'
      },
      {
        id: 'VISIT-002',
        name: 'Kashem Ali',
        mobile: '01988776655',
        email: 'kashem@email.com',
        address: 'Banani, Dhaka',
        purpose: 'Hajj',
        inquiryDate: '2024-06-08',
        status: 'Contacted',
        assignedUser: 'Faria Islam',
        remarks: 'Wants to pre-register for next year.'
      },
      {
        id: 'VISIT-003',
        name: 'Selina Rahman',
        mobile: '01812341234',
        address: 'Uttara, Dhaka',
        purpose: 'Passport Processing',
        inquiryDate: '2024-06-12',
        status: 'New',
        assignedUser: 'System',
        remarks: ''
      }
    ]);
  }
}
