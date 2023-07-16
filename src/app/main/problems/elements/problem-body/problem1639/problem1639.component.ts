import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'problem1639',
  templateUrl: './problem1639.component.html',
  styleUrls: ['./problem1639.component.scss']
})
export class Problem1639Component implements OnInit {

  constructor(
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
  }
  
  finish(){
    this.toastr.success('Oltinni tagi sabr!');
  }

}
