import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss']
})
export class SectionHeaderComponent implements OnInit {

  public leftTime: number;

  constructor() { }

  ngOnInit(): void {
    this.leftTime = new Date('2023-05-09').valueOf() - Date.now();
  }

}
