
import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { AgentService } from '../../services/agent.service';
import { HajjService } from '../../services/hajj.service';
import { StudentService } from '../../services/student.service';
import { VisitorService } from '../../services/visitor.service';
import { BookingService } from '../../services/booking.service';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private customerService = inject(CustomerService);
  private agentService = inject(AgentService);
  private hajjService = inject(HajjService);
  private studentService = inject(StudentService);
  private visitorService = inject(VisitorService);
  private bookingService = inject(BookingService);
  private transactionService = inject(TransactionService);
  
  // Financial KPIs
  totalCredit = this.transactionService.totalCredit;
  todaysCredit = this.transactionService.todaysCredit;
  totalDebit = this.transactionService.totalDebit;
  todaysDebit = this.transactionService.todaysDebit;

  // Client KPIs
  preRegisteredHajj = computed(() => this.hajjService.registrations().filter(r => r.type === 'Pre-registered').length);
  mainHajj = computed(() => this.hajjService.registrations().filter(r => r.type === 'Main').length);
  umrahHajj = computed(() => this.customerService.customers().length); // Assuming customers are Umrah clients
  students = computed(() => this.studentService.students().length);
  tourTravelsCustomer = signal(5); // Mock data as per screenshot
  agentCustomer = computed(() => this.agentService.agents().length);
  totalVisitors = computed(() => this.visitorService.visitors().length);

  // For due payments table
  dueCustomers = computed(() => {
    return this.bookingService.bookings().map(booking => {
      const paidAmount = booking.payments.reduce((sum, p) => sum + p.amount, 0);
      const dueAmount = booking.totalAmount - paidAmount;
      return { ...booking, dueAmount };
    }).filter(b => b.dueAmount > 0).sort((a,b) => b.dueAmount - a.dueAmount);
  });
}
