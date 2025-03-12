import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'quill-css',
  templateUrl: './quill.component.html',
  styleUrls: ['./quill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class QuillComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
