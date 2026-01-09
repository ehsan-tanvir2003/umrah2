
import { Component, ChangeDetectionStrategy, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SmsService } from '../../services/sms.service';
import { SettingsService } from '../../services/settings.service';
import { UserService } from '../../services/user.service';
import { UiService } from '../../services/ui.service';
import { AuthService } from '../../services/auth.service';
import { SmsTemplate } from '../../models/sms.model';
import { User } from '../../models/user.model';
import { BankAccount } from '../../models/bank-account.model';
import { Supplier } from '../../models/supplier.model';
import { Country } from '../../models/country.model';

import { AddUserModalComponent } from '../../components/modals/add-user-modal.component';
import { AddBankAccountModalComponent } from '../../components/modals/add-bank-account-modal.component';
import { AddSupplierModalComponent } from '../../components/modals/add-supplier-modal.component';
import { AddCountryModalComponent } from '../../components/modals/add-country-modal.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AddUserModalComponent, AddBankAccountModalComponent, AddSupplierModalComponent, AddCountryModalComponent],
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
  private smsService = inject(SmsService);
  private settingsService = inject(SettingsService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private uiService = inject(UiService);
  private authService = inject(AuthService);

  companyProfileForm!: FormGroup;
  financialSettingsForm!: FormGroup;
  applicationSettingsForm!: FormGroup;
  gatewaySettingsForm!: FormGroup;
  templateForm!: FormGroup;

  isSuperAdmin = computed(() => this.authService.hasRole(['Super Admin']));

  templates = this.smsService.templates;
  users = this.userService.users;
  bankAccounts = this.settingsService.bankAccounts;
  suppliers = this.settingsService.suppliers;
  countries = this.settingsService.countries;

  selectedTemplate = signal<SmsTemplate | null>(null);
  activeTab = signal<'profile' | 'app' | 'users' | 'banks' | 'suppliers' | 'countries' | 'sms'>('profile');
  
  // Modal states
  isUserModalOpen = signal(false);
  isBankAccountModalOpen = signal(false);
  isSupplierModalOpen = signal(false);
  isCountryModalOpen = signal(false);

  // Data for editing
  editingUser = signal<User | null>(null);
  editingBankAccount = signal<BankAccount | null>(null);
  editingSupplier = signal<Supplier | null>(null);
  editingCountry = signal<Country | null>(null);


  ngOnInit() {
    this.initForms();
  }

  initForms() {
    const companyProfile = this.settingsService.companyProfile();
    this.companyProfileForm = this.fb.group({
      name: [companyProfile.name, Validators.required],
      address: [companyProfile.address, Validators.required],
      phone: [companyProfile.phone, Validators.required],
      email: [companyProfile.email, [Validators.required, Validators.email]],
      logoUrl: [companyProfile.logoUrl],
    });

    const financialSettings = this.settingsService.financialSettings();
    this.financialSettingsForm = this.fb.group({
      currency: [financialSettings.currency, Validators.required],
      taxNumber: [financialSettings.taxNumber],
    });
    
    const appSettings = this.settingsService.applicationSettings();
    this.applicationSettingsForm = this.fb.group({
        appBaseUrl: [appSettings.appBaseUrl, Validators.required]
    });

    const smsSettings = this.smsService.settings();
    this.gatewaySettingsForm = this.fb.group({
      provider: [smsSettings.provider, Validators.required],
      apiKey: [smsSettings.apiKey, Validators.required],
      senderId: [smsSettings.senderId, Validators.required],
    });

    this.templateForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  saveCompanyProfile() {
    if (this.companyProfileForm.valid) {
      this.settingsService.updateCompanyProfile(this.companyProfileForm.value);
      this.companyProfileForm.markAsPristine();
      this.uiService.showToast('Company Profile Saved!');
    }
  }

  saveFinancialSettings() {
    if (this.financialSettingsForm.valid) {
      this.settingsService.updateFinancialSettings(this.financialSettingsForm.value);
      this.financialSettingsForm.markAsPristine();
      this.uiService.showToast('Financial Settings Saved!');
    }
  }

  saveApplicationSettings() {
    if (this.applicationSettingsForm.valid) {
      this.settingsService.updateApplicationSettings(this.applicationSettingsForm.value);
      this.applicationSettingsForm.markAsPristine();
      this.uiService.showToast('Application Settings Saved!');
    }
  }

  // --- User Management ---
  openUserModal(user: User | null = null) {
    this.editingUser.set(user);
    this.isUserModalOpen.set(true);
  }

  closeUserModal() {
    this.isUserModalOpen.set(false);
    this.editingUser.set(null);
  }

  handleSaveUser(user: User) {
    if (user.id) {
      this.userService.updateUser(user);
    } else {
      this.userService.addUser(user);
    }
    this.closeUserModal();
  }
  
  handleDeleteUser(user: User) {
    const message = `Are you sure you want to delete user "${user.name}"? This action cannot be undone.`;
    this.uiService.showConfirmation('Delete User', message, () => {
        if(user.id) this.userService.deleteUser(user.id);
    });
  }

  // --- Bank Account Management ---
  openBankAccountModal(account: BankAccount | null = null) {
    this.editingBankAccount.set(account);
    this.isBankAccountModalOpen.set(true);
  }

  closeBankAccountModal() {
    this.isBankAccountModalOpen.set(false);
    this.editingBankAccount.set(null);
  }

  handleSaveBankAccount(account: BankAccount) {
    this.settingsService.saveBankAccount(account);
    this.closeBankAccountModal();
  }

  handleDeleteBankAccount(account: BankAccount) {
    const message = `Are you sure you want to delete the account "${account.bankName} - ${account.accountNumber}"?`;
    this.uiService.showConfirmation('Delete Bank Account', message, () => {
         if(account.id) this.settingsService.deleteBankAccount(account.id);
    });
  }

  // --- Supplier Management ---
  openSupplierModal(supplier: Supplier | null = null) {
    this.editingSupplier.set(supplier);
    this.isSupplierModalOpen.set(true);
  }

  closeSupplierModal() {
    this.isSupplierModalOpen.set(false);
    this.editingSupplier.set(null);
  }

  handleSaveSupplier(supplier: Supplier) {
    this.settingsService.saveSupplier(supplier);
    this.closeSupplierModal();
  }

  handleDeleteSupplier(supplier: Supplier) {
    const message = `Are you sure you want to delete supplier "${supplier.name}"?`;
    this.uiService.showConfirmation('Delete Supplier', message, () => {
        if(supplier.id) this.settingsService.deleteSupplier(supplier.id);
    });
  }

  // --- Country Management ---
  openCountryModal(country: Country | null = null) {
      this.editingCountry.set(country);
      this.isCountryModalOpen.set(true);
  }

  closeCountryModal() {
      this.isCountryModalOpen.set(false);
      this.editingCountry.set(null);
  }

  handleSaveCountry(country: Country) {
      this.settingsService.saveCountry(country);
      this.closeCountryModal();
  }

  handleDeleteCountry(country: Country) {
    const message = `Are you sure you want to delete the country "${country.name}"?`;
    this.uiService.showConfirmation('Delete Country', message, () => {
        this.settingsService.deleteCountry(country.code);
    });
  }

  // --- SMS Management ---
  saveGatewaySettings() {
    if (this.gatewaySettingsForm.valid) {
      this.smsService.updateSettings(this.gatewaySettingsForm.value);
      this.gatewaySettingsForm.markAsPristine();
      this.uiService.showToast('SMS Gateway Settings Saved!');
    }
  }

  selectTemplate(template: SmsTemplate | null) {
    if (template) {
      this.selectedTemplate.set(template);
      this.templateForm.patchValue(template);
    } else {
      this.selectedTemplate.set(null);
      this.templateForm.reset({ id: '', name: '', content: '' });
    }
  }

  saveTemplate() {
    if (this.templateForm.valid) {
      let templateData = this.templateForm.value;
      if (!templateData.id) {
        templateData.id = `TPL-${Date.now()}`;
      }
      this.smsService.saveTemplate(templateData);
      this.selectTemplate(null); // Clear form
    }
  }

  deleteTemplate() {
    const template = this.selectedTemplate();
    if (template) {
        const message = `Are you sure you want to delete the "${template.name}" template?`;
        this.uiService.showConfirmation('Delete SMS Template', message, () => {
            this.smsService.deleteTemplate(template.id);
            this.selectTemplate(null);
        });
    }
  }
}
