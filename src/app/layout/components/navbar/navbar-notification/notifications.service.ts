import { Injectable } from '@angular/core';
import { ApiService } from 'app/api.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(public api: ApiService) {}

  getNotifications(pageNumber: number){
    return this.api.get('notifications', { page: pageNumber });
  }

  readNotification(notificationId: number){
    return this.api.post(`notifications/${notificationId}/read/`);
  }

  readAllNotification(){
    return this.api.post(`notifications/read-all/`);
  }

}
