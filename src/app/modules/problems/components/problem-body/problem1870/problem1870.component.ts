import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

const DEFAULT_OUTPUT = `1 240 75 30 0
1 240 75 280 0
1 50 75 30 80
1 50 75 250 80
1 230 75 40 160
1 240 75 280 160
2 270 75 30 0
2 70 75 60 80
2 80 75 100 160
2 70 155 190 80
2 210 75 310 0
2 100 75 310 80
2 120 75 400 160
3 90 55 60 0
3 100 55 90 60
3 400 55 120 120
3 220 55 140 180
4 80 115 180 0
4 40 115 220 120
4 10 43 275 96
4 80 43 290 96
4 15 91 345 144
4 25 43 278 144
4 60 43 280 192
4 250 43 270 0
4 125 43 270 48
5 270 55 30 0
5 30 55 30 60
5 60 55 90 60
5 85 55 35 120
5 70 55 50 180
5 30 175 160 60`;

@Component({
  selector: 'problem1870',
  templateUrl: './problem1870.component.html',
  styleUrls: ['./problem1870.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class Problem1870Component implements OnInit {

  public blocks = [];
  public output = new FormControl();

  constructor() {}

  ngOnInit(): void {
    this.output.valueChanges.pipe(debounceTime(2000)).subscribe(
      (output: string) => {
        this.updateBlocks();
      }
    );

    this.output.patchValue(DEFAULT_OUTPUT);
  }

  updateBlocks() {
    this.blocks = [];
    const output = this.output.value;
    const blocks = [];
    for (const line of output.split('\n')) {
      const [day, height, width, top, left] = line.split(' ');
      blocks.push({ day: +day, height, width, top, left });
    }
    for (let day = 1; day <= 7; day++) {
      this.blocks.push(blocks.filter(event => event.day === day));
    }
  }
}
