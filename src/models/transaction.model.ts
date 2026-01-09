
export type TransactionType = 'Credit' | 'Debit';
export type TransactionSource = 'Customer Payment' | 'Visa Fee' | 'Expense';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  source: TransactionSource;
  description: string;
  amount: number;
  reference?: string; // e.g., Customer Name, Vendor Name
}
