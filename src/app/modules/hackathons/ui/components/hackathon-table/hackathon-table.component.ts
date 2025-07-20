import { Component, Input } from '@angular/core';
import { Hackathon } from "@hackathons/domain";
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { TranslatePipe } from "@ngx-translate/core";
import { KepIconComponent } from "@shared/components/kep-icon/kep-icon.component";
import { UserPopoverModule } from "@shared/components/user-popover/user-popover.module";
import { DatePipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { CountUpModule } from "ngx-countup";

@Component({
  selector: 'hackathon-table',
  templateUrl: './hackathon-table.component.html',
  styleUrls: ['./hackathon-table.component.scss'],
  standalone: true,
  imports: [
    KepCardComponent,
    TranslatePipe,
    KepIconComponent,
    UserPopoverModule,
    DatePipe,
    RouterLink,
    CountUpModule
  ]
})
export class HackathonTableComponent {
  @Input() hackathon: Hackathon;
}
