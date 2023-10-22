import { Component, OnInit } from '@angular/core';
import { fadeInLeftOnEnterAnimation, fadeInRightOnEnterAnimation, fadeInUpOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'section-info',
  templateUrl: './section-info.component.html',
  styleUrls: ['./section-info.component.scss'],
  animations: [
    fadeInUpOnEnterAnimation(),
    fadeInLeftOnEnterAnimation(),
    fadeInRightOnEnterAnimation(),
  ]
})
export class SectionInfoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
