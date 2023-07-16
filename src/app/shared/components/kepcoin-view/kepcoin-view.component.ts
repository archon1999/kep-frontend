import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'kepcoin-view',
  templateUrl: './kepcoin-view.component.html',
  styleUrls: ['./kepcoin-view.component.scss']
})
export class KepcoinViewComponent implements OnInit {

  @Input() value: number;
  @Input() imgSize = 19;
  @Input() customClass = 'ml-1 mr-1 text-black';
  @Input() fontSize = 14;

  constructor() { }

  ngOnInit(): void {
  }

}