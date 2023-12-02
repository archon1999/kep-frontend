import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChallengesUserViewModule } from '@challenges/components/challenges-user-view/challenges-user-view.module';
import { Arena } from '@arena/arena.models';
import { BaseTablePageComponent } from '@shared/components/classes/base-table-page.component';
import { Observable } from 'rxjs';
import { PageResult } from '@shared/components/classes/page-result';
import { ArenaService } from '@arena/arena.service';
import { Challenge } from '@challenges/models/challenges.models';
import { ChallengesService } from '@challenges/services';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';

@Component({
  selector: 'arena-challenges',
  standalone: true,
  imports: [CommonModule, ChallengesUserViewModule, KepPaginationComponent],
  templateUrl: './arena-challenges.component.html',
  styleUrl: './arena-challenges.component.scss'
})
export class ArenaChallengesComponent extends BaseTablePageComponent<Challenge> implements OnInit {
  override pageSize = 10;
  override maxSize = 5;
  override defaultPageNumber = 1;
  override pageQueryParam = 'challengesPage';

  public arena: Arena;

  constructor(public service: ChallengesService) {
    super();
  }

  get arenaChallenges(): Challenge[] {
    return this.pageResult?.data;
  }

  ngOnInit() {
    this.route.data.subscribe(
      ({ arena }) => {
        this.arena = arena;
        this.reloadPage();
      }
    );
  }

  getPage(): Observable<PageResult<Challenge>> {
    return this.service.getChallenges(this.pageNumber, null, this.pageSize, {
      arena_id: this.arena.id
    });
  }

}
