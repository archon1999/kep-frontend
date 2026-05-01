import { ShopProduct } from '../../domain/entities/product.entity';
import {
  ShopOrder,
  ShopReview,
  CreateShopOrderPayload,
  CreateShopReviewPayload,
} from '../../domain/entities/order.entity';
import { ShopRepository } from '../../domain/ports/shop.repository';
import { shopApiClient } from '../api/shop.client';
import { mapApiOrderToDomain } from '../mappers/order.mapper';
import { mapApiProductToDomain } from '../mappers/product.mapper';

export class HttpShopRepository implements ShopRepository {
  async getProducts(): Promise<ShopProduct[]> {
    const products = await shopApiClient.listProducts();
    return (products ?? []).map(mapApiProductToDomain);
  }

  async getOrders(): Promise<ShopOrder[]> {
    const orders = await shopApiClient.listOrders();
    return (orders ?? []).map(mapApiOrderToDomain);
  }

  async createOrder(payload: CreateShopOrderPayload): Promise<ShopOrder> {
    const order = await shopApiClient.createOrder(payload);
    return mapApiOrderToDomain(order);
  }

  async createReview(orderId: number, payload: CreateShopReviewPayload): Promise<ShopReview> {
    const review = await shopApiClient.createReview(orderId, payload);
    return {
      stars: review.stars,
      created: review.created,
      updated: review.updated,
    };
  }
}
