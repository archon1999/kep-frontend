import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@core/data-access/api.service';
import { NgxCaptureService } from 'ngx-capture';
import { tap } from 'rxjs/operators';
import { Problem } from '@problems/models/problems.models';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { MathjaxModule } from '@shared/third-part-modules/mathjax/mathjax.module';
import { ProblemsPipesModule } from '@problems/pipes/problems-pipes.module';

@Component({
  selector: 'app-problem-og-image',
  templateUrl: './problem-og-image.component.html',
  styleUrls: ['./problem-og-image.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbTooltipModule,
    UserPopoverModule,
    MathjaxModule,
    ProblemsPipesModule,
  ],
})
export class ProblemOgImageComponent implements OnInit {

  public problem: Problem;

  public img: string;

  @ViewChild('screen') screen: any;

  constructor(
    public route: ActivatedRoute,
    public captureService: NgxCaptureService,
    public api: ApiService,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(
      ({problem}) => {
        this.problem = problem;
      }
    );

    setTimeout(() => {
      this.captureService.getImage(this.screen.nativeElement, true)
        .pipe(
          tap(img => {
            this.api.post(`problems/${this.problem.id}/og-image/`, {og_image: img}).subscribe(() => {

            });
            this.img = img;
          })
        ).subscribe();
    }, 2000);
  }

}
