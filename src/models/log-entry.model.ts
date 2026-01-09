
export type LogType = 'customer' | 'payment' | 'package' | 'visa' | 'system' | 'sms' | 'document';

export interface LogEntry {
  id: string;
  type: LogType;
  timestamp: Date;
  user: string; // For now, just a name. Later, could be a user ID.
  description: string;
}