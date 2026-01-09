
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HajjService } from '../../services/hajj.service';
import { AgentService } from '../../services/agent.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-hajj-pre-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pre-registration.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HajjPreRegistrationComponent {
  private fb = inject(FormBuilder);
  private hajjService = inject(HajjService);
  private agentService = inject(AgentService);
  private uiService = inject(UiService);

  agents = this.agentService.agents;
  registrationForm: FormGroup;
  currentYear = new Date().getFullYear();

  constructor() {
    this.registrationForm = this.fb.group({
      fullName: ['', Validators.required],
      fatherName: ['', Validators.required],
      motherName: ['', Validators.required],
      nidNumber: ['', Validators.required],
      passport: ['', Validators.required],
      phone: ['', Validators.required],
      address: [''],
      serialNo: [''],
      trackingNo: [''],
      agentName: [''],
      referencePerson: [''],
      chargeAmount: [30752, Validators.required],
      year: [this.currentYear + 1, Validators.required],
      dateOfBirth: ['', Validators.required],
      preRegistrationDate: [new Date().toISOString().split('T')[0], Validators.required],
      remarks: [''],
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      this.hajjService.addPreRegistration(this.registrationForm.value);
      this.uiService.showToast('Pre-registration successful!');
      this.onReset();
    } else {
      this.registrationForm.markAllAsTouched();
      this.uiService.showToast('Please fill all required fields.', 'error');
    }
  }

  onReset() {
    this.registrationForm.reset({
        chargeAmount: 30752,
        year: this.currentYear + 1,
        preRegistrationDate: new Date().toISOString().split('T')[0]
      });
  }
}
