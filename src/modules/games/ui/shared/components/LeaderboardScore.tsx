import { useTranslation } from 'react-i18next';
import { Tooltip, Typography, type TypographyProps } from '@mui/material';
import type { LeaderboardPlayer } from 'modules/games/domain';
import { formatDateTime } from 'shared/lib/dateTime';

const LeaderboardScore = ({
  player,
  ...props
}: TypographyProps & { player: LeaderboardPlayer }) => {
  const { t } = useTranslation();
  const date = formatDateTime(player.achievedAt, 'compactDateTimeNoComma', '');
  const title = date ? t('games.scoreAchievedAt', { date }) : '';

  return (
    <Tooltip title={title} describeChild arrow>
      <Typography
        component="span"
        variant="body2"
        fontWeight={700}
        tabIndex={title ? 0 : undefined}
        {...props}
        sx={{ fontVariantNumeric: 'tabular-nums', cursor: title ? 'help' : undefined, ...props.sx }}
      >
        {player.score.toLocaleString()}
      </Typography>
    </Tooltip>
  );
};

export default LeaderboardScore;
