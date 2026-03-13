import useSWRMutation from 'swr/mutation';

import { HttpShopRepository } from '../data-access/repository/http.shop.repository';
import { CreateShopOrderPayload, CreateShopReviewPayload } from '../domain/entities/order.entity';

const repository = new HttpShopRepository();

export const useCreateShopOrder = () =>
  useSWRMutation(
    'shop-create-order',
    (_, { arg }: { arg: CreateShopOrderPayload }) => repository.createOrder(arg),
  );

export const useCreateShopReview = () =>
  useSWRMutation(
    'shop-create-review',
    (_, { arg }: { arg: { orderId: number; payload: CreateShopReviewPayload } }) =>
      repository.createReview(arg.orderId, arg.payload),
  );
