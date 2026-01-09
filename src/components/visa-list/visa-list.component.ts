
import { Component, ChangeDetectionStrategy, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisaService } from '../../services/visa.service';
import { Visa } from '../../models/visa.model';

@Component({
  selector: 'visa-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visa-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisaListComponent {
  addVisa = output<void>();
  private visaService = inject(VisaService);
  visas = this.visaService.visas;

  onAddVisa() {
    this.addVisa.emit();
  }

  getStatusClass(status: Visa['status']): string {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Submitted':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
