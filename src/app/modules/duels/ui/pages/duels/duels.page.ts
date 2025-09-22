import { Component } from '@angular/core';
import { BasePageComponent } from '@core/common/classes/base-page.component';
import { ContentHeader } from '@shared/ui/components/content-header/content-header.component';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { CoreCommonModule } from '@core/common.module';
import { TranslateModule } from '@ngx-translate/core';
import { DuelReadyStatusWidgetComponent } from '@duels/ui/widgets/duel-ready-status-widget/duel-ready-status-widget.component';
import { DuelReadyPlayersWidgetComponent } from '@duels/ui/widgets/duel-ready-players-widget/duel-ready-players-widget.component';
import { DuelsListWidgetComponent } from '@duels/ui/widgets/duels-list-widget/duels-list-widget.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'page-duels',
  standalone: true,
  templateUrl: './duels.page.html',
  styleUrls: ['./duels.page.scss'],
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    TranslateModule,
    DuelReadyStatusWidgetComponent,
    DuelReadyPlayersWidgetComponent,
    DuelsListWidgetComponent,
    NgbNavModule,
  ]
})
export class DuelsPage extends BasePageComponent {
  readyPlayersRefreshKey = 0;
  myDuelsRefreshKey = 0;
  allDuelsRefreshKey = 0;
  activeTab: 'my' | 'ready' | 'all' = 'my';

  override afterChangeCurrentUser(): void {
    this.triggerListsReload();
  }

  onReadyStatusChanged(_: boolean): void {
    this.readyPlayersRefreshKey++;
  }

  onDuelCreated(): void {
    this.myDuelsRefreshKey++;
    this.allDuelsRefreshKey++;
  }

  onDuelConfirmed(): void {
    this.myDuelsRefreshKey++;
    this.allDuelsRefreshKey++;
  }

  protected override getContentHeader(): ContentHeader {
    return {
      headerTitle: 'Duels',
      breadcrumb: {
        links: [
          {name: 'Practice', isLink: false},
          {name: 'Duels', isLink: false},
        ],
      },
    };
  }

  private triggerListsReload(): void {
    this.readyPlayersRefreshKey++;
    this.myDuelsRefreshKey++;
    this.allDuelsRefreshKey++;
  }
}
