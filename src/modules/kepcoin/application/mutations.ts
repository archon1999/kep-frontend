import useSWRMutation from 'swr/mutation';
import { HttpKepcoinRepository } from '../data-access/repository/http.kepcoin.repository';
import type { OneTimeTaskStartResponse, OneTimeTaskVerifyResponse } from '../domain/entities/kepcoin.entity';

const repository = new HttpKepcoinRepository();

export const useStartTask = () =>
  useSWRMutation<OneTimeTaskStartResponse, Error, readonly unknown[], string>(
    ['kepcoin-task-start'],
    (_, { arg }) => repository.startTask(arg),
  );

export const useVerifyTask = () =>
  useSWRMutation<OneTimeTaskVerifyResponse, Error, readonly unknown[], string>(
    ['kepcoin-task-verify'],
    (_, { arg }) => repository.verifyTask(arg),
  );
