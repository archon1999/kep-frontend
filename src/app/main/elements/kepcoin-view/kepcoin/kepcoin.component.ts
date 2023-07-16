import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'kepcoin',
  templateUrl: './kepcoin.component.html',
  styleUrls: ['./kepcoin.component.scss']
})
export class KepcoinComponent implements OnInit {

  @Input() value: number;
  @Input() imgSize = 19;
  @Input() marginRight = 0.2;

  constructor() { }

  ngOnInit(): void {
  }

}
