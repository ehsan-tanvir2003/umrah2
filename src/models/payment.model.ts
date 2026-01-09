
export interface Payment {
  id: string;
  amount: number;
  paymentDate: string;
  method: 'Cash' | 'Bank' | 'bKash' | 'Nagad' | 'Rocket';
}
