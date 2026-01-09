
import { Component, ChangeDetectionStrategy, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageService } from '../../services/package.service';

@Component({
  selector: 'package-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './package-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackageListComponent {
  addPackage = output<void>();
  private packageService = inject(PackageService);
  packages = this.packageService.packages;

  onAddPackage() {
    this.addPackage.emit();
  }
}
