
export type SupplierCategory = 'Hotel' | 'Transport' | 'Mofa Provider' | 'Catering' | 'Other';

export interface Supplier {
  id?: string;
  name: string;
  category: SupplierCategory;
  country: string;
  contactPerson: string;
  mobile: string;
  email: string;
}