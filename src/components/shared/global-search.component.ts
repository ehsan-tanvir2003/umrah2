
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'global-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './global-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSearchComponent {
  private customerService = inject(CustomerService);
  private router = inject(Router);

  searchTerm = signal('');
  isFocused = signal(false);
  
  allCustomers = this.customerService.customers;

  searchResults = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term || !this.isFocused()) {
      return [];
    }
    return this.allCustomers().filter(customer =>
      customer.fullName.toLowerCase().includes(term) ||
      customer.passportNumber.toLowerCase().includes(term) ||
      customer.mobileNumber.includes(term)
    ).slice(0, 5); // Limit to 5 results
  });

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  selectCustomer(customer: Customer) {
    this.router.navigate(['/customers', customer.id]);
    this.searchTerm.set('');
    this.isFocused.set(false);
  }
}
