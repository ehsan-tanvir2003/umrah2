import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AgentService } from '../../services/agent.service';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './agents.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentsComponent {
  private agentService = inject(AgentService);
  agents = this.agentService.agents;
}