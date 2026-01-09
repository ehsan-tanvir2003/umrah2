
import { Injectable, signal, WritableSignal } from '@angular/core';
import { CompanyProfile, FinancialSettings, ApplicationSettings } from '../models/settings.model';
import { BankAccount } from '../models/bank-account.model';
import { Supplier } from '../models/supplier.model';
import { Country } from '../models/country.model';

@Injectable({ providedIn: 'root' })
export class SettingsService {

  private _companyProfile: WritableSignal<CompanyProfile> = signal({
    name: 'UmrahFlow Travel Agency',
    address: '123 Gulshan Avenue, Dhaka 1212, Bangladesh',
    phone: '+880 1712-345678',
    email: 'contact@umrahflow.com',
    logoUrl: 'https://tailwindui.com/img/logos/mark.svg?color=teal&shade=600'
  });
  public readonly companyProfile = this._companyProfile.asReadonly();

  private _financialSettings: WritableSignal<FinancialSettings> = signal({
    currency: 'BDT',
    taxNumber: 'BIN: 123456789'
  });
  public readonly financialSettings = this._financialSettings.asReadonly();

  private _applicationSettings: WritableSignal<ApplicationSettings> = signal({
      appBaseUrl: 'https://umrahflow.app'
  });
  public readonly applicationSettings = this._applicationSettings.asReadonly();

  private _bankAccounts: WritableSignal<BankAccount[]> = signal([
    {
      id: 'BANK-001',
      bankName: 'Islami Bank Bangladesh Ltd.',
      accountName: 'UmrahFlow Travel Agency',
      accountNumber: '1234567890123',
      branch: 'Gulshan Branch'
    },
    {
      id: 'BANK-002',
      bankName: 'Dutch-Bangla Bank Ltd.',
      accountName: 'UmrahFlow Travel Agency',
      accountNumber: '0987654321098',
      branch: 'Banani Branch'
    }
  ]);
  public readonly bankAccounts = this._bankAccounts.asReadonly();
  
  private _suppliers: WritableSignal<Supplier[]> = signal([
    { id: 'SUP-001', name: 'Al-Madinah Hotels KSA', category: 'Hotel', country: 'Saudi Arabia', contactPerson: 'Mr. Khalid', mobile: '+966...', email: 'info@madinahhotels.com' },
    { id: 'SUP-002', name: 'Mecca Transport Services', category: 'Transport', country: 'Saudi Arabia', contactPerson: 'Mr. Fahad', mobile: '+966...', email: 'contact@meccatransport.com' }
  ]);
  public readonly suppliers = this._suppliers.asReadonly();
  
  private _countries: WritableSignal<Country[]> = signal([
    { code: 'BD', name: 'Bangladesh' },
    { code: 'SA', name: 'Saudi Arabia' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'MY', name: 'Malaysia' },
  ]);
  public readonly countries = this._countries.asReadonly();

  updateCompanyProfile(profile: CompanyProfile) {
    this._companyProfile.set(profile);
  }

  updateFinancialSettings(settings: FinancialSettings) {
    this._financialSettings.set(settings);
  }
  
  updateApplicationSettings(settings: ApplicationSettings) {
    this._applicationSettings.set(settings);
  }

  saveBankAccount(account: BankAccount) {
    this._bankAccounts.update(accounts => {
        const index = accounts.findIndex(a => a.id === account.id);
        if(index > -1) {
            accounts[index] = account;
            return [...accounts];
        } else {
             const newAccount = {...account, id: `BANK-${Date.now()}`};
            return [newAccount, ...accounts];
        }
    });
  }

  deleteBankAccount(accountId: string) {
      this._bankAccounts.update(accounts => accounts.filter(a => a.id !== accountId));
  }

  saveSupplier(supplier: Supplier) {
    this._suppliers.update(suppliers => {
        const index = suppliers.findIndex(s => s.id === supplier.id);
        if (index > -1) {
            suppliers[index] = supplier;
            return [...suppliers];
        } else {
            const newSupplier = {...supplier, id: `SUP-${Date.now()}`};
            return [newSupplier, ...suppliers];
        }
    });
  }

  deleteSupplier(supplierId: string) {
      this._suppliers.update(suppliers => suppliers.filter(s => s.id !== supplierId));
  }

  saveCountry(country: Country) {
    // For countries, the code is the unique identifier, don't auto-generate it.
    this._countries.update(countries => {
        const index = countries.findIndex(c => c.code.toUpperCase() === country.code.toUpperCase());
        if (index > -1) {
            countries[index] = country;
            return [...countries];
        } else {
            return [country, ...countries].sort((a,b) => a.name.localeCompare(b.name));
        }
    });
  }
  
  deleteCountry(countryCode: string) {
      this._countries.update(countries => countries.filter(c => c.code !== countryCode));
  }
}
