
export type SmsGateway = 'Grameenphone' | 'Robi' | 'Banglalink' | 'GreenWeb SMS' | 'BulkSMS BD' | 'Alpha SMS';

export interface SmsGatewaySettings {
    provider: SmsGateway;
    apiKey: string;
    senderId: string;
}

export interface SmsTemplate {
    id: string;
    name: string;
    content: string;
}
