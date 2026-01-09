
import { Injectable, signal, WritableSignal } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
    private _users: WritableSignal<User[]> = signal([]);
    public readonly users = this._users.asReadonly();

    constructor() {
        this._users.set([
            {
                id: 'USER-001',
                name: 'System Admin',
                email: 'admin@umrahflow.com',
                role: 'Super Admin',
                status: 'Active',
                lastLogin: '2024-06-15 10:30 AM'
            },
            {
                id: 'USER-002',
                name: 'Rahim Khan',
                email: 'rahim.manager@umrahflow.com',
                role: 'Branch Manager',
                status: 'Active',
                lastLogin: '2024-06-15 09:15 AM'
            },
            {
                id: 'USER-003',
                name: 'Fatema Akter',
                email: 'fatema.accounts@umrahflow.com',
                role: 'Accountant',
                status: 'Active',
                lastLogin: '2024-06-15 10:45 AM'
            },
            {
                id: 'USER-004',
                name: 'Faria Islam',
                email: 'faria.agent@umrahflow.com',
                role: 'Agent',
                status: 'Inactive',
                lastLogin: '2024-06-12 05:00 PM'
            }
        ]);
    }

    addUser(userData: Omit<User, 'id' | 'lastLogin'>) {
        const newUser: User = {
            ...userData,
            id: `USER-${Date.now()}`,
            lastLogin: 'Never'
        };
        this._users.update(users => [newUser, ...users]);
    }

    updateUser(updatedUser: User) {
        this._users.update(users => users.map(u => u.id === updatedUser.id ? updatedUser : u));
    }

    deleteUser(userId: string) {
        this._users.update(users => users.filter(u => u.id !== userId));
    }
}
