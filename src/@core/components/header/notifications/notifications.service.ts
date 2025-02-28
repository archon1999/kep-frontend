import { Injectable } from '@angular/core';
import { ApiService } from 'app/shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(public api: ApiService) {}

  getNotifications(pageNumber: number, isAll = false) {
    if (isAll) { return this.getNotificationsAll(pageNumber); }
    return this.api.get('notifications', {page: pageNumber, pageSize: 4});
  }

  getNotificationsAll(pageNumber: number) {
    return this.api.get('notifications-all', {page: pageNumber, pageSize: 4});
  }


  readNotification(notificationId: number) {
    return this.api.post(`notifications/${notificationId}/read/`);
  }

  readAllNotification() {
    return this.api.post(`notifications/read-all/`);
  }

}
