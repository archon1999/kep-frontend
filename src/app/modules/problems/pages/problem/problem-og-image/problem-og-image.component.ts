import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'app/api.service';
import { NgxCaptureService } from 'ngx-capture';
import { tap } from 'rxjs/operators';
import { Problem } from '../../../models/problems.models';

@Component({
  selector: 'app-problem-og-image',
  templateUrl: './problem-og-image.component.html',
  styleUrls: ['./problem-og-image.component.scss']
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
      ({ problem }) => {
        this.problem = problem;
      }
    )

    setTimeout(() => {
      this.captureService.getImage(this.screen.nativeElement, true)
        .pipe(
          tap(img => {
            console.log(this.problem.id);
            this.api.post(`problems/${this.problem.id}/og-image/`, { og_image: img }).subscribe(() => {

            })
            this.img = img;
          })
        ).subscribe();
    }, 2000);

  }

}
