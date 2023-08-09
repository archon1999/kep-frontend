import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'environments/environment';
import { catchError, concatMap, delay, retryWhen } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  BASE_URL = environment.apiUrl;
  BASE_API_URL = this.BASE_URL + '/api/';

  constructor(
    public http: HttpClient,
    public translate: TranslateService,
    public toastr: ToastrService,
  ) {}

  get(prefix: string, params: any = {}, otherOptions: any = {}) {
    let url = this.BASE_API_URL + prefix;
    let options = otherOptions;
    this.initOptions(options);
    options.params = params;
    return this.http.get(url, options).pipe(
      this.handleRetryError(2000, 2),
      catchError(err => {
        if(!err.status){
          this.handleConnectionError();
        }
        throw new Error(err);
      }),
    );
  }

  post(prefix: string, body: any = {}, options: any = {}) {
    let url = this.BASE_API_URL + prefix;
    this.initOptions(options);
    return this.http.post(url, body, options);
  }

  put(prefix: string, body: any = {}, options: any = {}) {
    let url = this.BASE_API_URL + prefix;
    this.initOptions(options);
    return this.http.put(url, body, options);
  }

  delete(prefix: string, params: any = {}, otherOptions: any = {}) {
    let url = this.BASE_API_URL + prefix;
    let options = otherOptions;
    this.initOptions(options);
    options.params = params;
    return this.http.delete(url, options);
  }

  initOptions(options: any){
    /*
    if(localStorage.getItem('currentUser')){
      var currentUser = JSON.parse(localStorage.getItem('currentUser'));
      var token = currentUser.token;
      options.headers = options.headers.set('Authorization', `Token ${token}`)      
      
    }
    options.headers = options.headers.set('Django-Language', lang);
    this.cookies.set('django_language', lang, {secure: false});
    let lang = this.translate.currentLang;
    */
   
    options.headers = new HttpHeaders();
    if(!environment.production){
      let username = 'admin';
      let password = 'htUgctJ4rYUWxt5';
      // username = 'NaZaR.IO';
      // password = 'cpython2428';
      // username = 'CPython.uz';
      // password = 'cpython';
      const token = btoa(`${username}:${password}`);
      options.headers = options.headers.set('Authorization', `Basic ${token}`);
    }
    options.headers = options.headers.set('Content-Type', 'application/json; charset=utf-8');
    options.withCredentials = true;
  }

  handleRetryError(delayTime: number, exceedAttemptLimit: number) {
    let retries = 0;
    return retryWhen((error) => {
      return error.pipe(
        concatMap((err) => {
          if (err.status) {
            throw err;
          }
          return of(err);
        }),
        delay(delayTime),
        concatMap((err) => {
          retries = retries + 1;
          if (!err.status && retries < exceedAttemptLimit) {
            return of(err);
          }
        })
      );
    });
  }

  handleConnectionError(){
    if(!this.toastr.currentlyActive){
      this.toastr.error('', 'Connection Error', { 
        timeOut: 5000,
        positionClass: 'toast-bottom-left',
        toastClass: 'toast ngx-toastr',
        closeButton: true,
      });
    }
  }

}
