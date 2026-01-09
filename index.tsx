

import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { AppComponent } from './src/app.component';
import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './src/app.routes';


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideZonelessChangeDetection(),
    provideHttpClient(),
    importProvidersFrom(ReactiveFormsModule)
  ]
}).catch(err => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.
