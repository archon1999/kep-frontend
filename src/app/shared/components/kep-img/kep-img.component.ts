import { Component, Input } from '@angular/core';

import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'kep-img',
  standalone: true,
  imports: [NgxSkeletonLoaderModule],
  templateUrl: './kep-img.component.html',
  styleUrl: './kep-img.component.scss'
})
export class KepImgComponent {
  @Input() src: string;
  @Input() alt: string;
  @Input() width: number;
  @Input() height: number;

  public skeletonVisible = true;
}
