import { useEffect, useState } from 'react';
import { diffDateTime, formatCountdownClock } from 'shared/lib/dateTime';
import { ContestStatus } from '../../domain/entities/contest-status';

export const useContestCountdown = (finishTime?: string, status?: ContestStatus) => {
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    if (!finishTime || status !== ContestStatus.Already) {
      setTimeLeft('');
      return;
    }
    const update = () => {
      const remaining = diffDateTime(finishTime, undefined, 'millisecond');
      setTimeLeft(remaining > 0 ? formatCountdownClock(remaining) : '');
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [finishTime, status]);
  return timeLeft;
};
