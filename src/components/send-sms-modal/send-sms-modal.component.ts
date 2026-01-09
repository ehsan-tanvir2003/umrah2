
import { Component, ChangeDetectionStrategy, output, input, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Customer } from '../../models/customer.model';
import { SmsService } from '../../services/sms.service';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'send-sms-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './send-sms-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendSmsModalComponent {
  customer = input.required<Customer>();
  closeModal = output<void>();

  private smsService = inject(SmsService);
  private bookingService = inject(BookingService);
  
  templates = this.smsService.templates;
  selectedTemplateId = signal<string>('');
  
  messagePreview = computed(() => {
    const templateId = this.selectedTemplateId();
    const template = this.templates().find(t => t.id === templateId);
    if (!template) return '';
    
    const customerData = this.customer();
    let message = template.content.replace(/{{customerName}}/g, customerData.fullName);

    // Handle template-specific placeholders
    if (template.name === 'Invoice Details') {
      const booking = this.bookingService.bookings().find(b => b.customerId === customerData.id);
      if (booking) {
        const paid = booking.payments.reduce((sum, p) => sum + p.amount, 0);
        const due = booking.totalAmount - paid;
        message = message.replace(/{{package}}/g, booking.packageName)
                       .replace(/{{total}}/g, `BDT ${booking.totalAmount.toLocaleString('en-BD')}`)
                       .replace(/{{paid}}/g, `BDT ${paid.toLocaleString('en-BD')}`)
                       .replace(/{{due}}/g, `BDT ${due.toLocaleString('en-BD')}`);
      } else {
         // Fallback if no booking is found
         message = message.replace(/{{package}}/g, '[Package Name]')
                       .replace(/{{total}}/g, 'N/A')
                       .replace(/{{paid}}/g, 'N/A')
                       .replace(/{{due}}/g, 'N/A');
      }
    } else {
      // Generic placeholders for other templates
      message = message.replace(/{{amount}}/g, 'XXXX.XX')
                       .replace(/{{flightDate}}/g, 'YYYY-MM-DD')
                       .replace(/{{flightTime}}/g, 'HH:MM AM/PM');
    }

    return message;
  });
  
  onClose() {
    this.closeModal.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onTemplateChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedTemplateId.set(selectElement.value);
  }

  async sendSms() {
    const message = this.messagePreview();
    if (message) {
      await this.smsService.sendSms(this.customer(), message);
      this.onClose();
    }
  }
}
