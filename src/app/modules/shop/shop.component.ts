import { Component, inject } from '@angular/core';
import { BaseLoadComponent } from '@app/common';
import { Product } from '@app/modules/shop/shop.interfaces';
import { Observable } from 'rxjs';
import { ShopApiService } from '@app/modules/shop/shop-api.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ContentHeader } from "@core/components/content-header/content-header.component";
import { ContentHeaderModule } from '@core/components/content-header/content-header.module';
import { ProductItemComponent } from '@app/modules/shop/components/product-item/product-item.component';

@Component({
  selector: 'page-shop',
  standalone: true,
  imports: [
    SpinnerComponent,
    ContentHeaderModule,
    ProductItemComponent
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent extends BaseLoadComponent<Array<Product>> {
  protected service = inject(ShopApiService);

  getData(): Observable<Array<Product>> {
    return this.service.getProducts();
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'MENU.SHOP',
      breadcrumb: {
        links: [
          {
            name: 'KEP.uz',
            isLink: true,
            link: '/',
          }
        ]
      }
    };
  }
}
