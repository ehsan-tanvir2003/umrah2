
export interface CompanyProfile {
    name: string;
    address: string;
    phone: string;
    email: string;
    logoUrl: string;
}

export interface FinancialSettings {
    currency: 'BDT';
    taxNumber: string;
}

export interface ApplicationSettings {
    appBaseUrl: string;
}