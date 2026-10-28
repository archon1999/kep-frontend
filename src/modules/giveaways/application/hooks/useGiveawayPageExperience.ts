import { useEffect, useState } from 'react';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { useGiveawayExperience } from 'modules/giveaways/application/mutations';
import { useGiveaway } from 'modules/giveaways/application/queries';
import { remainingSeconds } from 'modules/giveaways/domain/utils/roulette';

export const useGiveawayPageExperience = (id: string, username: string) => {
  const { data, error, mutate } = useGiveaway(id, username);
  const experience = useGiveawayExperience(id, data, mutate);
  const [now, setNow] = useState(Date.now());
  useDocumentTitle('giveaways.pageTitle');
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(timer);
  }, []);

  const playing = Boolean(experience.animation && !experience.animationFinished);
  const reveal =
    data?.status === 'finished' &&
    !playing &&
    Boolean(data.animationSeen || experience.animationFinished || !data.winner);
  const seconds = data ? remainingSeconds(data.scheduledAt, now + data.serverOffsetMs) : 0;
  const duration = [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60];
  return { data, error, mutate, experience, playing, reveal, seconds, duration };
};
