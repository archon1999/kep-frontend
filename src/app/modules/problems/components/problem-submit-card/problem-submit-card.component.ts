import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { AvailableLanguage } from '@problems/models/problems.models';
import { AttemptLangs } from '@problems/constants';
import { LanguageService } from '@problems/services/language.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { findAvailableLang } from '@problems/utils';
import { ApiService } from '@core/data-access/api.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CoreCommonModule } from '@core/common.module';
import { NgIf, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent, NgOptionComponent } from '@ng-select/ng-select';
import { AttemptLanguageComponent } from '@shared/components/attempt-language/attempt-language.component';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';

@Component({
  selector: 'problem-submit-card',
  standalone: true,
  imports: [
    CoreCommonModule,
    NgIf,
    NgForOf,
    FormsModule,
    NgSelectComponent,
    NgOptionComponent,
    AttemptLanguageComponent,
    TranslateModule,
    KepCardComponent,
  ],
  templateUrl: './problem-submit-card.component.html',
  styleUrls: ['./problem-submit-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProblemSubmitCardComponent implements OnInit, OnDestroy, OnChanges {

  @Input() availableLanguages: Array<AvailableLanguage> = [];
  @Input() submitUrl: string;
  @Input() submitParams: Record<string, unknown> = {};
  @Input() disabled = false;
  @Input() fileAccept = '.cpp,.py,.c,.r,.hs,.kt,.cs,.php,.js,.rs,.java';
  @Input() maxFileSize = 1024 * 128;

  @Output() submitted = new EventEmitter<void>();

  public selectedLang: AttemptLangs;
  public selectedAvailableLang: AvailableLanguage | null = null;

  public fileToUpload: File | null = null;
  public isSubmitting = false;

  private readonly _unsubscribeAll = new Subject<void>();

  constructor(
    private readonly langService: LanguageService,
    private readonly api: ApiService,
    private readonly translateService: TranslateService,
    private readonly toastr: ToastrService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.langService.getLanguage().pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (lang: AttemptLangs) => {
        this.updateSelectedLanguage(lang);
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('availableLanguages' in changes && this.availableLanguages?.length) {
      this.updateSelectedLanguage(this.langService.getLanguageValue());
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  onLangChange(lang: AttemptLangs) {
    this.langService.setLanguage(lang);
  }

  handleFileInput(files: FileList | null) {
    if (!files || files.length === 0) {
      this.fileToUpload = null;
      this.cdr.markForCheck();
      return;
    }

    const file = files.item(0);
    if (!file) {
      this.fileToUpload = null;
      this.cdr.markForCheck();
      return;
    }

    if (file.size > this.maxFileSize) {
      const maxSizeKb = Math.floor(this.maxFileSize / 1024);
      this.toastr.error(`Max file size ${maxSizeKb}kb`);
      this.fileToUpload = null;
      this.cdr.markForCheck();
      return;
    }

    this.fileToUpload = file;
    this.cdr.markForCheck();
  }

  submit() {
    if (this.disabled || this.isSubmitting || !this.fileToUpload || !this.submitUrl || !this.selectedLang) {
      return;
    }

    this.isSubmitting = true;
    const file = this.fileToUpload;

    file.text().then(
      (sourceCode) => {
        const data = {
          sourceCode,
          lang: this.selectedLang,
          ...this.submitParams,
        };

        this.api.post(this.submitUrl, data).pipe(
          finalize(() => {
            this.isSubmitting = false;
            this.cdr.markForCheck();
          })
        ).subscribe(
          () => {
            this.fileToUpload = null;
            this.cdr.markForCheck();
            const successText = this.translateService.instant('SubmittedSuccess');
            this.toastr.success('', successText);
            this.submitted.emit();
          },
          () => {
            this.toastr.error(this.translateService.instant('Error'));
          }
        );
      },
      () => {
        this.isSubmitting = false;
        this.toastr.error(this.translateService.instant('Error'));
        this.cdr.markForCheck();
      }
    );
  }

  private updateSelectedLanguage(lang: AttemptLangs) {
    if (!this.availableLanguages?.length) {
      this.selectedAvailableLang = null;
      this.selectedLang = lang;
      this.cdr.markForCheck();
      return;
    }

    const available = findAvailableLang(this.availableLanguages, lang);

    if (available) {
      this.selectedAvailableLang = available;
      this.selectedLang = available.lang as AttemptLangs;
      this.cdr.markForCheck();
      return;
    }

    const fallback = this.availableLanguages[0];
    this.selectedAvailableLang = fallback;
    this.selectedLang = fallback.lang as AttemptLangs;
    this.cdr.markForCheck();

    if (fallback?.lang) {
      this.langService.setLanguage(fallback.lang as AttemptLangs);
    }
  }
}
