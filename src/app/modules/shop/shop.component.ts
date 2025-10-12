import { Component, inject } from '@angular/core';
import { BaseLoadComponent } from '@core/common';
import { Product } from '@app/modules/shop/shop.interfaces';
import { Observable } from 'rxjs';
import { ShopApiService } from '@app/modules/shop/shop-api.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ContentHeader } from "@shared/ui/components/content-header/content-header.component";
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { ProductItemComponent } from '@app/modules/shop/components/product-item/product-item.component';
import { CarouselModule } from 'primeng/carousel';

interface ShopCollection {
  title: string;
  description: string;
  accent: 'sunrise' | 'twilight' | 'lagoon';
  products: Array<Product>;
}

@Component({
  selector: 'page-shop',
  standalone: true,
  imports: [
    SpinnerComponent,
    ContentHeaderModule,
    ProductItemComponent,
    CarouselModule,
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent extends BaseLoadComponent<Array<Product>> {
  protected service = inject(ShopApiService);

  public highlightProduct?: Product;
  public featuredProducts: Array<Product> = [];
  public trendingProducts: Array<Product> = [];
  public essentialsProducts: Array<Product> = [];
  public collections: Array<ShopCollection> = [];

  public carouselResponsiveOptions = [
    {
      breakpoint: '1400px',
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: '1200px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  getData(): Observable<Array<Product>> {
    return this.service.getProducts();
  }

  override afterLoadData(data: Array<Product>): void {
    if (!data?.length) {
      return;
    }

    this.highlightProduct = data[0];
    this.featuredProducts = data.slice(0, 6);
    this.trendingProducts = data.filter((_, index) => index % 2 === 0).slice(0, 8);
    this.essentialsProducts = data.filter((_, index) => index % 2 === 1).slice(0, 8);

    this.collections = [
      {
        title: 'Capsule Collections',
        description: 'Limited-edition drops inspired by the KEP community.',
        accent: 'sunrise',
        products: this.featuredProducts.slice(0, 4),
      },
      {
        title: 'Studio Essentials',
        description: 'Comfort-first staples designed for hybrid work days.',
        accent: 'twilight',
        products: this.trendingProducts.slice(0, 4),
      },
      {
        title: 'Weekend Escapes',
        description: 'Lightweight layers and accessories for spontaneous plans.',
        accent: 'lagoon',
        products: this.essentialsProducts.slice(0, 4),
      },
    ];
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
