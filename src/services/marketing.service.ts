
import { Injectable, signal, WritableSignal, inject } from '@angular/core';
import { Campaign, CampaignTarget } from '../models/campaign.model';
import { CustomerService } from './customer.service';
import { HajjService } from './hajj.service';
import { StudentService } from './student.service';
import { ManpowerService } from './manpower.service';
import { SmsService } from './sms.service';

@Injectable({ providedIn: 'root' })
export class MarketingService {
  private customerService = inject(CustomerService);
  private hajjService = inject(HajjService);
  private studentService = inject(StudentService);
  private manpowerService = inject(ManpowerService);
  private smsService = inject(SmsService);

  private _campaigns: WritableSignal<Campaign[]> = signal([]);
  public readonly campaigns = this._campaigns.asReadonly();

  constructor() {
    this._campaigns.set([
      { id: 'CAMP-001', name: 'Early Bird Umrah Discount', target: 'All Umrah Clients', message: 'Special 10% discount on Umrah packages for early birds. Contact us now!', recipients: this.customerService.customers().length, sentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), status: 'Sent' },
      { id: 'CAMP-002', name: 'Hajj 2025 Pre-reg Open', target: 'All Hajj Clients', message: 'Hajj 2025 pre-registration is now open. Secure your spot today!', recipients: this.hajjService.registrations().length, sentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), status: 'Sent' }
    ]);
  }

  sendCampaign(campaignData: { name: string, target: CampaignTarget, message: string }) {
    const audience = this.getAudience(campaignData.target);
    
    this.smsService.sendBulkSms(audience, campaignData.message, campaignData.name);
    
    const newCampaign: Campaign = {
        id: `CAMP-${Date.now()}`,
        name: campaignData.name,
        target: campaignData.target,
        message: campaignData.message,
        recipients: audience.length,
        sentDate: new Date(),
        status: 'Sent'
    };
    this._campaigns.update(campaigns => [newCampaign, ...campaigns]);
  }

  private getAudience(target: CampaignTarget): { name: string, mobile: string }[] {
    switch(target) {
        case 'All Umrah Clients':
            return this.customerService.customers().map(c => ({ name: c.fullName, mobile: c.mobileNumber }));
        case 'All Hajj Clients':
            return this.hajjService.registrations().map(h => ({ name: h.fullName, mobile: h.phone }));
        case 'All Students':
            return this.studentService.students().map(s => ({ name: s.name, mobile: s.mobile }));
        case 'All Manpower Clients':
            return this.manpowerService.clients().map(m => ({ name: m.fullName, mobile: m.mobileNumber }));
        default:
            return [];
    }
  }
}
