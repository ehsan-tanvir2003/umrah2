
import { Payment } from './payment.model';

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  packageId: string;
  packageName: string;
  totalAmount: number;
  payments: Payment[];
}
