import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/auth/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavbarService } from '../navbar.service';
import { User } from '@auth/models';

interface DailyTask {
  type: number;
  kepcoin: number;
  progress: number;
  total: number;
  completed: boolean;
  description: string;
}

@Component({
  selector: 'app-navbar-daily-tasks',
  templateUrl: './navbar-daily-tasks.component.html',
  styleUrls: ['./navbar-daily-tasks.component.scss']
})
export class NavbarDailyTasksComponent implements OnInit, OnDestroy {

  public streak = 0;
  public maxStreak = 0;
  public dailyTasks: Array<DailyTask> = [];
  public completed = 0;
  public progress = 0;

  private _unsubscribeAll = new Subject();

  constructor(
    public service: NavbarService,
    public authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: User) => {
        if (user) {
          this.loadData();
        }
      }
    );
  }

  loadData() {
    this.completed = 0;
    this.service.getDailyTasks().subscribe((result: any) => {
      this.streak = result.streak;
      this.maxStreak = result.maxStreak;
      this.dailyTasks = result.dailyTasks;
      for (const dailyTask of this.dailyTasks) {
        if (dailyTask.completed) {
          this.completed++;
        }
      }
      this.progress = Math.trunc(100 * this.completed / this.dailyTasks.length);
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
