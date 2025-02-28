import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BaseComponent } from "@app/common";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Resources } from "@app/resources";
import { TranslatePipe } from "@ngx-translate/core";
import { CoreCommonModule } from "@core/common.module";
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, TranslatePipe, CoreCommonModule, KepCardComponent],
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
    this.returnUrl = this.getLastUrl();
  }

  ngOnInit(): void {
    this.returnUrl ||= this.route.snapshot.queryParams['returnUrl'];
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
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
          this.router.navigate([this.returnUrl || Resources.Home]);
          const message = `👋 ${this.translateService.instant('Welcome')}, ` + user.firstName || user.username + '!';
          this.toastr.success(this.translateService.instant('LoginSuccessText'), message);
          this.authService.getMe().subscribe();
        },
        error: (err) => {
          this.loading = false;
          this.toastr.error('Error', this.translateService.instant('LoginErrorText'));
        }
      }
    );
  }
}
