
import { Component, ChangeDetectionStrategy, output, computed, signal, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'customer-list',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  templateUrl: './customer-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerListComponent {
  addCustomer = output<void>();
  
  private customerService = inject(CustomerService);
  
  searchTerm = signal('');
  
  customers = this.customerService.customers;
  
  filteredCustomers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      return this.customers();
    }
    return this.customers().filter(customer =>
      customer.fullName.toLowerCase().includes(term) ||
      customer.passportNumber.toLowerCase().includes(term) ||
      customer.mobileNumber.includes(term)
    );
  });
  
  onAddCustomer() {
    this.addCustomer.emit();
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Ready to Fly':
        return 'bg-green-100 text-green-800';
      case 'Visa Approved':
        return 'bg-blue-100 text-blue-800';
      case 'Documents Collected':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}