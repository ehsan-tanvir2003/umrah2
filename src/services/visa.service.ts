
import { Injectable, signal, WritableSignal, inject, computed } from '@angular/core';
import { Visa } from '../models/visa.model';
import { CustomerService } from './customer.service';
import { LogService } from './log.service';

@Injectable({ providedIn: 'root' })
export class VisaService {
  private customerService = inject(CustomerService);
  private logService = inject(LogService);
  private _visas: WritableSignal<Visa[]> = signal([]);
  public readonly visas = this._visas.asReadonly();

  public visasPending = computed(() => this._visas().filter(v => v.status === 'Pending' || v.status === 'Submitted').length);

  constructor() {
    const customers = this.customerService.customers();
    if (customers.length >= 3) {
      this._visas.set([
        {
          id: 'VISA-001',
          customerId: customers[0].id,
          customerName: customers[0].fullName,
          passportNumber: customers[0].passportNumber,
          visaType: 'Omrah',
          status: 'Approved',
          submissionDate: '2024-05-10',
          approvalDate: '2024-05-18',
          visaFee: 15000,
        },
        {
          id: 'VISA-002',
          customerId: customers[2].id,
          customerName: customers[2].fullName,
          passportNumber: customers[2].passportNumber,
          visaType: 'Omrah',
          status: 'Submitted',
          submissionDate: '2024-05-20',
          approvalDate: null,
          visaFee: 15500,
        },
        {
          id: 'VISA-003',
          customerId: customers[3].id,
          customerName: customers[3].fullName,
          passportNumber: customers[3].passportNumber,
          visaType: 'Omrah',
          status: 'Pending',
          submissionDate: null,
          approvalDate: null,
          visaFee: 15000,
        },
      ]);
    }
  }

  addVisa(visa: Omit<Visa, 'id'>) {
    const newId = `VISA-${String(this._visas().length + 1).padStart(3, '0')}`;
    const newVisa: Visa = {
      ...visa,
      id: newId,
    };
    this._visas.update(visas => [...visas, newVisa]);
    this.logService.addLog({
        type: 'visa',
        description: `New visa application submitted for ${visa.customerName} (ID: ${newId})`,
        user: 'Faria Islam (Agent)'
    });
  }
}
