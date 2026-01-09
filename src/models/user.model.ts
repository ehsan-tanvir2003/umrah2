
export type UserRole = 'Super Admin' | 'Branch Manager' | 'Agent' | 'Accountant' | 'Data Entry' | 'Read Only';
export type UserStatus = 'Active' | 'Inactive';

export interface User {
    id?: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    lastLogin: string;
}