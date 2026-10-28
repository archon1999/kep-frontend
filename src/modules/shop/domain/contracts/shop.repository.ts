import {
  CreateShopOrderPayload,
  CreateShopReviewPayload,
  ShopOrder,
  ShopReview,
} from '../entities/order.entity';
import { ShopProduct } from '../entities/product.entity';

export interface ShopRepository {
  getProducts: () => Promise<ShopProduct[]>;
  getOrders: () => Promise<ShopOrder[]>;
  createOrder: (payload: CreateShopOrderPayload) => Promise<ShopOrder>;
  createReview: (orderId: number, payload: CreateShopReviewPayload) => Promise<ShopReview>;
}
