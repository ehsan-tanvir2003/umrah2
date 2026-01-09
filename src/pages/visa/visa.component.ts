
import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisaListComponent } from '../../components/visa-list/visa-list.component';
import { AddVisaModalComponent } from '../../components/add-visa-modal/add-visa-modal.component';
import { VisaService } from '../../services/visa.service';
import { Visa } from '../../models/visa.model';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-visa',
  standalone: true,
  imports: [CommonModule, VisaListComponent, AddVisaModalComponent],
  templateUrl: './visa.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisaComponent {
  isModalOpen = signal(false);
  private visaService = inject(VisaService);
  private uiService = inject(UiService);

  openAddVisaModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  handleVisaAdded(visa: Omit<Visa, 'id'>) {
    this.visaService.addVisa(visa);
    this.uiService.showToast('Visa application added successfully!');
    this.closeModal();
  }
}
