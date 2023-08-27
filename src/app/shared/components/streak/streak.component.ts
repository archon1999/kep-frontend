import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'streak',
  templateUrl: './streak.component.html',
  styleUrls: ['./streak.component.scss']
})
export class StreakComponent implements OnInit {

  @Input() streak: number;

  constructor() { }

  ngOnInit(): void {
  }

}
