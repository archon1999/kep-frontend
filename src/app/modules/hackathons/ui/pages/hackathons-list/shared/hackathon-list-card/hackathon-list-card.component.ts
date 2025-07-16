import { Component, Input } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { Hackathon } from '@app/modules/hackathons/domain';

@Component({
  selector: 'hackathon-list-card',
  templateUrl: './hackathon-list-card.component.html',
  styleUrls: ['./hackathon-list-card.component.scss'],
  standalone: true,
  imports: [CoreCommonModule, KepCardComponent]
})
export class HackathonListCardComponent {
  @Input() hackathon: Hackathon;
}
