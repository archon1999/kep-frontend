import { ShopProduct } from '../entities/product.entity';
import {
  ShopOrder,
  ShopReview,
  CreateShopOrderPayload,
  CreateShopReviewPayload,
} from '../entities/order.entity';

export interface ShopRepository {
  getProducts: () => Promise<ShopProduct[]>;
  getOrders: () => Promise<ShopOrder[]>;
  createOrder: (payload: CreateShopOrderPayload) => Promise<ShopOrder>;
  createReview: (orderId: number, payload: CreateShopReviewPayload) => Promise<ShopReview>;
}
