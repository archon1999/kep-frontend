import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { coreConfig } from '@app/app.config';

@Injectable({
  providedIn: 'root'
})

export class TitleService {

  constructor(
    public translateService: TranslateService,
    public title: Title
  ) {}

  updateTitle(route: ActivatedRoute, params: object) {
    const key = `PageTitle.${ route.snapshot.data['title'] }`;
    this.translateService.get(key, params).subscribe((value: string) => {
      this.title.setTitle(`${ value } | ${ coreConfig.app.appTitle }`);
    });
  }

}
