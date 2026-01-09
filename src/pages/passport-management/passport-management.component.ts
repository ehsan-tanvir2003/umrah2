
import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-passport-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './passport-management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PassportManagementComponent {
  private customerService = inject(CustomerService);
  
  passports = computed(() => {
    return this.customerService.customers().map(c => ({
      customerId: c.id,
      customerName: c.fullName,
      passportNumber: c.passportNumber,
      issueDate: c.passportIssueDate,
      expiryDate: c.passportExpiryDate,
    })).sort((a,b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
  });

  isExpired(expiryDate: string): boolean {
    return new Date(expiryDate) < new Date();
  }

  isExpiringSoon(expiryDate: string): boolean {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(today.getMonth() + 6);
    return expiry > today && expiry < sixMonthsFromNow;
  }
}
