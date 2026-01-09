
export interface Visitor {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  address?: string;
  purpose: 'Hajj' | 'Umrah' | 'Manpower' | 'Student Visa' | 'Ticket' | 'Passport Processing';
  inquiryDate: string;
  followUpDate?: string;
  remarks?: string;
  assignedUser?: string;
  status: 'New' | 'Contacted' | 'Follow-up' | 'Converted' | 'Lost';
}
