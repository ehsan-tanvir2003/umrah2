
export interface Visa {
  id: string;
  customerId: string;
  customerName: string;
  passportNumber: string;
  visaType: 'Omrah';
  status: 'Pending' | 'Submitted' | 'Approved' | 'Rejected';
  submissionDate: string | null;
  approvalDate: string | null;
  visaFee: number;
}
