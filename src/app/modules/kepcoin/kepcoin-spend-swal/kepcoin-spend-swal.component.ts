import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'app/shared/services/api.service';
import { AuthService } from 'app/auth/service';
import Swal from 'sweetalert2';

@Component({
  selector: 'kepcoin-spend-swal',
  templateUrl: './kepcoin-spend-swal.component.html',
  styleUrls: ['./kepcoin-spend-swal.component.scss']
})
export class KepcoinSpendSwalComponent {

  @Input() value: number;
  @Input() purchaseUrl: string;
  @Input() customContent = false;
  @Input() customClass = 'mt-2';
  @Input() requestBody = {};
  @Output() success = new EventEmitter<any>();

  constructor(
    public api: ApiService,
    public authService: AuthService,
    public translateService: TranslateService,
  ) {}

  ConfirmTextOpen() {
    const translations = this.translateService.translations[this.translateService.currentLang];
    if (this.authService.currentUserValue.kepcoin < this.value) {
      Swal.fire({
        icon: 'error',
        title: translations['NotEnoughKepcoin'],
        html: `<img height="25" src="assets/images/icons/kepcoin.webp"> ${ this.value }`,
        customClass: {
          confirmButton: 'btn btn-success'
        }
      });
    } else {
      Swal.fire({
        title: translations['WantToBuy'],
        html: `<img height="25" src="assets/images/icons/kepcoin.webp"> ${ this.value }`,
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'var(--primary)',
        cancelButtonColor: 'var(--danger)',
        cancelButtonText: translations['Cancel'],
        confirmButtonText: translations['Purchase'],
        customClass: {
          confirmButton: 'btn btn-relief-primary',
          cancelButton: 'btn btn-relief-danger ml-1'
        }
      }).then((result) => {
        if (result.value) {
          this.api.post(this.purchaseUrl, this.requestBody).subscribe((result: any) => {
            if (result?.success) {
              Swal.fire({
                icon: 'success',
                title: translations['Successfully'] + '!',
                customClass: {
                  confirmButton: 'btn btn-success'
                }
              }).then(() => {
                this.success.emit(result);
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: translations['Error'] + '!',
                customClass: {
                  confirmButton: 'btn btn-success'
                }
              });
            }
          }, () => {
            Swal.fire({
              icon: 'error',
              title: translations['ServerError'] + '!',
              customClass: {
                confirmButton: 'btn btn-success'
              }
            });
          });
        }
      });
    }
  }
}
