export type ShopOrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';

export interface ShopReview {
  stars: number;
  created: string;
  updated: string;
}

export interface ShopOrder {
  id: number;
  status: ShopOrderStatus;
  kepcoinValue: number;
  productId?: number;
  variantId?: number;
  productTitle: string;
  colorName: string;
  sizeName: string;
  imageUrl: string;
  country: 'UZB';
  shippingType: 'BTS';
  fullName: string;
  phone: string;
  address: string;
  telegramUsername: string;
  trackingCode?: string | null;
  adminNote?: string | null;
  created: string;
  updated: string;
  canReview: boolean;
  review?: ShopReview;
}

export interface CreateShopOrderPayload {
  variant_id: number;
  country: 'UZB';
  shipping_type: 'BTS';
  full_name: string;
  phone: string;
  address: string;
  telegram_username: string;
}

export interface CreateShopReviewPayload {
  stars: number;
}
