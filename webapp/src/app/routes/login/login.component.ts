import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService, LoadingService } from '@/core/services';

@Component({
  selector: 'page-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {
  authSub = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    public loadingService: LoadingService,
  ) {
    this.authSub = this.authService.onlineChanges.subscribe(isOnline => this.online(isOnline));
    if (this.authService.isInit) {
      this.online(this.authService.isOnline);
    }
  }

  private online(isOnline: boolean): void {
    if (isOnline) {
      this.router.navigate(['/']);
    } else {
      this.loadingService.isLoading = false;
    }
  }

  logInWithGoogle(): void {
    this.authService.logInWithGoogle().subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
