import { Box, Stack, StackProps, Typography } from '@mui/material';
import fire1 from 'shared/assets/images/icons/fire-1.webp';
import fire2 from 'shared/assets/images/icons/fire-2.webp';
import fire3 from 'shared/assets/images/icons/fire-3.webp';
import fire4 from 'shared/assets/images/icons/fire-4.webp';

const getStreakIcon = (streak: number, maxStreak: number) => {
  if (streak === 0) {
    return maxStreak === 0 ? fire1 : fire2;
  }

  if (streak < 7) {
    return fire3;
  }

  return fire4;
};

interface StreakProps extends StackProps {
  streak?: number | null;
  maxStreak?: number | null;
  iconSize?: number;
  fallback?: string;
}

const Streak = ({
  streak,
  maxStreak,
  iconSize = 20,
  fallback = '--',
  spacing = 0.75,
  alignItems = 'center',
  direction = 'row',
  ...stackProps
}: StreakProps) => {
  const numericStreak = typeof streak === 'number' ? streak : 0;
  const numericMaxStreak = typeof maxStreak === 'number' ? maxStreak : 0;
  const displayValue = typeof streak === 'number' ? streak : fallback;
  const streakIcon = getStreakIcon(numericStreak, numericMaxStreak);

  return (
    <Stack direction={direction} spacing={spacing} alignItems={alignItems} {...stackProps}>
      <Box
        component="img"
        src={streakIcon}
        alt="Daily streak"
        sx={{ width: iconSize, height: iconSize }}
      />
      <Typography variant="body2" fontWeight={700} color="text.primary">
        {displayValue}
      </Typography>
    </Stack>
  );
};

export default Streak;
