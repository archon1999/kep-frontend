import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'toastr-css',
  templateUrl: './toastr.component.html',
  styleUrls: ['./toastr.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ToastrComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
