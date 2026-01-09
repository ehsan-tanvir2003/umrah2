
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { Transaction, TransactionType } from '../../models/transaction.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transactions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsComponent {
  private transactionService = inject(TransactionService);
  transactions = this.transactionService.transactions;

  getIcon(type: TransactionType): { path: string, class: string } {
      if(type === 'Credit') {
        return { path: 'M12 4.5v15m7.5-7.5h-15', class: 'text-green-500' };
      }
      return { path: 'M19.5 12h-15', class: 'text-red-500' };
  }
}
