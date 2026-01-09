
import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap, of } from 'rxjs';
import { GroupService } from '../../services/group.service';
import { CustomerService } from '../../services/customer.service';
import { UiService } from '../../services/ui.service';
import { AuthService } from '../../services/auth.service';
import { LogService } from '../../services/log.service';
import { Group } from '../../models/group.model';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './group-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private groupService = inject(GroupService);
  private customerService = inject(CustomerService);
  private uiService = inject(UiService);
  private authService = inject(AuthService);
  private logService = inject(LogService);

  group = signal<Group | undefined>(undefined);
  
  allCustomers = this.customerService.customers;

  groupMembers = computed<Customer[]>(() => {
    const grp = this.group();
    const customers = this.allCustomers();
    if (!grp) return [];
    return customers.filter(c => grp.memberIds.includes(c.id));
  });

  availableCustomers = computed<Customer[]>(() => {
    const grp = this.group();
    const customers = this.allCustomers();
    if (!grp) return customers;
    return customers.filter(c => !grp.memberIds.includes(c.id));
  });
  
  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return of(id ? this.groupService.getGroupById(id) : undefined);
      })
    ).subscribe(group => {
      if (group) {
        this.group.set(group);
      } else {
        this.router.navigate(['/groups']);
      }
    });
  }

  addMember(customerId: string) {
    const groupId = this.group()?.id;
    if (groupId) {
      this.groupService.addMemberToGroup(groupId, customerId);
      // Re-fetch group data to trigger signal update
      this.group.set(this.groupService.getGroupById(groupId));
    }
  }

  removeMember(customer: Customer) {
    const groupId = this.group()?.id;
    if (groupId) {
        const message = `Are you sure you want to remove ${customer.fullName} from the group?`;
        this.uiService.showConfirmation('Remove Member', message, () => {
            this.groupService.removeMemberFromGroup(groupId, customer.id);
            // Re-fetch group data to trigger signal update
            this.group.set(this.groupService.getGroupById(groupId));
        });
    }
  }

  downloadDocuments() {
    const members = this.groupMembers();
    if (members.length === 0) {
        alert('No members in this group to download documents for.');
        return;
    }
    const message = `This will simulate compiling and downloading a single PDF with documents for all ${members.length} members. Do you want to continue?`;
    this.uiService.showConfirmation('Bulk Download', message, () => {
        alert(`Simulating download of a compiled PDF for group "${this.group()?.name}"...`);
        this.logService.addLog({
            type: 'document',
            description: `Downloaded bulk documents for group: ${this.group()?.name}`,
            user: this.authService.currentUser()?.name
        });
    });
  }
}