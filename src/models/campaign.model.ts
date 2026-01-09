
export type CampaignTarget = 'All Umrah Clients' | 'All Hajj Clients' | 'All Students' | 'All Manpower Clients';

export interface Campaign {
    id: string;
    name: string;
    target: CampaignTarget;
    message: string;
    recipients: number;
    sentDate: Date;
    status: 'Sent' | 'Draft';
}
