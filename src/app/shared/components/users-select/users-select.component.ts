import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../api.service';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'users-select',
  templateUrl: './users-select.component.html',
  styleUrls: ['./users-select.component.scss']
})
export class UsersSelectComponent implements OnInit {

  public users$: Observable<any>;
  public selectedUser: string = "";
  public userInput$ = new Subject<string>();
  public userLoading = false;

  constructor(
    public api: ApiService,
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }
  
  private loadUsers(){
    this.users$ = concat(
      of([]),
      this.userInput$.pipe(
          distinctUntilChanged(),
          tap(() => this.userLoading = true),
          switchMap(term => this.api.get('users/search', {q: term}).pipe(
              catchError(() => of([])),
              tap(() => this.userLoading = false)
          )),
          debounceTime(1000),
      )
    );
  }
}
