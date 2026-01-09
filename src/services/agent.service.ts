
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Agent } from '../models/agent.model';

@Injectable({ providedIn: 'root' })
export class AgentService {
    private _agents: WritableSignal<Agent[]> = signal([]);
    public readonly agents = this._agents.asReadonly();

    constructor() {
        this._agents.set([
            {
                id: 'AGENT-001',
                name: 'Rahim Khan',
                branch: 'Dhaka',
                mobile: '01711000001',
                email: 'rahim.khan@agency.com',
                customersManaged: 25,
                totalCommission: 125000,
            },
            {
                id: 'AGENT-002',
                name: 'Karima Begum',
                branch: 'Chittagong',
                mobile: '01811000002',
                email: 'karima.begum@agency.com',
                customersManaged: 18,
                totalCommission: 92000,
            },
            {
                id: 'AGENT-003',
                name: 'Jamal Hossain',
                branch: 'Sylhet',
                mobile: '01911000003',
                email: 'jamal.hossain@agency.com',
                customersManaged: 15,
                totalCommission: 78000,
            },
            {
                id: 'AGENT-004',
                name: 'Faria Islam',
                branch: 'Dhaka',
                mobile: '01611000004',
                email: 'faria.islam@agency.com',
                customersManaged: 32,
                totalCommission: 168000,
            },
        ]);
    }
}
