
import { Injectable, signal, WritableSignal } from '@angular/core';
import { ManpowerClient } from '../models/manpower.model';

@Injectable({ providedIn: 'root' })
export class ManpowerService {
  private _clients: WritableSignal<ManpowerClient[]> = signal([
    { id: 'MAN-001', fullName: 'Jamal Mia', passportNumber: 'BM1234567', mobileNumber: '01511223344', destinationCountry: 'Saudi Arabia', trade: 'Construction Worker', status: 'Deployed' },
    { id: 'MAN-002', fullName: 'Kamal Hossain', passportNumber: 'BK7654321', mobileNumber: '01611223355', destinationCountry: 'Qatar', trade: 'Driver', status: 'Visa Processing' },
    { id: 'MAN-003', fullName: 'Rahima Khatun', passportNumber: 'BC9876543', mobileNumber: '01311223366', destinationCountry: 'UAE', trade: 'Cleaner', status: 'Documents Submitted' },
  ]);
  public readonly clients = this._clients.asReadonly();

  addClient(clientData: Omit<ManpowerClient, 'id'>) {
    const newClient: ManpowerClient = {
      ...clientData,
      id: `MAN-${Date.now()}`
    };
    this._clients.update(clients => [newClient, ...clients]);
  }

  updateClient(updatedClient: ManpowerClient) {
    this._clients.update(clients =>
      clients.map(c => c.id === updatedClient.id ? updatedClient : c)
    );
  }

  deleteClient(clientId: string) {
    this._clients.update(clients => clients.filter(c => c.id !== clientId));
  }
}
