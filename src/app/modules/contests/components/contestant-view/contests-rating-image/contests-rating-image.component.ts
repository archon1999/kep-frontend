import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'contests-rating-image',
  templateUrl: './contests-rating-image.component.html',
  styleUrls: ['./contests-rating-image.component.scss'],
  standalone: false,
})
export class ContestsRatingImageComponent implements OnInit {

  @Input() title: string;
  @Input() size = 32;
  @Input() class: string;

  constructor() { }

  ngOnInit(): void {
  }

}
