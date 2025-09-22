import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BaseComponent } from "@core/common";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Resources } from "@app/resources";
import { TranslatePipe } from "@ngx-translate/core";
import { CoreCommonModule } from "@core/common.module";
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { LogoComponent } from "@shared/components/logo/logo.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, TranslatePipe, CoreCommonModule, KepCardComponent, LogoComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit {
  public loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = '';
  public passwordTextType: boolean;

  constructor() {
    super();
    const queryReturnUrl = this.route.snapshot.queryParams['returnUrl'];
    const initialReturnUrl = queryReturnUrl ?? this.getLastUrl();
    this.returnUrl = this.normalizeReturnUrl(initialReturnUrl);
  }

  ngOnInit(): void {
    const queryReturnUrl = this.route.snapshot.queryParams['returnUrl'];
    if (queryReturnUrl) {
      this.returnUrl = this.normalizeReturnUrl(queryReturnUrl);
    }
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  public getSocialLoginUrl(provider: 'google-oauth2' | 'github'): string {
    const normalizedProvider = provider.endsWith('/') ? provider : `${provider}/`;
    const nextRoute = encodeURIComponent(this.returnUrl);
    return `/login/${normalizedProvider}?next=${nextRoute}`;
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(
      {
        next: (user) => {
          this.loading = false;
          const message = `👋 ${this.translateService.instant('Welcome')}, ` + user.firstName || user.username + '!';
          this.toastr.success(this.translateService.instant('LoginSuccessText'), message);
          this.authService.getMe().subscribe(
            () => {
              this.router.navigate([Resources.Home]);
            }
          );
        },
        error: (err) => {
          this.loading = false;
          this.toastr.error('Error', this.translateService.instant('LoginErrorText'));
        }
      }
    );
  }

  private normalizeReturnUrl(url?: string): string {
    const fallbackUrl = Resources.Home;
    if (!url) {
      return fallbackUrl;
    }

    let sanitizedUrl = url.trim();
    if (!sanitizedUrl) {
      return fallbackUrl;
    }

    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
      const parsedUrl = new URL(sanitizedUrl, baseUrl);
      sanitizedUrl = `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
    } catch (e) {
      sanitizedUrl = sanitizedUrl.startsWith('/') ? sanitizedUrl : `/${sanitizedUrl}`;
    }

    if (sanitizedUrl.startsWith(Resources.Login)) {
      return fallbackUrl;
    }

    return sanitizedUrl;
  }
}
