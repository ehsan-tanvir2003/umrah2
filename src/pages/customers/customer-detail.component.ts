import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SendSmsModalComponent } from '../../components/send-sms-modal/send-sms-modal.component';
import { BookingService } from '../../services/booking.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, SendSmsModalComponent, NgOptimizedImage],
  templateUrl: './customer-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private customerService = inject(CustomerService);
  private bookingService = inject(BookingService);
  private fb = inject(FormBuilder);
  private uiService = inject(UiService);

  customer = signal<Customer | undefined>(undefined);
  isEditMode = signal(false);
  isSmsModalOpen = signal(false);
  customerForm!: FormGroup;

  customerBooking = computed(() => {
    const cust = this.customer();
    if (!cust) return null;
    return this.bookingService.bookings().find(b => b.customerId === cust.id);
  });

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return of(id ? this.customerService.getCustomerById(id) : undefined);
      })
    ).subscribe(customer => {
      if (customer) {
        this.customer.set(customer);
        this.initializeForm(customer);
      } else {
        // Handle case where customer is not found, maybe redirect
        this.router.navigate(['/customers']);
      }
    });
  }

  initializeForm(customer: Customer) {
    this.customerForm = this.fb.group({
      fullName: [customer.fullName, Validators.required],
      fatherName: [customer.fatherName],
      motherName: [customer.motherName],
      dateOfBirth: [customer.dateOfBirth, Validators.required],
      gender: [customer.gender, Validators.required],
      nidNumber: [customer.nidNumber],
      passportNumber: [customer.passportNumber, Validators.required],
      passportIssueDate: [customer.passportIssueDate, Validators.required],
      passportExpiryDate: [customer.passportExpiryDate, Validators.required],
      mobileNumber: [customer.mobileNumber, [Validators.required, Validators.pattern('^[0-9]{11}$')]],
      whatsappNumber: [customer.whatsappNumber],
      email: [customer.email, [Validators.email]],
      status: [customer.status, Validators.required],
    });
  }

  toggleEditMode(value: boolean) {
    this.isEditMode.set(value);
    if (!value) {
      // Reset form if canceling edit
      const currentCustomer = this.customer();
      if(currentCustomer) {
        this.initializeForm(currentCustomer);
      }
    }
  }

  saveChanges() {
    if (this.customerForm.valid) {
      const updatedCustomer: Customer = {
        ...this.customer()!,
        ...this.customerForm.value
      };
      this.customerService.updateCustomer(updatedCustomer);
      this.customer.set(updatedCustomer);
      this.toggleEditMode(false);
      this.uiService.showToast('Customer profile saved successfully!');
    } else {
      this.customerForm.markAllAsTouched();
      this.uiService.showToast('Please correct the form errors.', 'error');
    }
  }
  
  openSmsModal() {
    this.isSmsModalOpen.set(true);
  }

  closeSmsModal() {
    this.isSmsModalOpen.set(false);
  }

  viewInvoice() {
    const booking = this.customerBooking();
    if (booking) {
      this.router.navigate(['/invoice', booking.id]);
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Ready to Fly': return 'bg-green-100 text-green-800';
      case 'Visa Approved': return 'bg-blue-100 text-blue-800';
      case 'Documents Collected': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}