import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef
} from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame';
import { isSameSecond, parseFormat, parseTimeData } from './utils';
import { CommonModule } from '@angular/common';

interface CountdownData {
  remain: number;
  formattedTime: string;
  fragments: any[];
}

export enum CountdownState {
  paused,
  playing,
  finished
}

const instances = [];
const counter$ = interval(0, animationFrame);
let counterSub: Subscription;

function setupCounter() {
  destroyCounter();
  counterSub = counter$.subscribe(() => {
    for (let i = 0; i < instances.length; i++) {
      const inst = instances[i];

      if (inst.state !== CountdownState.playing) {
        continue;
      }

      if (inst.remain <= 0) {
        inst.state = CountdownState.finished;
        inst.cdr.detectChanges();
        inst.finish.emit();
        continue;
      }

      const remain = Math.max(inst.endTime - Date.now(), 0);

      if (!inst.millisecond) {
        if (!isSameSecond(remain, inst.remain) || remain === 0) {
          inst.remain = remain;
          inst.tick.emit(inst.remain);
        }
      } else {
        inst.remain = remain;
        inst.tick.emit(inst.remain);
      }

      inst.cdr.detectChanges();
    }
  });
}

function destroyCounter() {
  // tslint:disable-next-line:no-unused-expression
  counterSub && counterSub.unsubscribe();
}

@Component({
  selector: 'ngx-countdown',
  templateUrl: './countdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class CountdownComponent implements OnInit, OnDestroy {
  @Input() format = 'DD:HH:mm:ss';
  @Input() autoStart = true;
  @Input() millisecond = false;
  @Input() render: TemplateRef<any>;
  @Output() finish = new EventEmitter<any>();
  @Output() tick = new EventEmitter<number>();
  state: CountdownState = CountdownState.paused;
  private remain: number;
  private endTime: number;

  constructor(private cdr: ChangeDetectorRef) {
  }

  get data(): CountdownData {
    const noMillisecond = this.format.indexOf('S') === -1,
      isPlaying = this.state === CountdownState.playing;

    const timeData = parseTimeData(this.remain + (noMillisecond && isPlaying ? 1000 : 0));
    const formattedTime = parseFormat(this.format, timeData);
    return {
      formattedTime,
      remain: this.remain,
      fragments: formattedTime.split(':')
    };
  }

  private _time = 60000;

  get time() {
    return this._time;
  }

  @Input()
  set time(value: number) {
    this._time = Math.max(value, 0);
    this.reset();
  }

  ngOnInit() {
    instances.push(this);
    if (instances.length === 1) {
      setupCounter();
    }
  }

  ngOnDestroy() {
    this.pause();
    const index = instances.indexOf(this);
    if (index !== -1) {
      instances.splice(index, 1);
    }
    if (instances.length === 0) {
      destroyCounter();
    }
  }

  start() {
    if (this.state === CountdownState.playing) {
      return;
    }

    if (this.state === CountdownState.finished) {
      this.remain = this.time;
    }

    this.endTime = Date.now() + this.remain;
    this.state = CountdownState.playing;
  }

  pause() {
    this.state = CountdownState.paused;
  }

  reset() {
    this.pause();
    this.remain = this.time;
    this.cdr.detectChanges();

    if (this.autoStart) {
      this.start();
    }
  }
}
