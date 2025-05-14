import { Component, OnDestroy } from '@angular/core';
import { BaseTablePageComponent } from '@app/common/classes/base-table-page.component';
import { Categories, Category, Problem, StudyPlan } from '@problems/models/problems.models';
import { ContentHeader } from "@shared/ui/components/content-header/content-header.component";
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import {
  SectionProblemsTableComponent
} from '@problems/pages/problems/sections/section-problems-table/section-problems-table.component';
import { ProblemsFilterService } from '@problems/services/problems-filter.service';
import { ProblemsApiService } from '@problems/services/problems-api.service';
import {
  SectionProblemsFilterComponent
} from '@problems/pages/problems/sections/section-problems-filter/section-problems-filter.component';
import { getCategoryIdByCode } from '@problems/utils/category';
import { CoreCommonModule } from '@core/common.module';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { StudyPlanCardModule } from '@problems/components/study-plan-card/study-plan-card.module';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'category',
  standalone: true,
  imports: [CoreCommonModule, ContentHeaderModule, SectionProblemsFilterComponent, SectionProblemsTableComponent, UserPopoverModule, NgbTooltipModule, StudyPlanCardModule, KepCardComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent extends BaseTablePageComponent<Problem> implements OnDestroy {

  public category: Category;
  public defaultOrdering = 'id';
  public topUsers: Array<{
    username: string,
    solved: number;
    rating: number,
    avatar: string,
  }> = [];
  public studyPlans: Array<StudyPlan> = [];

  public isTopUsersLoading = true;
  public isCategoryLoading = true;

  constructor(public filterService: ProblemsFilterService, public apiService: ProblemsApiService) {
    super();
    this.route.params.subscribe(({category}) => {
      const categoryId = getCategoryIdByCode(category);
      if (categoryId) {
        if (categoryId === Categories.BasicProgramming) {
          this.defaultOrdering = 'difficulty,-solved';
        }

        if (categoryId === Categories.CompetitiveProgramming) {
          this.defaultOrdering = '-id';
        }

        this.filterService.setFilter({category: categoryId}, false);
        this.apiService.getCategory(categoryId).subscribe(
          (category: Category) => {
            this.category = category;
            this.isCategoryLoading = false;
            this.loadContentHeader();
          }
        );

        this.apiService.getCategoryTopUsers(categoryId).subscribe(
          (topUsers) => {
            this.topUsers = topUsers;
            this.isTopUsersLoading = false;
          }
        );

        this.apiService.getCategoryStudyPlans(categoryId).subscribe(
          (studyPlans) => {
            this.studyPlans = studyPlans;
          }
        );
      } else {
        this.router.navigateByUrl('/404');
      }
    });
  }

  ngOnDestroy() {
    this.filterService.setFilter({});
    super.ngOnDestroy();
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: this.category.title,
      refreshVisible: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Problems',
            isLink: true,
            link: '..'
          },
        ]
      }
    };
  }
}
