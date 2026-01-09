
import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageListComponent } from '../../components/package-list/package-list.component';
import { AddPackageModalComponent } from '../../components/add-package-modal/add-package-modal.component';
import { PackageService } from '../../services/package.service';
import { OmrahPackage } from '../../models/package.model';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [CommonModule, PackageListComponent, AddPackageModalComponent],
  templateUrl: './packages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackagesComponent {
  isModalOpen = signal(false);
  
  private packageService = inject(PackageService);
  private uiService = inject(UiService);

  openAddPackageModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  handlePackageAdded(pkg: Omit<OmrahPackage, 'id'>) {
    this.packageService.addPackage(pkg);
    this.uiService.showToast('Package added successfully!');
    this.closeModal();
  }
}
