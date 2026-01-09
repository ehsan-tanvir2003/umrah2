
import { Injectable, signal } from '@angular/core';
import { User, UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Mock a logged-in user. In a real app, this would come from a login process.
  currentUser = signal<User | null>(null);
  
  public readonly availableRoles: UserRole[] = ['Super Admin', 'Branch Manager', 'Agent', 'Accountant', 'Data Entry', 'Read Only'];

  constructor() {
    // Default to Super Admin on app start for full access
    this.login('Super Admin');
  }

  login(role: UserRole) {
    const user: User = {
        id: `USER-${role.replace(' ', '')}`,
        name: `${role} User`,
        email: `${role.toLowerCase().replace(' ', '.')}@umrahflow.com`,
        role: role,
        status: 'Active',
        lastLogin: new Date().toISOString()
    };
    this.currentUser.set(user);
  }

  logout() {
    this.currentUser.set(null);
  }

  hasRole(roles: UserRole[]): boolean {
    const user = this.currentUser();
    if (!user) {
      return false;
    }
    return roles.includes(user.role);
  }
}
