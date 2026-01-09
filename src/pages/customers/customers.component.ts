
import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerListComponent } from '../../components/customer-list/customer-list.component';
import { AddCustomerModalComponent } from '../../components/add-customer-modal/add-customer-modal.component';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, CustomerListComponent, AddCustomerModalComponent],
  templateUrl: './customers.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersComponent {
  isModalOpen = signal(false);
  
  private customerService = inject(CustomerService);
  private uiService = inject(UiService);

  openAddCustomerModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  handleCustomerAdded(customer: Omit<Customer, 'id' | 'status'>) {
    this.customerService.addCustomer(customer);
    this.uiService.showToast('Customer added successfully!');
    this.closeModal();
  }
}
