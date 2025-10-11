import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAboutComponent } from '../../widgets/user-about/user-about.component';

@Component({
  selector: 'app-user-about-tab',
  standalone: true,
  imports: [CommonModule, UserAboutComponent],
  templateUrl: './about-tab.component.html',
  styleUrl: './about-tab.component.scss'
})
export class UserAboutTabComponent {
}
