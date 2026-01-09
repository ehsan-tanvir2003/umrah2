
import { Injectable, signal, WritableSignal, computed } from '@angular/core';
import { LogEntry, LogType } from '../models/log-entry.model';

@Injectable({ providedIn: 'root' })
export class LogService {
  private _logs: WritableSignal<LogEntry[]> = signal([]);
  public readonly logs = this._logs.asReadonly();

  public readonly users = computed(() => {
    const allUsers = this._logs().map(log => log.user);
    return [...new Set(allUsers)];
  });

  constructor() {
    // Initialize with a system start log
    this.addLog({
        type: 'system',
        description: 'Application session started.',
        user: 'System'
    });
  }

  addLog(logData: { type: LogType, description: string, user?: string }) {
    const newLog: LogEntry = {
      id: `LOG-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date(),
      user: logData.user || 'System Admin', // Mock user
      type: logData.type,
      description: logData.description,
    };
    // Add to the beginning of the array for reverse-chronological order
    this._logs.update(logs => [newLog, ...logs]);
  }
}
