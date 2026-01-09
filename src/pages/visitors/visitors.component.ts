
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitorService } from '../../services/visitor.service';
import { Visitor } from '../../models/visitor.model';

@Component({
  selector: 'app-visitors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visitors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitorsComponent {
  private visitorService = inject(VisitorService);
  visitors = this.visitorService.visitors;
  
  getStatusClass(status: Visitor['status']): string {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800';
      case 'Follow-up': return 'bg-purple-100 text-purple-800';
      case 'Converted': return 'bg-green-100 text-green-800';
      case 'Lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
