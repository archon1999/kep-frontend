import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { BasePageComponent } from '@app/common';
import { ContentHeader } from '@shared/ui/components/content-header/content-header.component';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { HackathonsApiService } from '@app/modules/hackathons/data-access/hackathons-api.service';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';

@Component({
  selector: 'hackathon-registrants',
  templateUrl: './hackathon-registrants.component.html',
  styleUrls: ['./hackathon-registrants.component.scss'],
  standalone: true,
  imports: [CoreCommonModule, ContentHeaderModule, KepCardComponent]
})
export class HackathonRegistrantsComponent extends BasePageComponent implements OnInit {
  public hackathonId: number;
  public registrants: any[] = [];
  public isLoading = true;

  protected cdr = inject(ChangeDetectorRef);
  protected hackathonsApiService = inject(HackathonsApiService);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.hackathonId = params['id'];
      this.hackathonsApiService.getHackathonRegistrants(this.hackathonId).subscribe(registrants => {
        this.registrants = registrants;
        this.isLoading = false;
        this.cdr.detectChanges();
      });
      this.loadContentHeader();
    });
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'Registrants',
      breadcrumb: {
        type: '',
        links: [
          { name: 'Hackathons', isLink: true, link: '../../..' },
          { name: this.hackathonId + '', isLink: true, link: '..' }
        ]
      }
    };
  }
}
