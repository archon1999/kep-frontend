import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Blog } from '@app/modules/blog/blog.interfaces';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { RouterLink } from '@angular/router';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { Resources } from '@app/resources';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';

@Component({
  selector: 'news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    KepCardComponent,
    RouterLink,
    CoreDirectivesModule,
    ResourceByIdPipe
  ]
})
export class NewsCardComponent {
  @Input() blog: Blog;
  protected readonly Resources = Resources;
}
