
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reports.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsComponent {
  private uiService = inject(UiService);
  
  financialReports = [
    { name: 'Profit & Loss Statement', description: 'View income, expenses, and net profit.', link: '/reports/profit-loss' },
    { name: 'Sales Summary', description: 'Summary of all bookings and revenue.' },
    { name: 'Expense Report', description: 'Detailed breakdown of all company expenses.' },
    { name: 'Master Payment Report', description: 'All payments from Hajj, Umrah, Tickets etc.' },
    { name: 'Date Wise Detail Ledger', description: 'Complete financial ledger for a date range.' },
    { name: 'Cash in Hand Report', description: 'Daily summary of cash flow.' },
  ];

  customerReports = [
    { name: 'Customer Report', description: 'Export a complete list of all registered customers.' },
    { name: 'Haji Report', description: 'Filtered report for all Hajj clients.' },
    { name: 'Omra Haji Report', description: 'Filtered report for all Umrah clients.' },
    { name: 'Customer Ledger', description: 'Detailed transaction history for a customer.' },
    { name: 'Due Payments Report', description: 'List of all customers with outstanding balances.' },
  ];

  agentReports = [
      { name: 'Detailed Agent Ledger', description: 'Transaction history for a specific agent.' },
      { name: 'Agent Summary Ledger', description: 'Summary of commissions and payments per agent.' },
      { name: 'Agent Wise Yearly Report', description: 'Yearly performance and client report per agent.' },
      { name: 'Agent Payment Report', description: 'History of all commission payments to agents.' },
  ];
  
  bookingReports = [
    { name: 'Package-wise Bookings', description: 'See how many customers have booked each package.' },
    { name: 'Visa Status Report', description: 'Track the status of all visa applications.' },
    { name: 'Flight Manifest', description: 'List of passengers for upcoming flights.' },
  ];

  downloadReport(reportName: string) {
    this.uiService.showConfirmation('Download Report', `This will simulate generating and downloading the "${reportName}". Do you want to continue?`, () => {
        this.uiService.showToast(`Generating and downloading "${reportName}"...`, 'info');
    });
  }
}
