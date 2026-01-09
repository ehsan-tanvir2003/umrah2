
import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManpowerClient } from '../../models/manpower.model';
import { ManpowerService } from '../../services/manpower.service';
import { UiService } from '../../services/ui.service';
import { AddManpowerClientModalComponent } from '../../components/modals/add-manpower-client-modal.component';

@Component({
  selector: 'app-manpower',
  standalone: true,
  imports: [CommonModule, AddManpowerClientModalComponent],
  templateUrl: './manpower.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManpowerComponent {
  private manpowerService = inject(ManpowerService);
  private uiService = inject(UiService);

  clients = this.manpowerService.clients;
  isModalOpen = signal(false);
  editingClient = signal<ManpowerClient | null>(null);

  getStatusClass(status: ManpowerClient['status']): string {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Documents Submitted': return 'bg-yellow-100 text-yellow-800';
      case 'Visa Processing': return 'bg-purple-100 text-purple-800';
      case 'Deployed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  openModal(client: ManpowerClient | null = null) {
    this.editingClient.set(client);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingClient.set(null);
  }

  handleSaveClient(client: ManpowerClient) {
    if (client.id) {
      this.manpowerService.updateClient(client);
    } else {
      this.manpowerService.addClient(client);
    }
    this.closeModal();
  }

  handleDeleteClient(client: ManpowerClient) {
    const message = `Are you sure you want to delete the record for "${client.fullName}"?`;
    this.uiService.showConfirmation('Delete Manpower Client', message, () => {
      if (client.id) this.manpowerService.deleteClient(client.id);
    });
  }
}
