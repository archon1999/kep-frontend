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

  public activeImageIndex = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product']) {
      this.activeImageIndex = 0;
    }
  }

  public showPreviousImage(): void {
    if (!this.hasMultipleImages) {
      return;
    }

    this.activeImageIndex =
      (this.activeImageIndex - 1 + this.imagesLength) % this.imagesLength;
  }

  public showNextImage(): void {
    if (!this.hasMultipleImages) {
      return;
    }

    this.activeImageIndex = (this.activeImageIndex + 1) % this.imagesLength;
  }

  public selectImage(index: number): void {
    if (index >= 0 && index < this.imagesLength) {
      this.activeImageIndex = index;
    }
  }

  private get hasMultipleImages(): boolean {
    return this.imagesLength > 1;
  }

  private get imagesLength(): number {
    return this.product?.images?.length ?? 0;
  }
}
