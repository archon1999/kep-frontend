import { Component } from '@angular/core';
import { FooterComponent } from "@core/components/footer/footer.component";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-landing-layout',
  templateUrl: './landing-layout.component.html',
  styleUrl: './landing-layout.component.scss',
  standalone: true,
  imports: [
    FooterComponent,
    RouterOutlet
  ]
})
export class LandingLayoutComponent {

}
