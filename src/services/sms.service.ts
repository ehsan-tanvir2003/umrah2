
import { Injectable, signal, WritableSignal, inject } from '@angular/core';
import { SmsGatewaySettings, SmsTemplate } from '../models/sms.model';
import { LogService } from './log.service';
import { Customer } from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class SmsService {
  private logService = inject(LogService);

  private _settings: WritableSignal<SmsGatewaySettings> = signal({
    provider: 'Grameenphone',
    apiKey: 'gp-xxxxxxxxxxxxxxxxxxxx',
    senderId: 'UmrahFlow'
  });
  public readonly settings = this._settings.asReadonly();

  private _templates: WritableSignal<SmsTemplate[]> = signal([]);
  public readonly templates = this._templates.asReadonly();

  constructor() {
    this._templates.set([
      {
        id: 'TPL-001',
        name: 'Payment Received',
        content: 'Dear {{customerName}}, we have received your payment of BDT {{amount}}. Thank you for choosing us. - UmrahFlow'
      },
      {
        id: 'TPL-002',
        name: 'Visa Approved',
        content: 'Congratulations {{customerName}}! Your Omrah visa has been approved. We will contact you shortly with the next steps. - UmrahFlow'
      },
      {
        id: 'TPL-003',
        name: 'Flight Reminder',
        content: 'Dear {{customerName}}, this is a reminder for your flight on {{flightDate}} at {{flightTime}}. Please arrive at the airport 3 hours early. - UmrahFlow'
      },
      {
        id: 'TPL-004',
        name: 'Invoice Details',
        content: 'Dear {{customerName}}, your invoice for {{package}} is ready. Total: BDT {{total}}, Paid: BDT {{paid}}, Due: BDT {{due}}. Thank you. - UmrahFlow'
      }
    ]);
  }

  updateSettings(newSettings: SmsGatewaySettings) {
    this._settings.set(newSettings);
    this.logService.addLog({
        type: 'system',
        description: `SMS gateway settings updated. Provider set to ${newSettings.provider}.`,
        user: 'System Admin'
    });
  }

  saveTemplate(template: SmsTemplate) {
    this._templates.update(templates => {
      const index = templates.findIndex(t => t.id === template.id);
      if (index > -1) {
        // Update existing
        templates[index] = template;
        return [...templates];
      } else {
        // Add new
        return [...templates, template];
      }
    });
    this.logService.addLog({
        type: 'system',
        description: `SMS template '${template.name}' was saved.`,
        user: 'System Admin'
    });
  }

  deleteTemplate(templateId: string) {
    this._templates.update(templates => templates.filter(t => t.id !== templateId));
  }

  // This is a simulation
  sendSms(customer: Customer, message: string) {
    console.log(`-- SIMULATING SMS SEND --`);
    console.log(`Provider: ${this.settings().provider}`);
    console.log(`To: ${customer.mobileNumber}`);
    console.log(`Message: ${message}`);
    console.log(`-------------------------`);
    
    this.logService.addLog({
        type: 'sms',
        description: `Sent SMS to ${customer.fullName} (${customer.mobileNumber}). Message: "${message}"`,
        user: 'Rahim Khan (Manager)'
    });

    return Promise.resolve(true);
  }

  // This is a simulation for bulk sending
  async sendBulkSms(customers: { name: string, mobile: string }[], messageTemplate: string, campaignName: string): Promise<void> {
    console.log(`-- SIMULATING BULK SMS CAMPAIGN: ${campaignName} --`);
    console.log(`Provider: ${this.settings().provider}`);
    console.log(`Targeting ${customers.length} recipients.`);
    
    // Simulate sending to first 3 recipients for logging purposes
    for(let i = 0; i < Math.min(customers.length, 3); i++) {
      const customer = customers[i];
      const message = messageTemplate.replace(/{{customerName}}/g, customer.name);
      console.log(`  - Sending to ${customer.mobile}: ${message}`);
    }
    if (customers.length > 3) {
      console.log(`  - ...and ${customers.length - 3} more.`);
    }
    console.log(`-----------------------------------------------`);
    
    this.logService.addLog({
        type: 'sms',
        description: `Bulk SMS campaign "${campaignName}" sent to ${customers.length} recipients.`,
        user: 'System Admin'
    });
  }
}