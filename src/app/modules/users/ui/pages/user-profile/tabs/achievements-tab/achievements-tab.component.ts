import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAchievementsComponent } from '../../widgets/user-achievements/user-achievements.component';

@Component({
  selector: 'app-user-achievements-tab',
  standalone: true,
  imports: [CommonModule, UserAchievementsComponent],
  templateUrl: './achievements-tab.component.html',
  styleUrl: './achievements-tab.component.scss'
})
export class UserAchievementsTabComponent {
}
