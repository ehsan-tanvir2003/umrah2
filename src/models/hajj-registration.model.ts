
export type HajjRegistrationType = 'Pre-registered' | 'Main';

export interface HajjRegistration {
    id: string;
    type: HajjRegistrationType;
    fullName: string;
    fatherName: string;
    motherName: string;
    nidNumber: string;
    passport: string;
    phone: string;
    address: string;
    serialNo?: string;
    trackingNo?: string;
    agentName?: string;
    referencePerson?: string;
    chargeAmount?: number;
    year?: number;
    dateOfBirth: string;
    preRegistrationDate: string;
    remarks?: string;
}
