import { ChangeDetectorRef, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { bounceAnimation } from 'angular-animations';
import { AuthService, AuthUser } from '@auth';

import { WebsocketService } from 'app/shared/services/websocket';
import { Subject } from 'rxjs';
import { PageResult } from '@core/common/classes/page-result';
import { CoreCommonModule } from '@core/common.module';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { NotificationsService } from "@core/layouts/components/header/notifications/notifications.service";
import { SimplebarAngularModule } from "simplebar-angular";
import { Resources } from '@app/resources';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';
import { ResourceByUsernamePipe } from '@shared/pipes/resource-by-username.pipe';
import { TranslateService } from '@ngx-translate/core';

export enum NotificationType {
  System = 1,
  ContestRatingChanges = 2,
  KepcoinEarn = 3,
  ChallengeCallAccept = 4,
  ChallengeFinished = 5,
  ArenaFinished = 6,
  DuelStarts = 7,
  NewAchievement = 8,
}

interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  createdNaturaltime: string;
  created: string;
  content: any;
}

@Component({
  selector: 'header-notifications',
  templateUrl: './header-notifications.component.html',
  animations: [
    bounceAnimation({delay: 100, duration: 1000}),
  ],
  standalone: true,
  imports: [
    CoreCommonModule,
    KepPaginationComponent,
    SpinnerComponent,
    KepIconComponent,
    NgbDropdownModule,
    SimplebarAngularModule,
    ResourceByIdPipe,
    ResourceByUsernamePipe,
  ]
})
export class HeaderNotificationsComponent implements OnInit, OnDestroy {
  public notifications: Array<Notification> = [];
  public pageNumber = 1;
  public total: number;
  public pagesCount = 0;

  public currentUser: AuthUser;
  public isAll = false;
  public isLoading = true;

  protected cdr = inject(ChangeDetectorRef);

  @ViewChild('notificationAudio') notificationAudio?: ElementRef<HTMLAudioElement>;

  private readonly destroy$ = new Subject<void>();
  private initTimeoutId: ReturnType<typeof setTimeout> | null = null;
  protected readonly Resources = Resources;
  protected readonly NotificationType = NotificationType;

  constructor(
    public notificationsService: NotificationsService,
    public wsService: WebsocketService,
    public authService: AuthService,
    private translateService: TranslateService,
  ) {
  }

  ngOnInit(): void {
    this.updateNotifications();
    this.initTimeoutId = setTimeout(() => this.init(), 2000);
  }

  private init(): void {
    this.authService.currentUser.pipe(takeUntil(this.destroy$)).subscribe(
      (user: AuthUser) => {
        if (user) {
          this.wsService.send('notification-add', user.username);
          this.wsService.on(`notification-${user.username}`).pipe(takeUntil(this.destroy$)).subscribe(
            (notification: Notification) => this.handleIncomingNotification(notification),
          );
        } else if (this.currentUser?.username) {
          this.wsService.send('notification-delete', this.currentUser.username);
        }
        this.currentUser = user;
      }
    );
  }

  private handleIncomingNotification(notification: Notification): void {
    if (this.notifications.find(n => n.id === notification.id)) {
      return;
    }

    if (notification.type === NotificationType.System) {
      Swal.fire({
        title: this.translateService.instant('NotificationInformationTitle'),
        html: notification.message,
        icon: 'info',
      });
    }

    this.notifications = [notification, ...this.notifications];
    this.notificationAudio?.nativeElement?.play();
  }

  updateNotifications(): void {
    this.isLoading = true;
    this.notificationsService.getNotifications(this.pageNumber, this.isAll).subscribe(
      (result: PageResult<Notification>) => {
        this.notifications = result.data;
        this.pageNumber = result.page;
        this.total = result.total;
        this.pagesCount = result.pagesCount;
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    );
  }

  notificationClick(notification: Notification): void {
    if (!this.isAll) {
      this.notificationsService.readNotification(notification.id).subscribe(
        (result: any) => {
          if (result.success) {
            this.notifications = this.notifications.filter((value: Notification) => value.id !== notification.id);
          }
        }
      );
    }
  }

  readAll(): void {
    this.notificationsService.readAllNotification().subscribe(
      (result: any) => {
        if (result.success) {
          this.notifications = [];
        }
      }
    );
  }

  click(): void {
    this.isAll = !this.isAll;
    this.notifications = [];
    this.updateNotifications();
  }

  ngOnDestroy(): void {
    if (this.initTimeoutId) {
      clearTimeout(this.initTimeoutId);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
