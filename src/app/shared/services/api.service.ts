import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'environments/environment';
import { catchError, concatMap, delay, retryWhen } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { isPresent } from '@shared/c-validators/utils';

export const BASE_URL = environment.apiUrl;
export const BASE_API_URL = BASE_URL + '/api/';


@Injectable({
  providedIn: 'root'
})export class ApiService {

  constructor(
    public http: HttpClient,
    public translate: TranslateService,
    public toastr: ToastrService,
  ) {}

  get(prefix: string, params: any = {}, otherOptions: any = {}): Observable<any> {
    const url = BASE_API_URL + prefix;
    const options = otherOptions;
    const filteredParams: any = {};
    for (const key of Object.keys(params)) {
      const value = params[key];
      if (isPresent(value)) {
        filteredParams[key] = value;
      }
    }
    this.initOptions(options);
    options.params = filteredParams;
    return this.http.get(url, options).pipe(
      this.handleRetryError(3000, 5),
      catchError(err => {
        if (!err.status) {
          this.handleConnectionError();
        }
        throw new Error(err);
      }),
    );
  }

  post(prefix: string, body: any = {}, options: any = {}): any {
    const url = BASE_API_URL + prefix;
    this.initOptions(options);
    return this.http.post(url, body, options);
  }

  put(prefix: string, body: any = {}, options: any = {}): any {
    const url = BASE_API_URL + prefix;
    this.initOptions(options);
    return this.http.put(url, body, options);
  }

  delete(prefix: string, params: any = {}, otherOptions: any = {}): any {
    const url = BASE_API_URL + prefix;
    const options = otherOptions;
    this.initOptions(options);
    options.params = params;
    return this.http.delete(url, options);
  }

  initOptions(options: any) {
    options.headers = new HttpHeaders();
    if (!environment.production) {
      const username = 'admin';
      const password = 'htUgctJ4rYUWxt5';
      // username = 'NaZaR.IO';
      // password = 'cpython2428';
      // username = 'CPython.uz';
      // password = 'cpython';
      const token = btoa(`${ username }:${ password }`);
      options.headers = options.headers.set('Authorization', `Basic ${ token }`);
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

  handleConnectionError() {
    if (!this.toastr.currentlyActive) {
      this.toastr.error('', 'Connection Error', {
        timeOut: 5000,
        positionClass: 'toast-bottom-left',
        toastClass: 'toast ngx-toastr',
        closeButton: true,
      });
    }
  }

}
