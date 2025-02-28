import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Product } from '@app/modules/shop/shop.interfaces';
import { CoreCommonModule } from '@core/common.module';
import { KepcoinViewModule } from '@shared/components/kepcoin-view/kepcoin-view.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GalleriaModule } from 'primeng/galleria';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'product-item',
  standalone: true,
  imports: [
    CoreCommonModule,
    KepcoinViewModule,
    NgbModule,
    GalleriaModule,
    KepCardComponent,
  ],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ProductItemComponent {
  @Input() product: Product;

  public responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 4
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 2
    }
  ];
}
