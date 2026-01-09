
import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { PackagesComponent } from './pages/packages/packages.component';
import { VisaComponent } from './pages/visa/visa.component';
import { AccountingComponent } from './pages/accounting/accounting.component';
import { CustomerDetailComponent } from './pages/customers/customer-detail.component';
import { EventLogsComponent } from './pages/admin/event-logs.component';
import { AgentsComponent } from './pages/admin/agents.component';
import { SettingsComponent } from './pages/admin/settings.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { InvoiceComponent } from './pages/invoice/invoice.component';
import { ReportsComponent } from './pages/reports/reports.component';

// New Component Imports
import { VisitorsComponent } from './pages/visitors/visitors.component';
import { PassportManagementComponent } from './pages/passport-management/passport-management.component';
import { TicketManagementComponent } from './pages/tickets/tickets.component';
import { GroupManagementComponent } from './pages/groups/groups.component';
import { GroupDetailComponent } from './pages/groups/group-detail.component';
import { ManpowerComponent } from './pages/manpower/manpower.component';
import { StudentsComponent } from './pages/students/students.component';
import { MarketingComponent } from './pages/marketing/marketing.component';
import { HajjPreRegistrationComponent } from './pages/hajj/pre-registration.component';
import { ProfitLossReportComponent } from './pages/reports/profit-loss.component';
import { ExpensesComponent } from './pages/expenses/expenses.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },
    
    // CRM
    { path: 'visitors', component: VisitorsComponent, title: 'Visitor Management' },
    { path: 'customers', component: CustomersComponent, title: 'Umrah Client Management' },
    { path: 'customers/:id', component: CustomerDetailComponent, title: 'Customer Profile' },
    { path: 'marketing', component: MarketingComponent, title: 'Marketing Management' },

    // Hajj & Umrah
    { path: 'hajj/pre-registration', component: HajjPreRegistrationComponent, title: 'Hajj Pre-Registration' },
    // Placeholder for Main Registration
    { path: 'hajj/main-registration', component: HajjPreRegistrationComponent, title: 'Hajj Main Registration' }, 
    { path: 'packages', component: PackagesComponent, title: 'Umrah Package Management' },
    { path: 'groups', component: GroupManagementComponent, title: 'Group Management' },
    { path: 'groups/:id', component: GroupDetailComponent, title: 'Manage Group' },


    // Operations
    { path: 'visa', component: VisaComponent, title: 'Visa Processing' },
    { path: 'passports', component: PassportManagementComponent, title: 'Passport Processing' },
    { path: 'tickets', component: TicketManagementComponent, title: 'Ticket Management' },
    { path: 'manpower', component: ManpowerComponent, title: 'Manpower Management' },
    { path: 'students', component: StudentsComponent, title: 'Student Info' },

    // Accounts
    { path: 'accounting', component: AccountingComponent, title: 'Accounting' },
    { path: 'transactions', component: TransactionsComponent, title: 'Accounts Ledger' },
    { path: 'expenses', component: ExpensesComponent, title: 'Expense Management' },
    { path: 'invoice/:bookingId', component: InvoiceComponent, title: 'View Invoice' },
    { path: 'reports', component: ReportsComponent, title: 'Reports' },
    { path: 'reports/profit-loss', component: ProfitLossReportComponent, title: 'Profit & Loss Report' },


    // Admin
    { path: 'agents', component: AgentsComponent, title: 'Agent Management' },
    { path: 'logs', component: EventLogsComponent, title: 'Event Logs' },
    { path: 'settings', component: SettingsComponent, title: 'Settings' },
];
