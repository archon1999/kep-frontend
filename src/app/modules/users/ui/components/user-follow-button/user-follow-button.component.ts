import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { takeUntil } from "rxjs/operators";
import { BaseUserComponent } from "@core/common";
import { UsersApiService } from "@app/modules/users";
import { KepIconComponent } from "@shared/components/kep-icon/kep-icon.component";
import { TranslatePipe } from "@ngx-translate/core";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'user-follow-button',
  imports: [
    KepIconComponent,
    TranslatePipe,
    NgbTooltip
  ],
  templateUrl: './user-follow-button.component.html',
  styleUrl: './user-follow-button.component.scss'
})
export class UserFollowButtonComponent extends BaseUserComponent {
  @Input() username: string;
  @Input() isFollowing: boolean;

  public followLoading = false;

  protected usersApi = inject(UsersApiService);
  protected cdr = inject(ChangeDetectorRef);

  get canFollow(): boolean {
    if (!this.username || !this.currentUser) {
      return false;
    }

    return this.currentUser?.username !== this.username;
  }

  toggleFollow(): void {
    if (!this.username || this.followLoading) {
      return;
    }

    if (!this.canFollow) {
      return;
    }

    const username = this.username;
    const request$ = this.isFollowing
      ? this.usersApi.unfollowUser(username)
      : this.usersApi.followUser(username);

    this.followLoading = true;

    request$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this.isFollowing = !this.isFollowing;
          this.followLoading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.followLoading = false;
          this.cdr.markForCheck();
        }
      });
  }

}
