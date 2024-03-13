import { Component, OnInit } from '@angular/core';
import { User } from '@auth';
import { BasePageComponent } from '@app/common';
import { ContentHeader } from '@layout/components/content-header/content-header.component';
import { getResourceById } from '@app/resources';

enum Tab {
  General = 'general',
  ChangePassword = 'change-password',
  Information = 'information',
  Social = 'social',
  Skill = 'skills',
  Career = 'career',
  Teams = 'teams',
  System = 'system',
}
@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent extends BasePageComponent implements OnInit {
  public activeId = Tab.General;
  protected readonly Tab = Tab;

  afterChangeCurrentUser(currentUser: User) {
    if (!currentUser) {
      this.router.navigateByUrl('/');
      this.loadContentHeader();
    }
  }

  ngOnInit() {
    super.ngOnInit();
    const url = this.router.url;
    const tabName = url.split('/').pop() as Tab;
    if (Object.values(Tab).includes(tabName)) {
      this.activeId = tabName;
    } else if (url !== this.Resources.Settings) {
      this.redirect404();
    }
  }

  activeIdChange(id: string) {
    this.router.navigateByUrl(getResourceById(this.Resources.SettingsTab, id), { replaceUrl: true });
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'SETTINGS',
      breadcrumb: {
        type: '',
        links: [
          {
            name: this.currentUser?.username,
            isLink: false,
          },
        ]
      }
    };
  }
}
