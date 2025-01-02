import { Component } from '@angular/core';
import { BaseLoadComponent } from '@app/common';
import { User } from '@users/users.models';
import { Observable } from 'rxjs';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ContentHeader } from '@layout/components/content-header/content-header.component';
import { coreConfig } from '@app/app.config';
import { ContentHeaderModule } from '@layout/components/content-header/content-header.module';
import { CoreCommonModule } from '@core/common.module';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { ImageModule } from 'primeng/image';

interface KVUser extends User {
  likesCount: number;
}

@Component({
  selector: 'kep-cover-3',
  standalone: true,
  imports: [
    SpinnerComponent,
    ContentHeaderModule,
    CoreCommonModule,
    UserPopoverModule,
    ImageModule
  ],
  templateUrl: './kep-cover-3.component.html',
  styleUrl: './kep-cover-3.component.scss'
})
export class KepCover3Component extends BaseLoadComponent<KVUser[]> {
  getData(): Observable<KVUser[]> {
    return this.api.get('kep-cover');
  }

  like(user: KVUser) {
    this.api.post('kep-cover', { username: user.username }).subscribe(
      (data: any) => {
        user.likesCount = data.likesCount;
      }
    );
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'KEP Cover #3',
      breadcrumb: {
        links: [
          {
            name: coreConfig.app.appTitle,
            isLink: true,
            link: '/',
          }
        ]
      }
    };
  }
}
