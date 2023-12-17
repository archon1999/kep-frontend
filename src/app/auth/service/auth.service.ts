import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { User } from 'app/auth/models';
import { ApiService } from 'app/shared/services/api.service';
import { WebsocketService } from 'app/shared/services/websocket';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(
    private api: ApiService,
    private _http: HttpClient,
    public wsService: WebsocketService,
  ) {}

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  getMe() {
    return this.api.get('me').pipe(
      tap((user: User) => {
        if (user) {
          this.currentUserSubject.next(user);
        } else {
          this.currentUserSubject.next(null);
        }
      })
    );
  }

  login(username: string, password: string) {
    const token = btoa(`${ username }:${ password }`);
    const headers = { 'Authorization': `Basic ${ token }` };
    return this._http
      .post<any>(`${ environment.apiUrl }/api/login/`, {}, { headers: headers })
      .pipe(tap(user => this.currentUserSubject.next(user)));
  }

  updateKepcoin(kepcoin: number) {
    if (this.currentUserValue) {
      this.currentUserValue.kepcoin = kepcoin;
    }
  }

  logout() {
    this.wsService.send('kepcoin-delete', this.currentUserValue?.username);
    this.api.post('logout').subscribe(() => {
      this.currentUserSubject.next(null);
    });
  }

}
