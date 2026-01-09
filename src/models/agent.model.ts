
export interface Agent {
    id: string;
    name: string;
    branch: 'Dhaka' | 'Chittagong' | 'Sylhet';
    mobile: string;
    email: string;
    customersManaged: number;
    totalCommission: number; // in BDT
}
