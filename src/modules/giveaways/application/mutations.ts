import { useEffect, useRef, useState } from 'react';
import type { KeyedMutator } from 'swr';
import { giveawaysRepository } from '../data-access/repository/giveaways.repository.impl';
import type { Giveaway } from '../domain/entities/giveaway.types';

export function useGiveawayExperience(
  id: string,
  data: Giveaway | undefined,
  mutate: KeyedMutator<Giveaway>,
) {
  const [animation, setAnimation] = useState<Giveaway | null>(null);
  const [animationFinished, setAnimationFinished] = useState(false);
  const [actionError, setActionError] = useState(false);
  const visitRequest = useRef<Promise<Giveaway> | null>(null);
  const animationRequest = useRef<Promise<Giveaway> | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;
    visitRequest.current ??= giveawaysRepository.visit(id);
    visitRequest.current
      .then((result) => {
        if (active) void mutate(result, { revalidate: false });
      })
      .catch(() => {
        if (active) setActionError(true);
      });
    return () => {
      active = false;
    };
  }, [id, mutate, retryCount]);

  useEffect(() => {
    if (!data || data.status === 'finished') return;
    const delay = Math.max(0, Date.parse(data.scheduledAt) - Date.now() - data.serverOffsetMs);
    const timer = window.setTimeout(
      () => {
        void mutate();
      },
      Math.min(delay + 25, 2147483647),
    );
    return () => window.clearTimeout(timer);
  }, [data?.scheduledAt, data?.serverOffsetMs, data?.status, mutate]);

  useEffect(() => {
    if (!data?.winner || (data.animationSeen && !animationRequest.current) || animationFinished)
      return;
    let active = true;
    animationRequest.current ??= giveawaysRepository.claimAnimation(id);
    animationRequest.current
      .then((result) => {
        if (!active) return;
        if (result.shouldAnimate) setAnimation(result);
        void mutate(result, { revalidate: false });
      })
      .catch(() => {
        if (active) setActionError(true);
      });
    return () => {
      active = false;
    };
  }, [id, data?.winner?.id, data?.animationSeen, animationFinished, mutate, retryCount]);

  const retry = () => {
    visitRequest.current = null;
    animationRequest.current = null;
    setActionError(false);
    setRetryCount((value) => value + 1);
    void mutate();
  };
  return {
    animation,
    animationFinished,
    actionError,
    retry,
    finishAnimation: () => setAnimationFinished(true),
  };
}
