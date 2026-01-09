
import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GroupService } from '../../services/group.service';
import { Group } from '../../models/group.model';
import { UiService } from '../../services/ui.service';
import { AddGroupModalComponent } from '../../components/modals/add-group-modal.component';

@Component({
  selector: 'app-group-management',
  standalone: true,
  imports: [CommonModule, RouterLink, AddGroupModalComponent],
  templateUrl: './groups.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupManagementComponent {
  private groupService = inject(GroupService);
  private uiService = inject(UiService);

  groups = this.groupService.groups;
  isModalOpen = signal(false);
  editingGroup = signal<Group | null>(null);

  openModal(group: Group | null = null) {
    this.editingGroup.set(group);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingGroup.set(null);
  }

  handleSaveGroup(groupData: { name: string, description: string, travelDate: string, id?: string }) {
    if (groupData.id) {
        const existingGroup = this.groupService.getGroupById(groupData.id);
        if (existingGroup) {
            this.groupService.updateGroup({ ...existingGroup, ...groupData });
        }
    } else {
      this.groupService.createGroup(groupData);
    }
    this.closeModal();
  }

  handleDeleteGroup(group: Group) {
    const message = `Are you sure you want to delete the group "${group.name}"? This action cannot be undone.`;
    this.uiService.showConfirmation('Delete Group', message, () => {
      this.groupService.deleteGroup(group.id);
    });
  }
}