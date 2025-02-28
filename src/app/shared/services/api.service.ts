import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { isPresent } from '@shared/c-validators/utils';
import { paramsMapper } from '@shared/utils';

export const BASE_URL = environment.apiUrl;
export const BASE_API_URL = BASE_URL + '/api/';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

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
    options.params = paramsMapper(filteredParams);
    if (!environment.production) {
      options.params.django_language = 'uz';
    }
    return this.http.get(url, options);
  }

  post(prefix: string, body: any = {}, options: any = {}): Observable<any> {
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
      const username = environment.superAdmin.username;
      const password = environment.superAdmin.password;
      const token = btoa(`${username}:${password}`);
      options.headers = options.headers.set('Authorization', `Basic ${token}`);
      // options.headers = options.headers.set('Django-Language', this.translate.currentLang);
    }
    options.withCredentials = true;
  }
}
