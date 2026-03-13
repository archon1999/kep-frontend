export interface ShopProductImage {
  name?: string;
  url: string;
}

export interface ShopProductSize {
  name: string;
  stock: number;
  variantId: number;
  isAvailable: boolean;
}

export interface ShopProductColor {
  name: string;
  color: string;
  images?: ShopProductImage[];
  sizes: ShopProductSize[];
}

export interface ShopProduct {
  id: number;
  title: string;
  description: string;
  kepcoin: number;
  images: ShopProductImage[];
  colors: ShopProductColor[];
  totalStock: number;
  ratingAverage: number | null;
  ratingCount: number;
}
