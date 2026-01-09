
import { Injectable, signal, WritableSignal, inject } from '@angular/core';
import { OmrahPackage } from '../models/package.model';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private logService = inject(LogService);
  private _packages: WritableSignal<OmrahPackage[]> = signal<OmrahPackage[]>([]);
  public readonly packages = this._packages.asReadonly();

  constructor() {
    this._packages.set([
      {
        id: 'PKG-001',
        packageName: '14 Days Economy Umrah Package',
        duration: 14,
        makkahHotel: 'Jawharat Al-Ferdous',
        madinahHotel: 'Hayah Plaza Hotel',
        hotelDistance: '600m from Masjid al-Haram',
        roomType: 'Quad',
        transportType: 'Bus',
        airline: 'Biman Bangladesh Airlines',
        price: 125000,
        inclusions: ['Visa', 'Flights', 'Hotel', 'Transport'],
        exclusions: ['Food', 'Personal Expenses']
      },
      {
        id: 'PKG-002',
        packageName: '10 Days 5-Star Umrah Package',
        duration: 10,
        makkahHotel: 'Swissôtel Makkah',
        madinahHotel: 'Anwar Al Madinah Mövenpick',
        hotelDistance: '100m from Masjid al-Haram',
        roomType: 'Double',
        transportType: 'Private Car',
        airline: 'Saudia Airlines',
        price: 250000,
        inclusions: ['Visa', 'Flights', '5-Star Hotel', 'Private Transport', 'Breakfast'],
        exclusions: ['Lunch', 'Dinner', 'Personal Expenses']
      },
      {
        id: 'PKG-003',
        packageName: '21 Days Ramadan Special Package',
        duration: 21,
        makkahHotel: 'Al Ghufran Safwah Hotel',
        madinahHotel: 'Dar Al Hijra InterContinental',
        hotelDistance: '250m from Masjid al-Haram',
        roomType: 'Triple',
        transportType: 'Bus',
        airline: 'Emirates',
        price: 180000,
        inclusions: ['Visa', 'Flights', 'Hotel', 'Transport', 'Iftar & Sahur'],
        exclusions: ['Personal Expenses']
      }
    ]);
  }

  addPackage(pkg: Omit<OmrahPackage, 'id'>) {
    const newId = `PKG-${String(this._packages().length + 1).padStart(3, '0')}`;
    const newPackage: OmrahPackage = {
      ...pkg,
      id: newId
    };
    this._packages.update(packages => [...packages, newPackage]);
    this.logService.addLog({
        type: 'package',
        description: `New package created: ${pkg.packageName} (ID: ${newId})`,
        user: 'Rahim Khan (Manager)'
    });
  }
}
