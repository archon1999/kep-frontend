import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { BaseUserComponent } from '@app/common';
import { Contest, ContestAttemptsFilter, ContestProblem } from '@contests/models';
import { ContestsService } from '@contests/contests.service';
import { ProblemsApiService } from '@problems/services/problems-api.service';

@Component({
  selector: 'contest-attempts-filter',
  standalone: true,
  imports: [
    CoreCommonModule,
    FormsModule,
    KepIconComponent,
    NgSelectModule,
    TranslateModule
  ],
  templateUrl: './contest-attempts-filter.component.html',
  styleUrl: './contest-attempts-filter.component.scss'
})
export class ContestAttemptsFilterComponent extends BaseUserComponent implements OnInit {
  @Input() contest: Contest;
  @Output() filterChange = new EventEmitter<ContestAttemptsFilter>();

  public form = new FormGroup({
    userOnly: new FormControl(false),
    verdict: new FormControl(),
    contestProblem: new FormControl(),
  });
  public contestProblems: ContestProblem[] = [];
  public verdicts = [];

  private service = inject(ContestsService);
  private problemsService = inject(ProblemsApiService);

  ngOnInit() {
    this.service.getContestProblems(this.contest.id).subscribe((result: any) => {
      this.contestProblems = result;
    });

    this.problemsService.getVerdicts().subscribe((data: any) => {
      this.verdicts = data;
    });

    this.form.valueChanges.subscribe(
      (value) => {
        this.filterChange.next(value);
      }
    );
  }
}
