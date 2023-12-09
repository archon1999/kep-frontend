import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { User } from 'app/auth/models';
import { ApiService } from 'app/shared/services/api.service';
import { WebsocketService } from 'app/shared/services/websocket';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  public currentUser: Observable<User>;

  private currentUserSubject: BehaviorSubject<User>;

  constructor(
    private api: ApiService,
    private _http: HttpClient,
    public wsService: WebsocketService,
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(null);
    this.currentUser = this.currentUserSubject.asObservable();
    this.updateMe();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  get isAdmin() {
    return this.currentUser && this.currentUserSubject.value.isSuperuser;
  }

  get isAuthenticated() {
    return this.currentUser;
  }

  get me() {
    return this.api.get('me');
  }

  login(username: string, password: string) {
    const token = btoa(`${ username }:${ password }`);
    const headers = { 'Authorization': `Basic ${ token }` };
    return this._http
      .post<any>(`${ environment.apiUrl }/api/login/`, {}, { headers: headers })
      .pipe(
        map(user => {
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  updateMe() {
    this.me.subscribe(
      (user: User) => {
        this.currentUserSubject.next(user);
      },
      (error: any) => {
        this.currentUserSubject.next(null);
      }
    );
  }

  updateKepcoin(kepcoin: number) {
    if (this.currentUserValue) {
      this.currentUserValue.kepcoin = kepcoin;
    }
  }

  checkDailyActivity() {
    if (this.currentUserValue) {
      this.api.get('users/check-daily-activity').subscribe((result: any) => {
      });
    }
  }

  logout() {
    this.wsService.send('kepcoin-delete', this.currentUserValue?.username);
    this.api.post('logout').subscribe(() => {
      this.currentUserSubject.next(null);
    });
  }

}
