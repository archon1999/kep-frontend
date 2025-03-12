import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'clipboard-button',
  templateUrl: './clipboard-button.component.html',
  styleUrls: ['./clipboard-button.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class ClipboardButtonComponent implements OnInit {

  @Input() buttonClass = 'btn btn-sm btn-primary';
  @Input() text: string;

  public copiedText: string;

  constructor(
    public toastr: ToastrService,
    public translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.translateService.get('Copied').subscribe(
      (text: string) => {
        this.copiedText = text;
      }
    );
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
    this.toastr.success('', this.copiedText);
  }

}
