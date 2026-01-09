
import { Injectable, signal, inject } from '@angular/core';
import { NotificationService } from './notification.service';
import { NotificationType } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class UiService {
  private notificationService = inject(NotificationService);
  
  isConfirmationModalOpen = signal(false);
  confirmationTitle = signal('');
  confirmationMessage = signal('');
  private onConfirmCallback: (() => void) | null = null;

  showConfirmation(title: string, message: string, onConfirm: () => void) {
    this.confirmationTitle.set(title);
    this.confirmationMessage.set(message);
    this.onConfirmCallback = onConfirm;
    this.isConfirmationModalOpen.set(true);
  }
  
  showToast(message: string, type: NotificationType = 'success') {
    this.notificationService.show(message, type);
  }

  confirm() {
    if (this.onConfirmCallback) {
      this.onConfirmCallback();
    }
    this.reset();
  }

  cancel() {
    this.reset();
  }
  
  private reset() {
    this.isConfirmationModalOpen.set(false);
    this.confirmationTitle.set('');
    this.confirmationMessage.set('');
    this.onConfirmCallback = null;
  }
}
