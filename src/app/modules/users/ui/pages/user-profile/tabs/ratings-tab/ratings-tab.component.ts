import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRatingsComponent } from '../../widgets/user-ratings/user-ratings.component';

@Component({
  selector: 'app-user-ratings-tab',
  standalone: true,
  imports: [CommonModule, UserRatingsComponent],
  templateUrl: './ratings-tab.component.html',
  styleUrl: './ratings-tab.component.scss'
})
export class UserRatingsTabComponent {
}
