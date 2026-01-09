import { Component, ChangeDetectionStrategy, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Customer } from '../../models/customer.model';
import { ScanService } from '../../services/scan.service';
import { AiService } from '../../services/ai.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'add-customer-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-customer-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCustomerModalComponent {
  closeModal = output<void>();
  customerAdded = output<Omit<Customer, 'id' | 'status'>>();

  private fb = inject(FormBuilder);
  private scanService = inject(ScanService);
  private aiService = inject(AiService);
  private uiService = inject(UiService);
  
  isScanning = signal<null | 'passport' | 'nid'>(null);
  isParsingWithAi = signal(false);

  customerForm: FormGroup;
  aiParseControl = new FormControl('');

  constructor() {
    this.customerForm = this.fb.group({
      fullName: ['', Validators.required],
      fatherName: [''],
      motherName: [''],
      dateOfBirth: ['', Validators.required],
      nationality: ['Bangladeshi', Validators.required],
      gender: ['Male', Validators.required],
      nidNumber: [''],
      passportNumber: ['', Validators.required],
      passportIssueDate: ['', Validators.required],
      passportExpiryDate: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
      whatsappNumber: [''],
      email: ['', [Validators.email]],
    });
  }

  onClose() {
    this.closeModal.emit();
  }

  onSubmit() {
    if (this.customerForm.valid) {
      this.customerAdded.emit(this.customerForm.value);
    } else {
      this.customerForm.markAllAsTouched();
    }
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  async onScanPassport(): Promise<void> {
    this.isScanning.set('passport');
    try {
      const parsedData = await this.scanService.scanPassport();
      this.customerForm.patchValue(parsedData);
    } catch (e) {
      console.error("Failed to scan passport", e);
    } finally {
      this.isScanning.set(null);
    }
  }

  async onScanNid(): Promise<void> {
    this.isScanning.set('nid');
    try {
      const parsedData = await this.scanService.scanNid();
      this.customerForm.patchValue(parsedData);
    } catch (e) {
      console.error("Failed to scan NID", e);
    } finally {
      this.isScanning.set(null);
    }
  }

  async onParseWithAi(): Promise<void> {
    const textToParse = this.aiParseControl.value;
    if (!textToParse || !textToParse.trim()) {
        this.uiService.showToast('Please paste some text to parse.', 'warning');
        return;
    }
    this.isParsingWithAi.set(true);
    try {
        const parsedData = await this.aiService.parseCustomerData(textToParse);
        this.customerForm.patchValue(parsedData);
        this.uiService.showToast('AI has populated the form. Please review the details.', 'success');
    } catch (e) {
        console.error("Failed to parse with AI", e);
        this.uiService.showToast('Could not parse the provided text. Please try rephrasing it.', 'error');
    } finally {
        this.isParsingWithAi.set(false);
    }
  }
}