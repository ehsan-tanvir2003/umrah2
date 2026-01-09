
import { Injectable, signal } from '@angular/core';
import { Notification, NotificationType } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  notifications = signal<Notification[]>([]);

  show(message: string, type: NotificationType = 'info', duration = 5000) {
    const newNotification: Notification = {
      id: Date.now(),
      message,
      type,
      duration,
    };

    this.notifications.update(current => [...current, newNotification]);

    setTimeout(() => {
      this.dismiss(newNotification.id);
    }, duration);
  }

  dismiss(id: number) {
    this.notifications.update(current => current.filter(n => n.id !== id));
  }
}
