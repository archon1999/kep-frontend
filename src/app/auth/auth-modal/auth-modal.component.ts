import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AuthModalComponent implements OnInit {

  public loginForm: FormGroup;
  public username: AbstractControl;
  public password: AbstractControl;

  public loginErrorText: string;
  public loginSuccessText: string;
  public welcomeText: string;

  constructor(
    private modalService: NgbModal,
    public authService: AuthService,
    private formBuilder: FormBuilder,
    public toastr: ToastrService,
    public translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      'username': ['', [Validators.required]],
      'password': ['', [Validators.required]],
    });

    this.username = this.loginForm.controls['username'];
    this.password = this.loginForm.controls['password'];

    this.translateService.get('LoginSuccessText').subscribe(
      (text: string) => {
        this.loginSuccessText = text;
      }
    );

    this.translateService.get('LoginErrorText').subscribe(
      (text: string) => {
        this.loginErrorText = text;
      }
    );

    this.translateService.get('Welcome').subscribe(
      (text: string) => {
        this.welcomeText = text;
      }
    );
  }

  login() {
    this.authService.login(this.username.value, this.password.value).subscribe((user: any) => {
      this.toastr.success(this.loginSuccessText, `👋 ${ this.welcomeText }, ` + user.firstName || user.username + '!', {
        toastClass: 'toast ngx-toastr',
        closeButton: true
      });
      this.modalService.dismissAll(1);
    }, (err: any) => {
      this.toastr.error(this.loginErrorText);
    });
  }

  close() {
    this.modalService.dismissAll();
  }

}
