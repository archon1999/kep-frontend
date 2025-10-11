import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserActivityHistoryComponent } from '../../widgets/user-activity-history/user-activity-history.component';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-user-activity-history-tab',
  standalone: true,
  imports: [CommonModule, UserActivityHistoryComponent],
  templateUrl: './activity-history-tab.component.html',
  styleUrl: './activity-history-tab.component.scss'
})
export class UserActivityHistoryTabComponent implements OnInit {
  public username: string;
  protected route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.username = this.route.parent.snapshot.paramMap.get('username')!;
  }
}
