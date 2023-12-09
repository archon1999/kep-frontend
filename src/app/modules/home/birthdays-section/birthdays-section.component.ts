import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home.service';
import { CommonModule } from '@angular/common';
import { SwiperComponent } from '@shared/third-part-modules/swiper/swiper.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'birthdays-section',
  templateUrl: './birthdays-section.component.html',
  styleUrls: ['./birthdays-section.component.scss'],
  standalone: true,
  imports: [CommonModule, SwiperComponent, NgxSkeletonLoaderModule, UserPopoverModule, TranslateModule]
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
