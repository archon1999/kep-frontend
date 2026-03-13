import useSWR from 'swr';
import { ShopProduct } from '../domain/entities/product.entity';
import { ShopOrder } from '../domain/entities/order.entity';
import { HttpShopRepository } from '../data-access/repository/http.shop.repository';

const repository = new HttpShopRepository();

export const useShopProducts = () =>
  useSWR<ShopProduct[]>(['shop-products'], () => repository.getProducts(), {
    suspense: false,
  });

export const useShopOrders = (enabled = true) =>
  useSWR<ShopOrder[]>(enabled ? ['shop-orders'] : null, () => repository.getOrders(), {
    suspense: false,
    keepPreviousData: true,
  });
