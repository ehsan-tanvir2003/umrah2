
export interface Student {
    id?: string;
    name: string;
    mobile: string;
    destinationCountry: string;
    status: 'New' | 'Application Submitted' | 'Visa Approved';
}