
import { Injectable, signal, WritableSignal, inject } from '@angular/core';
import { Group } from '../models/group.model';
import { LogService } from './log.service';

@Injectable({ providedIn: 'root' })
export class GroupService {
    private logService = inject(LogService);

    private _groups: WritableSignal<Group[]> = signal([
        { id: 'GRP-001', name: 'Ramadan First 10 Days', description: 'Standard group for early Ramadan.', travelDate: '2025-03-01', memberIds: ['CUST-001', 'CUST-003'] },
        { id: 'GRP-002', name: 'December VIP Group', description: '5-Star package clients.', travelDate: '2024-12-15', memberIds: [] },
    ]);
    public readonly groups = this._groups.asReadonly();
    
    getGroupById(id: string): Group | undefined {
        return this._groups().find(g => g.id === id);
    }

    createGroup(groupData: Omit<Group, 'id' | 'memberIds'>) {
        const newGroup: Group = {
            ...groupData,
            id: `GRP-${Date.now()}`,
            memberIds: []
        };
        this._groups.update(groups => [newGroup, ...groups]);
        this.logService.addLog({ type: 'system', description: `New group created: ${groupData.name}` });
    }

    updateGroup(updatedGroup: Group) {
        this._groups.update(groups => groups.map(g => g.id === updatedGroup.id ? updatedGroup : g));
        this.logService.addLog({ type: 'system', description: `Group updated: ${updatedGroup.name}` });
    }

    deleteGroup(groupId: string) {
        const groupToDelete = this.getGroupById(groupId);
        if (groupToDelete) {
            this._groups.update(groups => groups.filter(g => g.id !== groupId));
            this.logService.addLog({ type: 'system', description: `Group deleted: ${groupToDelete.name}` });
        }
    }

    addMemberToGroup(groupId: string, customerId: string) {
        this._groups.update(groups => groups.map(group => {
            if (group.id === groupId && !group.memberIds.includes(customerId)) {
                return { ...group, memberIds: [...group.memberIds, customerId] };
            }
            return group;
        }));
    }

    removeMemberFromGroup(groupId: string, customerId: string) {
        this._groups.update(groups => groups.map(group => {
            if (group.id === groupId) {
                return { ...group, memberIds: group.memberIds.filter(id => id !== customerId) };
            }
            return group;
        }));
    }
}