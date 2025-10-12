import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Product } from '@app/modules/shop/shop.interfaces';
import { CoreCommonModule } from '@core/common.module';
import { KepcoinViewModule } from '@shared/components/kepcoin-view/kepcoin-view.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'product-item',
  standalone: true,
  imports: [
    CoreCommonModule,
    KepcoinViewModule,
    NgbModule,
    KepCardComponent,
  ],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ProductItemComponent implements OnChanges {
  @Input() product: Product;

  public currentImageIndex = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product']) {
      this.currentImageIndex = 0;
    }
  }

  public showPreviousImage(): void {
    const images = this.product?.images ?? [];

    if (images.length <= 1) {
      return;
    }

    this.currentImageIndex = (this.currentImageIndex - 1 + images.length) % images.length;
  }

  public showNextImage(): void {
    const images = this.product?.images ?? [];

    if (images.length <= 1) {
      return;
    }

    this.currentImageIndex = (this.currentImageIndex + 1) % images.length;
  }

  public selectImage(index: number): void {
    const images = this.product?.images ?? [];

    if (!images.length || index === this.currentImageIndex) {
      return;
    }

    this.currentImageIndex = Math.max(0, Math.min(index, images.length - 1));
  }

  public hasImages(): boolean {
    return !!this.product?.images?.length;
  }

  public hasMultipleImages(): boolean {
    return (this.product?.images?.length ?? 0) > 1;
  }

  public get currentImageUrl(): string | undefined {
    const images = this.product?.images ?? [];

    if (!images.length) {
      return undefined;
    }

    return images[this.currentImageIndex]?.url;
  }
}
