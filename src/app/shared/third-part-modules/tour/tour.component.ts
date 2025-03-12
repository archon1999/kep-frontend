import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'tour-css',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class TourComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
