import { Component, inject } from '@angular/core';
import { BaseLoadComponent } from '@core/common';
import { Product } from '@app/modules/shop/shop.interfaces';
import { Observable } from 'rxjs';
import { ShopApiService } from '@app/modules/shop/shop-api.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ContentHeader } from '@shared/ui/components/content-header/content-header.component';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { ProductItemComponent } from '@app/modules/shop/components/product-item/product-item.component';
import { CarouselModule } from 'primeng/carousel';
import { GalleriaModule } from 'primeng/galleria';

interface ShopCategory {
  title: string;
  accent: string;
  count: number;
}

interface HeroSlide {
  url: string;
  title: string;
  description: string;
}

@Component({
  selector: 'page-shop',
  standalone: true,
  imports: [
    SpinnerComponent,
    ContentHeaderModule,
    ProductItemComponent,
    CarouselModule,
    GalleriaModule,
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent extends BaseLoadComponent<Array<Product>> {
  protected service = inject(ShopApiService);

  public heroSlides: HeroSlide[] = [];
  public trendingProducts: Product[] = [];
  public categories: ShopCategory[] = [];

  public carouselResponsiveOptions = [
    {
      breakpoint: '1600px',
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: '1199px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '767px',
      numVisible: 1,
      numScroll: 1,
    }
  ];

  override getData(): Observable<Array<Product>> {
    return this.service.getProducts();
  }

  override afterLoadData(products: Product[]): void {
    this.heroSlides = products
      .flatMap(product => (product.images ?? []).slice(0, 1).map(image => ({
        url: image.url,
        title: product.title,
        description: product.description,
      })))
      .slice(0, 5);

    this.trendingProducts = products.slice(0, 8);

    const colorMap = new Map<string, ShopCategory>();
    products.forEach(product => {
      product.colors?.forEach(color => {
        const existing = colorMap.get(color.name) ?? {
          title: color.name,
          accent: color.color ?? '#6f5cff',
          count: 0,
        };
        existing.count += 1;
        existing.accent = color.color ?? existing.accent;
        colorMap.set(color.name, existing);
      });
    });

    this.categories = Array.from(colorMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }

  protected override getContentHeader(): ContentHeader {
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
