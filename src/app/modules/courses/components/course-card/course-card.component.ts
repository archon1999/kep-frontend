import { Component, Input } from '@angular/core';
import { IconNamePipe } from '@shared/pipes/feather-icons.pipe';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbProgressbarModule, NgbRatingModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { Course } from '@app/modules/courses/interfaces/course';
import { Resources } from '@app/resources';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';

@Component({
  selector: 'course-card',
  standalone: true,
  imports: [
    IconNamePipe,
    RouterLink,
    TranslateModule,
    NgbRatingModule,
    NgbTooltipModule,
    CoreCommonModule,
    NgbProgressbarModule,
    ResourceByIdPipe
  ],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.scss'
})
export class CourseCardComponent {
  @Input() course: Course;
  protected readonly Resources = Resources;
}
