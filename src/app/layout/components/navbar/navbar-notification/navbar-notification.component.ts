import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { bounceAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';

import { NotificationsService } from 'app/layout/components/navbar/navbar-notification/notifications.service';
import { WebsocketService } from 'app/shared/services/websocket';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Notification {
  id: number;
  type: number;
  message: string;
  createdNaturaltime: string;
  created: string;
  content: any;
};

@Component({
  selector: 'app-navbar-notification',
  templateUrl: './navbar-notification.component.html',
  animations: [
    bounceAnimation({ delay: 100, duration: 1000 }),
    fadeOutOnLeaveAnimation(),
  ],
})
export class NavbarNotificationComponent implements OnInit, OnDestroy {

  public animationState = false;

  public notifications: Array<Notification> = [];

  public currentUser: User;

  @ViewChild('notificationAudio') notificationAudio: any;

  private _intervalId: any;
  private _unsubscribeAll = new Subject();

  constructor(
    public notificationsService: NotificationsService,
    public wsService: WebsocketService,
    public authService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this._intervalId = setInterval(() => {
      this.animationState = !this.animationState;
    }, 10000);

    this.notificationsService.getNotifications(1).subscribe(
      (result: any) => {
        this.notifications = result;
        setTimeout(() => this.animationState=true, 500);
      }
    );

    this.wsService.status.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (status: boolean) => {
        this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
          (user: User) => {
            if(user){
              this.wsService.send('notification-add', user.username);
              this.wsService.on(`notification-${user.username}`).subscribe(
                (notification: Notification) => {
                  let notifications = this.notifications.reverse();
                  notifications.push(notification);
                  this.notifications = notifications.reverse();
                  this.notificationAudio.nativeElement.play();
                }
              )
            } else {
              this.wsService.send('notification-delete', this.currentUser.username);
            }
            this.currentUser = user;
          }
        )
      }
    )
  }

  notificationClick(notification: Notification){
    this.notificationsService.readNotification(notification.id).subscribe(
      (result: any) => {
        if(result.success){
          let index = this.notifications.findIndex((value: Notification) => value.id == notification.id);
          if(index != -1){
            this.notifications.splice(index, 1);
          }
        }
      }
    )
  }

  readAll(){
    this.notificationsService.readAllNotification().subscribe(
      (result: any) => {
        if(result.success){
          this.notifications.splice(0, this.notifications.length);
        }
      }
    )
  }

  ngOnDestroy(): void {
    if(this._intervalId){
      clearInterval(this._intervalId)
    }
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
