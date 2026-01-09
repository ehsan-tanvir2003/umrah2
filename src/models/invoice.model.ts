
import { Customer } from './customer.model';
import { OmrahPackage } from './package.model';
import { Payment } from './payment.model';

export interface Invoice {
    id: string; // e.g., INV-001
    bookingId: string;
    invoiceDate: string;
    dueDate: string;
    customer: Customer;
    packageDetails: OmrahPackage;
    payments: Payment[];
    totalAmount: number;
    amountPaid: number;
    amountDue: number;
}
