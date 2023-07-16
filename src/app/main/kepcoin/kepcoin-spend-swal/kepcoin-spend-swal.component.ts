import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'app/api.service';
import { AuthenticationService } from 'app/auth/service';
import Swal from 'sweetalert2';

@Component({
  selector: 'kepcoin-spend-swal',
  templateUrl: './kepcoin-spend-swal.component.html',
  styleUrls: ['./kepcoin-spend-swal.component.scss']
})
export class KepcoinSpendSwalComponent implements OnInit {

  @Input() value: number;
  @Input() purchaseUrl: string;
  @Input() customContent: boolean = false;
  @Input() customClass: string = 'mt-2';
  @Output() success = new EventEmitter<void>();

  constructor(
    public api: ApiService,
    public authService: AuthenticationService,
    public translateService: TranslateService,
  ) { }

  ngOnInit(): void {
  }

  ConfirmTextOpen() {
    let translations = this.translateService.translations[this.translateService.currentLang];
    let api = this.api;
    let purchaseUrl = this.purchaseUrl;
    let success = this.success;
    if(this.authService.currentUserValue.kepcoin < this.value){
      Swal.fire({
        icon: 'error',
        title: translations['NotEnoughKepcoin'],
        html: `<img height="25" src="assets/images/icons/kepcoin.png"> ${this.value}`,
        customClass: {
          confirmButton: 'btn btn-success'
        }
      });
      return;
    }
  
    Swal.fire({
      title: translations['WantToBuy'],
      html: `<img height="25" src="assets/images/icons/kepcoin.png"> ${this.value}`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      cancelButtonColor: '#E42728',
      cancelButtonText: translations['Cancel'],
      confirmButtonText: translations['Purchase'],
      customClass: {
        confirmButton: 'btn btn-relief-primary',
        cancelButton: 'btn btn-relief-danger ml-1'
      }
    }).then(function (result) {
      if(result.value){
        api.post(purchaseUrl).subscribe((result: any) => {
          if(result?.success){
            Swal.fire({
              icon: 'success',
              title: translations['Successfully'] + '!',
              customClass: {
                confirmButton: 'btn btn-success'
              }
            }).then((result) => {
              success.emit();
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
        })          
      }
    });
  }
}
