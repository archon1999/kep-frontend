import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'app/shared/services/api.service';
import { NgxCaptureService } from 'ngx-capture';
import { tap } from 'rxjs/operators';
import { CoreCommonModule } from '@core/common.module';
import { Contest } from '@contests/models/contest';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'app-contest-og-image',
  templateUrl: './contest-og-image.component.html',
  styleUrls: ['./contest-og-image.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    KepCardComponent,
  ],
  encapsulation: ViewEncapsulation.None
})
export class ContestOgImageComponent implements OnInit {

  public contest: Contest;

  public img: string;

  @ViewChild('screen') screen: any;

  constructor(
    public route: ActivatedRoute,
    public captureService: NgxCaptureService,
    public api: ApiService
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(({contest}) => {
      this.contest = Contest.fromJSON(contest);
    });
    return;

    setTimeout(() => {
      this.captureService.getImage(this.screen.nativeElement, true)
        .pipe(
          tap(img => {
            this.api.post(`contests/${this.contest.id}/og-image/`, {og_image: img}).subscribe(() => {

            });
            this.img = img;
          })
        ).subscribe();
    }, 4000);
  }

}
