import axiosFetcher from 'shared/services/axios/axiosFetcher';
import { CreateShopOrderPayload, CreateShopReviewPayload } from '../../domain/entities/order.entity';

const PRODUCTS_ENDPOINT = '/api/products/';
const ORDERS_ENDPOINT = '/api/shop/orders/';

export const shopApiClient = {
  listProducts: () => axiosFetcher([PRODUCTS_ENDPOINT, { method: 'get' }]),
  listOrders: () => axiosFetcher([ORDERS_ENDPOINT, { method: 'get' }]),
  createOrder: (payload: CreateShopOrderPayload) =>
    axiosFetcher([ORDERS_ENDPOINT, { method: 'post' }], { arg: payload }),
  createReview: (orderId: number, payload: CreateShopReviewPayload) =>
    axiosFetcher([`${ORDERS_ENDPOINT}${orderId}/review/`, { method: 'post' }], { arg: payload }),
};
