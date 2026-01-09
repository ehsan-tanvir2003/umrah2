
export type ExpenseCategory = 'Office Rent' | 'Utilities' | 'Salaries' | 'Agent Commission' | 'Marketing' | 'Other';

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
}
