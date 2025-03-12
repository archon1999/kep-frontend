import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'kepcoin-view',
  templateUrl: './kepcoin-view.component.html',
  styleUrls: ['./kepcoin-view.component.scss'],
  standalone: false,
})
export class KepcoinViewComponent implements OnInit {

  @Input() value: number;
  @Input() imgSize = 19;
  @Input() customClass = 'ms-1 me-1 text-black';
  @Input() fontSize = 14;

  constructor() { }

  ngOnInit(): void {
  }

}
