import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { Hackathon } from '@hackathons/domain';
import { Resources } from "@app/resources";
import { ResourceByIdPipe } from "@shared/pipes/resource-by-id.pipe";
import { MathjaxModule } from "@shared/third-part-modules/mathjax/mathjax.module";
import { HackathonCountdownComponent } from "../hackathon-countdown/hackathon-countdown.component";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { ProjectTechnologyComponent } from "@projects/ui/components/project-technology/project-technology.component";

@Component({
  selector: 'hackathon-card',
  templateUrl: './hackathon-card.component.html',
  styleUrls: ['./hackathon-card.component.scss'],
  standalone: true,
  imports: [CoreCommonModule, KepCardComponent, ResourceByIdPipe, MathjaxModule, HackathonCountdownComponent, NgbTooltip, ProjectTechnologyComponent],
  encapsulation: ViewEncapsulation.None,
})
export class HackathonCardComponent {
  @Input() hackathon: Hackathon;
  protected readonly Resources = Resources;
}
