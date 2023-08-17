import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  @Input() collectionSize: number;
  @Input() pageSize: number;
  @Input() maxSize: number;
  @Input() @Output() page: number;
  @Input() rotate = false;
  @Input() color = 'primary';
  @Output() pageChange = new EventEmitter<number>;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      (params: any) => {
        if('page' in params){
          // this.page = +params.page;
          setTimeout(() => {
            this.pageChange.next(+params.page);
          }, 100);
        }
      }
    )
  }

  change(page: number){
    let currentScrollHeight = window.pageYOffset;
    this.router.navigate([], 
      {
        relativeTo: this.route,
        queryParams: { page: this.page },
      }
    ).then(() => window.scrollTo({ top: currentScrollHeight }));
    this.pageChange.next(page);
  }

}
