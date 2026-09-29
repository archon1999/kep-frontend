import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { rewardCountdown } from 'modules/keppy-world/application/world-state';

export default function PointRewardStatus({
  readyAt,
  timeOffset = 0,
}: {
  readyAt?: string | null;
  timeOffset?: number;
}) {
  const { t } = useTranslation();
  const [now, setNow] = useState(() => Date.now() + timeOffset);
  useEffect(() => {
    const update = () => setNow(Date.now() + timeOffset);
    update();
    if (!readyAt) return;
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [readyAt, timeOffset]);
  if (!readyAt || Date.parse(readyAt) <= now) return null;
  return (
    <Typography
      component="span"
      sx={{
        display: 'block',
        fontSize: 12,
        color: 'text.secondary',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {t('keppyWorld.pointCooldown', { time: rewardCountdown(readyAt, now) })}
    </Typography>
  );
}
