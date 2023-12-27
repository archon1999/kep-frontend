import { Component, OnInit } from '@angular/core';
import { randomInt } from '@shared/utils';
import { ToastrService } from 'ngx-toastr';

let magicIntervalId: any = -1;
const _clearInterval = window.clearInterval;
const _clearTimeout = window.clearTimeout;

@Component({
  selector: 'problem1843',
  templateUrl: './problem1843.component.html',
  styleUrls: ['./problem1843.component.scss'],
  standalone: true,
})
export class Problem1843Component implements OnInit {

  public magicNumber = 0;

  constructor(public toastr: ToastrService) {}

  ngOnInit(): void {
    window.clearTimeout = (id) => {
      _clearTimeout(id);
      if (id === magicIntervalId) {
        console.log('Answer: 1131');
      }
    };

    window.clearInterval = (id) => {
      _clearInterval(id);
      if (id === magicIntervalId) {
        console.log('Answer: 1131');
      }
    };

    for (let i = 1; i <= 100; i++) {
      setInterval(() => {
      }, 10000);
    }

    magicIntervalId = setInterval(() => {
      this.magicNumber = randomInt(1, 9);
    }, 100);
  }

}
