import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Arena } from '@arena/arena.models';
import { BaseTablePageComponent } from '@app/common/classes/base-table-page.component';
import { Observable } from 'rxjs';
import { PageResult } from '@app/common/classes/page-result';
import { Challenge } from '@challenges/models/challenges';
import { ChallengesApiService } from '@challenges/services';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { ChallengesUserViewComponent } from '@challenges/components/challenges-user-view/challenges-user-view.component';

@Component({
  selector: 'arena-challenges',
  standalone: true,
  imports: [CommonModule, ChallengesUserViewComponent, KepPaginationComponent],
  templateUrl: './arena-challenges.component.html',
  styleUrl: './arena-challenges.component.scss'
})
export class ArenaChallengesComponent extends BaseTablePageComponent<Challenge> implements OnInit {
  override pageSize = 10;
  override maxSize = 5;
  override defaultPageNumber = 1;
  override pageQueryParam = 'challengesPage';

  public arena: Arena;

  constructor(public service: ChallengesApiService) {
    super();
  }

  get arenaChallenges(): Challenge[] {
    return this.pageResult?.data;
  }

  ngOnInit() {
    this.route.data.subscribe(
      ({ arena }) => {
        this.arena = arena;
        setTimeout(() => this.reloadPage());
      }
    );
  }

  getPage(): Observable<PageResult<Challenge>> {
    return this.service.getChallenges({
      ...this.pageable,
      arenaId: this.arena.id,
    });
  }
}
