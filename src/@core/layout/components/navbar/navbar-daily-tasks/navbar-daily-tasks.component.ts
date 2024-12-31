import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService, User } from '@auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavbarService } from '../navbar.service';
import { CoreCommonModule } from '@core/common.module';
import { NgScrollbar } from 'ngx-scrollbar';
import { NgbDropdownModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { KepStreakComponent } from '@shared/components/kep-streak/kep-streak.component';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';

enum DailyTaskType {
  Problem = 1,
  Test,
  Challenge
}

interface DailyTask {
  type: DailyTaskType;
  kepcoin: number;
  progress: number;
  total: number;
  completed: boolean;
  description: string;
}

@Component({
  selector: 'app-navbar-daily-tasks',
  templateUrl: './navbar-daily-tasks.component.html',
  styleUrls: ['./navbar-daily-tasks.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgScrollbar,
    NgbProgressbarModule,
    NgbDropdownModule,
    KepStreakComponent,
    KepIconComponent,
    NgbTooltipModule,
  ],
  encapsulation: ViewEncapsulation.None
})
export class NavbarDailyTasksComponent implements OnInit, OnDestroy {

  public streak = 0;
  public maxStreak = 0;
  public dailyTasks: Array<DailyTask> = [];
  public completed = 0;
  public progress = 0;

  protected readonly DailyTaskType = DailyTaskType;

  private _unsubscribeAll = new Subject();

  constructor(
    public service: NavbarService,
    public authService: AuthService,
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
      this.completed = 0;
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
