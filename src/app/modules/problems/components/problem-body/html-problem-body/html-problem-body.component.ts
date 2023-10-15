import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Problem } from '../../../models/problems.models';
import { CoreConfigService } from '../../../../../../@core/services/config.service';
import { TemplateCodeService } from '../../../../../shared/services/template-code.service';
import { AttemptLangs } from '../../../constants';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'html-problem-body',
  templateUrl: './html-problem-body.component.html',
  styleUrls: ['./html-problem-body.component.scss']
})
export class HtmlProblemBodyComponent implements OnInit {

  constructor(
    public coreConfigService: CoreConfigService,
    public templateCodeService: TemplateCodeService,
  ) {}

  @Input() problem: Problem;
  @Input() frameHeight: number;
  @Input() frameWidth: number;

  public html: string;

  public outputHtml: string;

  public outputWidth = 100;
  public mouseEnter = false;

  public uniqueName: string;

  protected readonly AttemptLangs = AttemptLangs;

  ngOnInit(): void {
    this.uniqueName = `problem-${ this.problem.id }`;
    this.html = this.templateCodeService.get(this.uniqueName, 'html') || this.problem.availableLanguages[0].codeTemplate;
    this.setOutputHtml();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e) {
    if (this.mouseEnter) {
      this.outputWidth = 100 * e.layerX / 300;
    } else {
      this.outputWidth = 100;
    }
  }

  change() {
    setTimeout(() => {
      this.setOutputHtml();
    }, 100);
  }

  setOutputHtml() {
    this.templateCodeService.save(this.uniqueName, 'html', this.html);
    const html = this.html.replace(/<\s*img/, '<imga');
    this.outputHtml = `
      <html style="height: 100%; width: 100%;">
        <body style="overflow: hidden; height: 100%; width: 100%;">
          ${ html }
        </body>
      </html>
    `;
  }
}
