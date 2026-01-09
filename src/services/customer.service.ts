
import { Injectable, signal, WritableSignal, inject } from '@angular/core';
import { Customer } from '../models/customer.model';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private logService = inject(LogService);
  private _customers: WritableSignal<Customer[]> = signal<Customer[]>([]);
  public readonly customers = this._customers.asReadonly();

  constructor() {
    // Initialize with some mock data
    this._customers.set([
      {
        id: 'CUST-001',
        fullName: 'Abdur Rahim',
        fatherName: 'Karim Sheikh',
        motherName: 'Fatima Begum',
        dateOfBirth: '1985-05-15',
        nationality: 'Bangladeshi',
        gender: 'Male',
        nidNumber: '1985123456789',
        passportNumber: 'A12345678',
        passportIssueDate: '2022-01-20',
        passportExpiryDate: '2032-01-19',
        mobileNumber: '01712345678',
        whatsappNumber: '01712345678',
        email: 'abdur.rahim@email.com',
        status: 'Visa Approved'
      },
      {
        id: 'CUST-002',
        fullName: 'Fatema Akter',
        fatherName: 'Abdul Hamid',
        motherName: 'Jahanara Begum',
        dateOfBirth: '1990-11-22',
        nationality: 'Bangladeshi',
        gender: 'Female',
        nidNumber: '1990987654321',
        passportNumber: 'B87654321',
        passportIssueDate: '2021-08-10',
        passportExpiryDate: '2031-08-09',
        mobileNumber: '01812345678',
        whatsappNumber: '01812345678',
        email: 'fatema.akter@email.com',
        status: 'Documents Collected'
      },
      {
        id: 'CUST-003',
        fullName: 'Mohammad Abdullah',
        fatherName: 'Jamal Uddin',
        motherName: 'Amena Khatun',
        dateOfBirth: '1978-02-01',
        nationality: 'Bangladeshi',
        gender: 'Male',
        nidNumber: '1978567891234',
        passportNumber: 'C56789123',
        passportIssueDate: '2023-03-15',
        passportExpiryDate: '2033-03-14',
        mobileNumber: '01912345678',
        whatsappNumber: '01912345678',
        email: 'mohammad.abdullah@email.com',
        status: 'Ready to Fly'
      },
      {
        id: 'CUST-004',
        fullName: 'Selina Hossain',
        fatherName: 'Anwar Hossain',
        motherName: 'Rokeya Begum',
        dateOfBirth: '1995-07-30',
        nationality: 'Bangladeshi',
        gender: 'Female',
        nidNumber: '1995123456789',
        passportNumber: 'D12345678',
        passportIssueDate: '2022-11-01',
        passportExpiryDate: '2032-10-31',
        mobileNumber: '01612345678',
        whatsappNumber: '01612345678',
        email: 'selina.h@email.com',
        status: 'Ready to Fly'
      },
      {
        id: 'CUST-005',
        fullName: 'Kamal Ahmed',
        fatherName: 'Fazal Ahmed',
        motherName: 'Shamsun Nahar',
        dateOfBirth: '1982-09-12',
        nationality: 'Bangladeshi',
        gender: 'Male',
        nidNumber: '1982987654321',
        passportNumber: 'E87654321',
        passportIssueDate: '2020-05-18',
        passportExpiryDate: '2030-05-17',
        mobileNumber: '01512345678',
        whatsappNumber: '01512345678',
        email: 'kamal.ahmed@email.com',
        status: 'Visa Approved'
      }
    ]);
  }

  getCustomerById(id: string): Customer | undefined {
    return this._customers().find(c => c.id === id);
  }

  addCustomer(customer: Omit<Customer, 'id' | 'status'>) {
    const newId = `CUST-${String(this._customers().length + 1).padStart(3, '0')}`;
    const newCustomer: Customer = {
      ...customer,
      id: newId,
      status: 'New'
    };
    this._customers.update(customers => [...customers, newCustomer]);
    this.logService.addLog({
        type: 'customer',
        description: `New customer created: ${customer.fullName} (ID: ${newId})`,
        user: 'Rahim Khan (Manager)'
    });
  }

  updateCustomer(updatedCustomer: Customer) {
    this._customers.update(customers => 
      customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c)
    );
    this.logService.addLog({
        type: 'customer',
        description: `Customer profile updated: ${updatedCustomer.fullName} (ID: ${updatedCustomer.id})`,
        user: 'Rahim Khan (Manager)'
    });
  }

  deleteCustomer(customerId: string) {
    const customerToDelete = this.getCustomerById(customerId);
    this._customers.update(customers => customers.filter(c => c.id !== customerId));
     if(customerToDelete) {
        this.logService.addLog({
            type: 'customer',
            description: `Customer deleted: ${customerToDelete.fullName} (ID: ${customerId})`,
            user: 'System Admin'
        });
     }
  }
}
