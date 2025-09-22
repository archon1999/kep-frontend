import { Component, Input } from '@angular/core';
import { Blog } from '../../blog.interfaces';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { RouterLink } from '@angular/router';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { TranslatePipe } from '@ngx-translate/core';
import { Resources } from '@app/resources';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';

@Component({
  selector: 'blog-post-card',
  templateUrl: './blog-post-card.component.html',
  styleUrls: ['./blog-post-card.component.scss'],
  standalone: true,
  imports: [
    KepCardComponent,
    RouterLink,
    UserPopoverModule,
    CoreDirectivesModule,
    TranslatePipe,
    ResourceByIdPipe
  ]
})
export class BlogPostCardComponent {
  @Input() blog: Blog;
  @Input() cardImgHeight = 250;
  protected readonly Resources = Resources;
}
