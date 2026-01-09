
export interface Ticket {
    id?: string;
    passengerName: string;
    passengerType: 'Customer' | 'Manpower' | 'Student' | 'Other';
    pnr: string;
    airline: string;
    flightNumber: string;
    departureDateTime: string;
    returnDateTime?: string;
    cost: number;
}