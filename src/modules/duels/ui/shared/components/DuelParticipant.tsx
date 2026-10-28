import { useTranslation } from 'react-i18next';
import { Avatar, Stack, Tooltip, Typography } from '@mui/material';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';

type Participant = {
  username: string;
  displayName?: string;
  avatar?: string | null;
  isBot?: boolean;
  ratingTitle?: string;
  contestsRatingTitle?: string;
  contestsRating?: number;
};

const DuelParticipant = ({
  player,
  compact = false,
  hideAvatarOnMobile = false,
  align = 'start',
}: {
  player: Participant;
  compact?: boolean;
  hideAvatarOnMobile?: boolean;
  align?: 'start' | 'end';
}) => {
  const { t, i18n } = useTranslation();
  const title = player.ratingTitle ?? player.contestsRatingTitle;
  const content = (
    <Stack
      direction={align === 'end' ? 'row-reverse' : 'row'}
      gap={1.25}
      alignItems="center"
      sx={{ minWidth: 0, maxWidth: '100%' }}
    >
      {!compact && (
        <Avatar
          src={player.avatar ?? undefined}
          alt=""
          sx={{
            width: 36,
            height: 36,
            display: hideAvatarOnMobile ? { xs: 'none', sm: 'flex' } : 'flex',
          }}
        >
          {player.username[0]}
        </Avatar>
      )}
      <Stack
        gap={0.4}
        sx={{ minWidth: 0, alignItems: align === 'end' ? 'flex-end' : 'flex-start' }}
      >
        <Stack direction="row" gap={0.75} alignItems="center" sx={{ minWidth: 0 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            noWrap
            title={player.displayName || player.username}
          >
            {player.displayName || player.username}
          </Typography>
          {player.isBot && (
            <Tooltip title={t('duels.bot')}>
              <IconifyIcon
                icon="mdi:robot-outline"
                sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }}
              />
            </Tooltip>
          )}
        </Stack>
        {(title || typeof player.contestsRating === 'number') && (
          <Stack direction="row" gap={0.75} alignItems="center">
            {title && <ContestsRatingChip title={title} imgSize={20} />}
            {typeof player.contestsRating === 'number' && (
              <Typography variant="metric" color="text.secondary" sx={{ fontSize: 13 }}>
                {player.contestsRating.toLocaleString(i18n.language)}
              </Typography>
            )}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
  return player.isBot ? (
    content
  ) : (
    <UserPopover username={player.username} avatar={player.avatar ?? undefined}>
      {content}
    </UserPopover>
  );
};

export default DuelParticipant;
