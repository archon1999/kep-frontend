import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BaseComponent } from '@app/common/classes/base.component';
import { coreConfig } from '@app/app.config';

@Component({
  selector: 'app-auth-login-v2',
  templateUrl: './auth-login-v2.component.html',
  styleUrls: ['./auth-login-v2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthLoginV2Component extends BaseComponent implements OnInit {
  public loginForm: UntypedFormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = '';
  public passwordTextType: boolean;
  public defaultCoreConfig = coreConfig;

  constructor(
    private _formBuilder: UntypedFormBuilder,
  ) {
    super();
    this.returnUrl = this.getLastUrl();
    this._unsubscribeAll = new Subject();

    // Configure the layout
    this.coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }

  get f() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });

    this.returnUrl ||= this.route.snapshot.queryParams['returnUrl'];

    // Subscribe to config changes
    this.coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.f.username.value, this.f.password.value).subscribe(
      (user: any) => {
        this.loading = false;
        this.router.navigate([this.returnUrl || '/home']);
        const message = `👋 ${this.translateService.instant('Welcome')}, ` + user.firstName || user.username + '!';
        this.toastr.success(this.translateService.instant('LoginSuccessText'), message, {
          toastClass: 'toast ngx-toastr',
          closeButton: true
        });
        this.authService.getMe().subscribe();
      }, (err) => {
        this.loading = false;
        this.toastr.error('', this.translateService.instant('LoginErrorText'), {
          toastClass: 'toast ngx-toastr',
          closeButton: true
        });
      }
    );
  }

}
