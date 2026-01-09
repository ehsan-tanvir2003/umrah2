
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarketingService } from '../../services/marketing.service';
import { UiService } from '../../services/ui.service';
import { Campaign, CampaignTarget } from '../../models/campaign.model';

@Component({
  selector: 'app-marketing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketingComponent {
  private fb = inject(FormBuilder);
  private marketingService = inject(MarketingService);
  private uiService = inject(UiService);
  
  campaigns = this.marketingService.campaigns;
  campaignForm: FormGroup;

  targetAudiences: CampaignTarget[] = [
    'All Umrah Clients', 
    'All Hajj Clients',
    'All Students',
    'All Manpower Clients'
  ];
  
  constructor() {
    this.campaignForm = this.fb.group({
      name: ['', Validators.required],
      target: ['All Umrah Clients' as CampaignTarget, Validators.required],
      message: ['', [Validators.required, Validators.maxLength(160)]],
    });
  }

  onSubmit() {
    if (this.campaignForm.valid) {
      const campaignData = this.campaignForm.value;
      const message = `Are you sure you want to send this campaign to "${campaignData.target}"?`;
      this.uiService.showConfirmation('Confirm Campaign', message, () => {
        this.marketingService.sendCampaign(campaignData);
        this.campaignForm.reset({ target: 'All Umrah Clients' });
      });
    }
  }

  getStatusClass(status: Campaign['status']) {
    return status === 'Sent' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  }
}
