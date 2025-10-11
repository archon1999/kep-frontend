import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserActivityHistoryComponent } from '../../widgets/user-activity-history/user-activity-history.component';

@Component({
  selector: 'app-user-activity-history-tab',
  standalone: true,
  imports: [CommonModule, UserActivityHistoryComponent],
  templateUrl: './activity-history-tab.component.html',
  styleUrl: './activity-history-tab.component.scss'
})
export class UserActivityHistoryTabComponent {
}
