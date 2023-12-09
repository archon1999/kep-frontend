import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface SwipeEvent {
  pageX: number;
  pageY: number;
  deltaX: number;
  deltaY: number;
  deltaTime: number;
}

@Injectable({
  providedIn: 'root',
})
export class SwipeService {
  swipeLeft = new Subject<SwipeEvent>();
  swipeRight = new Subject<SwipeEvent>();
  swipeUp = new Subject<SwipeEvent>();
  swipeDown = new Subject<SwipeEvent>();

  get swipeLeft$() {
    return this.swipeLeft.asObservable();
  }

  get swipeRight$() {
    return this.swipeRight.asObservable();
  }

  get swipeUp$() {
    return this.swipeUp.asObservable();
  }

  get swipeDown$() {
    return this.swipeDown.asObservable();
  }

}
