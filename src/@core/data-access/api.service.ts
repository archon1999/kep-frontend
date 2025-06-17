import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpErrorResponse, HttpHeaders, } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, retry, throwError, timeout } from 'rxjs';
import { environment } from 'environments/environment';
import { isPresent } from '@shared/c-validators/utils';
import { paramsMapper } from '@shared/utils';
import { API_BASE_URL } from "@core/tokens";

export interface RequestOptions {
  params?: Record<string, any>;
  headers?: HttpHeaders;
  context?: HttpContext;
  withCredentials?: boolean;
}

@Injectable({providedIn: 'root'})
export class ApiService {
  private readonly defaultTimeout = 10_000; // ms
  private readonly defaultRetryCount = 1;

  constructor(
    private http: HttpClient,
    private translateService: TranslateService,
    private toastr: ToastrService,
    @Inject(API_BASE_URL) private baseUrl: string
  ) {
  }

  get<T = any>(path: string, params?: Record<string, any>, options: RequestOptions = {}): Observable<T> {
    const url = this.buildUrl(path);
    const opts = this.prepareOptions({
      ...options,
      params: params,
    });
    return this.http
      .get<T>(url, opts)
      .pipe(this.defaultPipe<T>());
  }

  post<T = any, B = any>(
    path: string,
    body?: B,
    options: RequestOptions = {}
  ): Observable<T> {
    const url = this.buildUrl(path);
    const opts = this.prepareOptions(options);
    return this.http
      .post<T>(url, body, opts)
      .pipe(this.defaultPipe<T>());
  }

  put<T = any, B = any>(
    path: string,
    body: B,
    options: RequestOptions = {}
  ): Observable<T> {
    const url = this.buildUrl(path);
    const opts = this.prepareOptions(options);
    return this.http
      .put<T>(url, body, opts)
      .pipe(this.defaultPipe<T>());
  }

  delete<T>(
    path: string,
    options: RequestOptions = {}
  ): Observable<T> {
    const url = this.buildUrl(path);
    const opts = this.prepareOptions(options);
    return this.http
      .delete<T>(url, opts)
      .pipe(this.defaultPipe<T>());
  }

  private buildUrl(path: string): string {
    const trimmed = path.startsWith('/') ? path.slice(1) : path;
    return `${this.baseUrl}${trimmed}`;
  }

  private prepareOptions(options: RequestOptions): RequestOptions {
    const paramsObj: any = options.params
      ? paramsMapper(this.filterParams(options.params))
      : {};

    let headers = options.headers ?? new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    if (!environment.production) {
      const {username, password} = environment.superAdmin;
      const token = btoa(`${username}:${password}`);
      // headers = headers.set('Authorization', `Basic ${token}`);
      paramsObj.django_language = this.translateService.currentLang || 'uz';
    }

    return {
      ...options,
      params: paramsObj,
      headers,
      withCredentials: true,
    };
  }

  private filterParams(
    params: Record<string, any>
  ): Record<string, any> {
    return Object.fromEntries(
      Object.entries(params).filter(([, v]) => isPresent(v))
    );
  }

  private defaultPipe<T>() {
    return (src: Observable<T>) =>
      src.pipe(
        retry(this.defaultRetryCount),
        timeout(this.defaultTimeout),
        catchError(err => this.handleError(err))
      );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    const msg =
      err.error?.message ||
      `Server error: ${err.status} ${err.statusText}`;
    // this.toastr.error(msg, 'Ошибка');
    return throwError(() => err);
  }
}
