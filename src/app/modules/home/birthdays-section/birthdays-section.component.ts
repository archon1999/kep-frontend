import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'birthdays-section',
  templateUrl: './birthdays-section.component.html',
  styleUrls: ['./birthdays-section.component.scss']
})
export class BirthdaysSectionComponent implements OnInit {

  public birthDays: Array<any> = [];
  public skeletonVisible = true;

  constructor(
    public service: HomeService,
  ) {}

  ngOnInit(): void {
    this.service.getNextBirthdays().subscribe(
      (result: any) => {
        this.birthDays = result;
        this.skeletonVisible = false;
      }
    );
  }

}
