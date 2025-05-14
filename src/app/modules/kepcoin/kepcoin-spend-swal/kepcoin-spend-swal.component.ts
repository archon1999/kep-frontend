import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '@core/data-access/api.service';
import { AuthService } from '@auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'kepcoin-spend-swal',
  templateUrl: './kepcoin-spend-swal.component.html',
  styleUrls: ['./kepcoin-spend-swal.component.scss'],
  standalone: false,
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
    if (this.authService.currentUserValue.kepcoin < this.value) {
      Swal.fire({
        icon: 'error',
        title: this.translateService.instant('NotEnoughKepcoin'),
        html: `<img height="25" src="assets/images/icons/kepcoin.png"> ${this.value}`,
        customClass: {
          confirmButton: 'btn btn-success'
        }
      });
    } else {
      Swal.fire({
        title: this.translateService.instant('WantToBuy'),
        html: `<img height="25" src="assets/images/icons/kepcoin.png"> ${this.value}`,
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'var(--bs-primary)',
        cancelButtonColor: 'var(--bs-danger)',
        cancelButtonText: this.translateService.instant('Cancel'),
        confirmButtonText: this.translateService.instant('Purchase'),
        customClass: {
          confirmButton: 'btn btn-primary',
        }
      }).then((result) => {
        if (result.value) {
          this.api.post(this.purchaseUrl, this.requestBody).subscribe((result: any) => {
            if (result?.success) {
              Swal.fire({
                icon: 'success',
                title: this.translateService.instant('Successfully') + '!',
                customClass: {
                  confirmButton: 'btn btn-success'
                }
              }).then(() => {
                this.success.emit(result);
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: this.translateService.instant('Error') + '!',
                customClass: {
                  confirmButton: 'btn btn-success'
                }
              });
            }
          }, () => {
            Swal.fire({
              icon: 'error',
              title: this.translateService.instant('ServerError') + '!',
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
