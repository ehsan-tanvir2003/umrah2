
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogService } from '../../services/log.service';
import { LogType } from '../../models/log-entry.model';

@Component({
  selector: 'app-event-logs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-logs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventLogsComponent {
  private logService = inject(LogService);
  
  logs = this.logService.logs;
  users = this.logService.users;
  selectedUser = signal<string>('all');

  filteredLogs = computed(() => {
    const user = this.selectedUser();
    const allLogs = this.logs();
    if (user === 'all') {
      return allLogs;
    }
    return allLogs.filter(log => log.user === user);
  });

  onUserFilterChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedUser.set(selectElement.value);
  }

  getIcon(type: LogType): { path: string; class: string; } {
    switch (type) {
      case 'customer':
        return { path: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', class: 'text-blue-500' };
      case 'payment':
        return { path: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01', class: 'text-green-500' };
      case 'package':
        return { path: 'M8 7v8a2 2 0 002 2h4M8 7a2 2 0 012-2h4a2 2 0 012 2v8a2 2 0 01-2 2h-4a2 2 0 01-2-2V7z', class: 'text-purple-500' };
      case 'visa':
        return { path: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', class: 'text-teal-500' };
      case 'sms':
        return { path: 'M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.455.09-.934.09-1.425v-2.291A5.973 5.973 0 0 1 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z', class: 'text-orange-500' };
      case 'document':
        return { path: 'M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3', class: 'text-indigo-500' };
      case 'system':
        return { path: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', class: 'text-gray-500' };
      default:
        return { path: '', class: '' };
    }
  }
}