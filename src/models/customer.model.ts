
export interface Customer {
  id: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  nationality: string;
  gender: 'Male' | 'Female' | 'Other';
  nidNumber: string;
  passportNumber: string;
  passportIssueDate: string;
  passportExpiryDate: string;
  mobileNumber: string;
  whatsappNumber: string;
  email: string;
  status: 'New' | 'Documents Collected' | 'Visa Applied' | 'Visa Approved' | 'Ticket Issued' | 'Hotel Confirmed' | 'Ready to Fly' | 'Completed' | 'Cancelled';
}
