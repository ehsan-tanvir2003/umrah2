
export interface ManpowerClient {
    id?: string;
    fullName: string;
    passportNumber: string;
    mobileNumber: string;
    destinationCountry: string;
    trade: string; // e.g., 'Construction Worker', 'Driver', 'Cleaner'
    status: 'New' | 'Documents Submitted' | 'Visa Processing' | 'Deployed';
}