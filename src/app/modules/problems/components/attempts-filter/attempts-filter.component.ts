import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  VerdictsSelectComponent
} from '@problems/components/attempts-filter/verdicts-select/verdicts-select.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BaseUserComponent } from '@core/common';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { AttemptsFilter } from '@problems/interfaces';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { UsersAutocompleteComponent } from "@shared/components/users-autocomplete/users-autocomplete.component";
import {
  ProblemsAutocompleteComponent
} from "@shared/components/problems-autocomplete/problems-autocomplete.component";
import { NgSelectModule } from "@shared/third-part-modules/ng-select/ng-select.module";
import { AttemptLanguageComponent } from "@shared/components/attempt-language/attempt-language.component";
import { ProblemsApiService } from "@problems/services/problems-api.service";

@Component({
  selector: 'attempts-filter',
  standalone: true,
  imports: [
    KepIconComponent,
    TranslateModule,
    VerdictsSelectComponent,
    ReactiveFormsModule,
    NgbTooltipModule,
    KepCardComponent,
    UsersAutocompleteComponent,
    ProblemsAutocompleteComponent,
    NgSelectModule,
    AttemptLanguageComponent
  ],
  templateUrl: './attempts-filter.component.html',
  styleUrl: './attempts-filter.component.scss'
})
export class AttemptsFilterComponent extends BaseUserComponent implements OnInit {
  @Output() filterChange = new EventEmitter<AttemptsFilter>;
  @Output() refresh = new EventEmitter<void>;

  @Input()
  set initialFilter(filter: Partial<AttemptsFilter> | null) {
    if (!filter) {
      return;
    }

    const problemId = filter.problemId !== undefined && filter.problemId !== null ? Number(filter.problemId) : null;

    this.form.patchValue({
      username: filter.username ?? null,
      problemId: problemId !== null && !Number.isNaN(problemId) ? problemId : null,
      verdict: filter.verdict ?? null,
      lang: filter.lang ?? null,
    }, {emitEvent: false});
  }

  public form = new FormGroup({
    username: new FormControl(),
    problemId: new FormControl(),
    verdict: new FormControl(),
    lang: new FormControl(),
  });

  public langOptions: Array<{ lang: string; langFull: string }> = [];

  constructor(private problemsService: ProblemsApiService, private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.form.valueChanges.pipe(
      debounceTime(500),
      takeUntil(this._unsubscribeAll)
    ).subscribe(
      (value) => {
        this.filterChange.next(value as AttemptsFilter);
      }
    );
    this.problemsService.getLangs().subscribe(
      langs => {
        this.langOptions = langs || [];
        this.cdr.markForCheck();
      }
    );
  }

  myAttemptsClick() {
    this.form.controls.username.patchValue(this.currentUser?.username);
  }

  filterClear() {
    this.form.patchValue({
      username: null,
      problemId: null,
      verdict: null,
      lang: null,
    });
  }
}
