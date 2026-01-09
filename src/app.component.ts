import { Component, ChangeDetectionStrategy, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter, map, mergeMap } from 'rxjs/operators';
import { UiService } from './services/ui.service';
import { AuthService } from './services/auth.service';
import { UserRole } from './models/user.model';
import { ConfirmationModalComponent } from './components/shared/confirmation-modal.component';
import { NotificationsComponent } from './components/shared/notifications.component';
import { GlobalSearchComponent } from './components/shared/global-search.component';
import { AiAssistantComponent } from './components/ai-assistant/ai-assistant.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FormsModule, ConfirmationModalComponent, NotificationsComponent, GlobalSearchComponent, AiAssistantComponent, NgOptimizedImage],
})
export class AppComponent implements OnInit, OnDestroy {
  private router: Router;
  private activatedRoute: ActivatedRoute;
  public authService: AuthService;

  pageTitle = signal('Dashboard');
  
  // State for collapsible menus
  isHajjMenuOpen = signal(false);
  isUmrahMenuOpen = signal(false);
  isVisitorMenuOpen = signal(false);

  // Timezone clocks
  todayDate = signal('');
  bdTime = signal('');
  ksaTime = signal('');
  private clockInterval: any;

  // AI Assistant state
  isAiAssistantOpen = signal(false);

  constructor(public uiService: UiService, authService: AuthService) {
    this.router = inject(Router);
    this.activatedRoute = inject(ActivatedRoute);
    this.authService = authService;

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.title)
    ).subscribe(title => {
      this.pageTitle.set(title || 'UmrahFlow');
    });

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
        this.isHajjMenuOpen.set(event.url.includes('/hajj'));
        this.isUmrahMenuOpen.set(event.url.includes('/customers') || event.url.includes('/packages') || event.url.includes('/groups'));
        this.isVisitorMenuOpen.set(event.url.includes('/visitors'));
    });
  }
  
  ngOnInit() {
    this.updateClocks();
    this.clockInterval = setInterval(() => this.updateClocks(), 1000);
  }

  ngOnDestroy() {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
  }

  updateClocks() {
    const now = new Date();
    this.todayDate.set(now.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    this.bdTime.set(now.toLocaleString('en-US', { ...timeOptions, timeZone: 'Asia/Dhaka' }));
    this.ksaTime.set(now.toLocaleString('en-US', { ...timeOptions, timeZone: 'Asia/Riyadh' }));
  }

  loginAs(event: Event) {
    const role = (event.target as HTMLSelectElement).value as UserRole;
    this.authService.login(role);
    this.router.navigate(['/dashboard']);
  }

  toggleHajjMenu() {
    this.isHajjMenuOpen.update(v => !v);
  }

  toggleUmrahMenu() {
    this.isUmrahMenuOpen.update(v => !v);
  }
  
  toggleVisitorMenu() {
    this.isVisitorMenuOpen.update(v => !v);
  }
}