import { ShopOrder } from '../../domain/entities/order.entity';

type ShopApiReview = {
  stars: number;
  created: string;
  updated: string;
};

type ShopApiOrder = {
  id: number;
  status: ShopOrder['status'];
  kepcoin_value?: number;
  kepcoinValue?: number;
  product_id?: number;
  productId?: number;
  variant_id?: number;
  variantId?: number;
  product_title?: string;
  productTitle?: string;
  color_name?: string;
  colorName?: string;
  size_name?: string;
  sizeName?: string;
  image_url?: string;
  imageUrl?: string;
  country: ShopOrder['country'];
  shipping_type?: ShopOrder['shippingType'];
  shippingType?: ShopOrder['shippingType'];
  full_name?: string;
  fullName?: string;
  phone: string;
  address: string;
  telegram_username?: string;
  telegramUsername?: string;
  tracking_code?: string | null;
  trackingCode?: string | null;
  admin_note?: string | null;
  adminNote?: string | null;
  created: string;
  updated: string;
  can_review?: boolean;
  canReview?: boolean;
  review?: ShopApiReview;
};

export const mapApiOrderToDomain = (order: ShopApiOrder): ShopOrder => ({
  id: order.id,
  status: order.status,
  kepcoinValue: order.kepcoinValue ?? order.kepcoin_value ?? 0,
  productId: order.productId ?? order.product_id,
  variantId: order.variantId ?? order.variant_id,
  productTitle: order.productTitle ?? order.product_title ?? '',
  colorName: order.colorName ?? order.color_name ?? '',
  sizeName: order.sizeName ?? order.size_name ?? '',
  imageUrl: order.imageUrl ?? order.image_url ?? '',
  country: order.country,
  shippingType: order.shippingType ?? order.shipping_type ?? 'BTS',
  fullName: order.fullName ?? order.full_name ?? '',
  phone: order.phone,
  address: order.address,
  telegramUsername: order.telegramUsername ?? order.telegram_username ?? '',
  trackingCode: order.trackingCode ?? order.tracking_code,
  adminNote: order.adminNote ?? order.admin_note,
  created: order.created,
  updated: order.updated,
  canReview: Boolean(order.canReview ?? order.can_review),
  review: order.review
    ? {
        stars: order.review.stars,
        created: order.review.created,
        updated: order.review.updated,
      }
    : undefined,
});
