
import { Injectable, signal, WritableSignal, inject } from '@angular/core';
import { HajjRegistration } from '../models/hajj-registration.model';
import { LogService } from './log.service';

@Injectable({ providedIn: 'root' })
export class HajjService {
    private logService = inject(LogService);

    private _registrations: WritableSignal<HajjRegistration[]> = signal([
        { id: 'HAJJ-PRE-001', type: 'Pre-registered', fullName: 'Abu Bakar', fatherName: 'Siddik', motherName: 'Aisha Begum', nidNumber: '1980123456789', passport: 'BP1234567', phone: '01712345678', address: 'Dhaka, Bangladesh', dateOfBirth: '1980-01-01', preRegistrationDate: '2024-02-10', year: 2025, chargeAmount: 30752 },
        { id: 'HAJJ-MAIN-001', type: 'Main', fullName: 'Umar Farooq', fatherName: 'Khattab', motherName: 'Fatima', nidNumber: '1975098765432', passport: 'BK7654321', phone: '01812345678', address: 'Chittagong, Bangladesh', dateOfBirth: '1975-05-05', preRegistrationDate: '2023-12-15', year: 2024 },
        { id: 'HAJJ-MAIN-002', type: 'Main', fullName: 'Ali Murtaza', fatherName: 'Abu Talib', motherName: 'Fatima bint Asad', nidNumber: '1978112233445', passport: 'BC5566778', phone: '01912345678', address: 'Sylhet, Bangladesh', dateOfBirth: '1978-03-20', preRegistrationDate: '2023-12-20', year: 2024 },
    ]);
    public readonly registrations = this._registrations.asReadonly();

    addPreRegistration(data: Omit<HajjRegistration, 'id' | 'type'>) {
        const newId = `HAJJ-PRE-${Date.now()}`;
        const newRegistration: HajjRegistration = {
            ...data,
            id: newId,
            type: 'Pre-registered',
        };
        this._registrations.update(regs => [newRegistration, ...regs]);
        this.logService.addLog({
            type: 'customer',
            description: `New Hajj pre-registration created for ${data.fullName}.`,
            user: 'System Admin'
        });
    }
}
