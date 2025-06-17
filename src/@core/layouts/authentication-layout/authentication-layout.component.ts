import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-authentication-layout',
  templateUrl: './authentication-layout.component.html',
  styleUrl: './authentication-layout.component.scss',
  standalone: true,
  imports: [
    RouterOutlet
  ]
})
export class AuthenticationLayoutComponent {

}
