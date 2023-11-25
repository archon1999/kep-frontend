import { Component, OnInit } from '@angular/core';
import { ChallengesRating } from '../../models/challenges.models';
import { ChallengesService } from '../../services/challenges.service';
import { PageResult } from '../../../../shared/page-result';
import { ContentHeader } from '../../../../layout/components/content-header/content-header.component';

@Component({
  selector: 'app-challenges-rating',
  templateUrl: './challenges-rating.component.html',
  styleUrls: ['./challenges-rating.component.scss']
})
export class ChallengesRatingComponent implements OnInit {

  public contentHeader: ContentHeader = {
    headerTitle: 'Rating',
    actionButton: true,
    breadcrumb: {
      type: '',
      links: [
        {
          name: 'Challenges',
          isLink: true,
          link: '..'
        },
      ]
    }
  };

  public challengesRating: Array<ChallengesRating> = [];
  public currentPage = 1;
  public pageSize = 10;
  public total = 0;

  constructor(public service: ChallengesService) {}

  ngOnInit() {
    this.updateChallengesRating();
  }

  updateChallengesRating() {
    this.service.getChallengesRating(this.currentPage, this.pageSize).subscribe(
      (result: PageResult) => {
        this.challengesRating = result.data;
        this.total = result.total;
      }
    );
  }

}
