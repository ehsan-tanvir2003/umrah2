
import { Component, ChangeDetectionStrategy, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { InvoiceService } from '../../services/invoice.service';
import { SettingsService } from '../../services/settings.service';
import { CustomerService } from '../../services/customer.service';
import { Invoice } from '../../models/invoice.model';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private invoiceService = inject(InvoiceService);
  private settingsService = inject(SettingsService);
  private customerService = inject(CustomerService);

  invoice = signal<Invoice | undefined>(undefined);
  customer = signal<Customer | undefined>(undefined);
  companyProfile = this.settingsService.companyProfile;
  financialSettings = this.settingsService.financialSettings;
  appSettings = this.settingsService.applicationSettings;

  qrCodeUrl = computed(() => {
    const inv = this.invoice();
    if (!inv) return '';
    const trackingUrl = `${this.appSettings().appBaseUrl}/#/tracking/${inv.id}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(trackingUrl)}`;
  });

  barcodeUrl = computed(() => {
      const inv = this.invoice();
      if (!inv) return '';
      // Using barcode.tec-it.com API for barcode generation
      return `https://barcode.tec-it.com/barcode.ashx?data=${inv.id}&code=Code128&dpi=96`;
  });

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => {
        const bookingId = params.get('bookingId');
        return of(bookingId ? this.invoiceService.getInvoiceByBookingId(bookingId) : undefined);
      })
    ).subscribe(invoice => {
      if (invoice) {
        this.invoice.set(invoice);
        const fullCustomer = this.customerService.getCustomerById(invoice.customer.id);
        this.customer.set(fullCustomer);
      } else {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  printInvoice() {
    window.print();
  }
}