import { Component, ViewEncapsulation } from '@angular/core';
import { MENU } from "@core/config/menu";
import { KepIconComponent } from "@shared/components/kep-icon/kep-icon.component";
import { RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    KepIconComponent,
    RouterLink,
    TranslatePipe,
    KepCardComponent
  ]
})
export class FooterComponent {
  public readonly menu = MENU;
}
