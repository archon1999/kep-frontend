import { Component, inject } from '@angular/core';
import { BaseLoadComponent } from '@core/common';
import { Product } from '@app/modules/shop/shop.interfaces';
import { Observable } from 'rxjs';
import { ShopApiService } from '@app/modules/shop/shop-api.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ContentHeader } from "@shared/ui/components/content-header/content-header.component";
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { ProductItemComponent } from '@app/modules/shop/components/product-item/product-item.component';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CoreCommonModule } from '@core/common.module';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { KepcoinViewModule } from '@shared/components/kepcoin-view/kepcoin-view.module';
import { GalleriaModule } from 'primeng/galleria';

@Component({
  selector: 'page-shop',
  standalone: true,
  imports: [
    SpinnerComponent,
    ContentHeaderModule,
    ProductItemComponent,
    CarouselModule,
    CoreCommonModule,
    KepCardComponent,
    KepcoinViewModule,
    GalleriaModule,
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent extends BaseLoadComponent<Array<Product>> {
  protected service = inject(ShopApiService);

  protected featuredProduct: Product | null = null;
  protected spotlightProducts: Product[] = [];
  protected colorPalette: Array<{ name: string; color: string }> = [];
  protected sizePalette: string[] = [];
  protected featuredPreviewColors: Array<{ name: string; color: string }> = [];
  protected featuredPreviewSizes: string[] = [];

  protected spotlightOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    nav: false,
    navSpeed: 600,
    margin: 24,
    responsive: {
      0: { items: 1 },
      768: { items: 1 },
      992: { items: 2 },
      1400: { items: 3 },
      1700: { items: 4 }
    }
  };

  getData(): Observable<Array<Product>> {
    return this.service.getProducts();
  }

  protected override afterLoadData(products: Array<Product>): void {
    if (!products?.length) {
      this.featuredProduct = null;
      this.spotlightProducts = [];
      this.colorPalette = [];
      this.sizePalette = [];
      this.featuredPreviewColors = [];
      this.featuredPreviewSizes = [];
      return;
    }

    const [featured, ...rest] = products;
    this.featuredProduct = featured ?? null;
    this.spotlightProducts = rest.slice(0, 8);

    const colorMap = new Map<string, string>();
    const sizeSet = new Set<string>();
    products.forEach((product) => {
      product.colors?.forEach((color) => {
        if (color.name && !colorMap.has(color.name)) {
          colorMap.set(color.name, color.color);
        }

        color.sizes?.forEach((size) => {
          if (size.name) {
            sizeSet.add(size.name);
          }
        });
      });
    });

    this.colorPalette = Array.from(colorMap.entries())
      .slice(0, 8)
      .map(([name, color]) => ({ name, color }));
    this.sizePalette = Array.from(sizeSet).slice(0, 8);

    const featuredColorMap = new Map<string, string>();
    const featuredSizeSet = new Set<string>();
    this.featuredProduct?.colors?.forEach((color) => {
      if (color.name && !featuredColorMap.has(color.name)) {
        featuredColorMap.set(color.name, color.color);
      }

      color.sizes?.forEach((size) => {
        if (size.name) {
          featuredSizeSet.add(size.name);
        }
      });
    });

    this.featuredPreviewColors = Array.from(featuredColorMap.entries())
      .slice(0, 4)
      .map(([name, color]) => ({ name, color }));
    this.featuredPreviewSizes = Array.from(featuredSizeSet).slice(0, 4);
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
}
