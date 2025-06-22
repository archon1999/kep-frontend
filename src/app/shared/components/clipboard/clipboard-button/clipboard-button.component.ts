import { ChangeDetectorRef, Component, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'clipboard-button',
  templateUrl: './clipboard-button.component.html',
  styleUrls: ['./clipboard-button.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class ClipboardButtonComponent implements OnInit {

  @Input() text: string;

  public displayText: string;
  public displayIcon: string;

  protected translateService = inject(TranslateService);
  protected cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.displayText = this.translateService.instant('Copy');
    this.displayIcon = 'copy';
  }

  copyText(inputTextValue: string) {
    const selectBox = document.createElement('textarea');
    selectBox.style.position = 'fixed';
    selectBox.value = inputTextValue;
    document.body.appendChild(selectBox);
    selectBox.focus();
    selectBox.select();
    document.execCommand('copy');
    document.body.removeChild(selectBox);
    this.displayText = this.translateService.instant('Copied');
    this.displayIcon = 'double-check';
    setTimeout(() => {
      this.displayText = this.translateService.instant('Copy');
      this.displayIcon = 'copy';
      this.cdr.detectChanges();
    }, 2000);
  }

}
