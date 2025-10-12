import { Component, inject } from '@angular/core';
import { BaseLoadComponent } from '@core/common';
import { Product } from '@app/modules/shop/shop.interfaces';
import { Observable } from 'rxjs';
import { ShopApiService } from '@app/modules/shop/shop-api.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ContentHeader } from "@shared/ui/components/content-header/content-header.component";
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
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

  public featuredProducts: Product[] = [];
  public newArrivals: Product[] = [];
  public editorPicks: Product[] = [];
  public spotlightProduct?: Product;
  public heroShowcase: Product[] = [];
  public totalProducts = 0;
  public totalColorways = 0;
  public totalSizes = 0;

  getData(): Observable<Array<Product>> {
    return this.service.getProducts();
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'Menu.Shop',
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

  protected override afterLoadData(products: Array<Product>): void {
    const safeProducts = products ?? [];

    this.totalProducts = safeProducts.length;
    this.totalColorways = safeProducts.reduce((total, product) => total + (product.colors?.length ?? 0), 0);
    this.totalSizes = safeProducts.reduce((total, product) => {
      const sizes = product.colors?.flatMap((color) => color.sizes ?? []) ?? [];
      return total + sizes.length;
    }, 0);

    this.spotlightProduct = safeProducts[0];
    this.featuredProducts = safeProducts.slice(0, Math.min(8, safeProducts.length));
    this.newArrivals = safeProducts.slice(-8).reverse();
    this.editorPicks = safeProducts.slice(1, Math.min(9, safeProducts.length));
    this.heroShowcase = safeProducts.slice(0, Math.min(3, safeProducts.length));
  }

  public scrollCarousel(container: HTMLElement | null, direction: number): void {
    if (!container) {
      return;
    }

    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
  }
}
