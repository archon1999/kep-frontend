import { type ReactNode, useId, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  Popover,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { getResourceByUsername, resources } from 'app/routes/resources';
import { getRankColor } from 'app/theme/colors/medals';
import { overlayPaperStyles } from 'app/theme/styles/overlays';
import { useUserDetails, useUserRatings } from 'modules/users/application/queries';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import CountryFlagIcon from 'shared/components/common/CountryFlagIcon';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import Streak from 'shared/components/rating/Streak';
import { formatDateTimeOrOriginal } from 'shared/lib/dateTime';
import { createNumberFormatter } from 'shared/lib/numberFormat';

interface UserPopoverProps {
  username: string;
  children: ReactNode;
  countryCode?: string;
  fullName?: string;
  avatar?: string;
  streak?: number | null;
  sx?: object;
  onViewDetails?: () => void;
}
const ratingConfig = [
  { key: 'skillsRating', labelKey: 'users.columns.skills' },
  { key: 'activityRating', labelKey: 'users.columns.activity' },
  { key: 'contestsRating', labelKey: 'users.columns.contests' },
  { key: 'challengesRating', labelKey: 'users.columns.challenges' },
] as const;

const UserPopover = ({
  username,
  children,
  countryCode,
  fullName,
  avatar,
  streak,
  sx = {},
  onViewDetails,
}: UserPopoverProps) => {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const popoverId = useId();
  const open = Boolean(anchorEl);
  const details = useUserDetails(open ? username : null);
  const ratings = useUserRatings(open ? username : null);
  const user = details.data;
  const name = user ? [user.firstName, user.lastName].filter(Boolean).join(' ') : fullName;
  const userAvatar = user?.avatar ?? avatar;
  const country = countryCode ?? user?.country;
  const streakValue = user?.streak ?? streak;
  const formatter = useMemo(
    () => createNumberFormatter({ maximumFractionDigits: 1 }),
    [i18n.resolvedLanguage],
  );
  const lastSeen = user?.lastSeen
    ? formatDateTimeOrOriginal(user.lastSeen, 'compactDateTime')
    : undefined;
  const close = () => setAnchorEl(null);

  return (
    <>
      <Box
        component="span"
        role="button"
        tabIndex={0}
        aria-label={username}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? popoverId : undefined}
        onClick={(event) => {
          event.stopPropagation();
          setAnchorEl(event.currentTarget);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.stopPropagation();
            setAnchorEl(event.currentTarget);
          }
        }}
        sx={{
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          minWidth: 0,
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: 4,
          },
          ...sx,
        }}
      >
        {children}
      </Box>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            id: popoverId,
            role: 'dialog',
            'aria-label': username,
            sx: (theme) => ({
              ...overlayPaperStyles(theme),
              width: 360,
              maxWidth: 'calc(100vw - 32px)',
              maxHeight: 'calc(100dvh - 24px)',
              overflowY: 'auto',
            }),
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            minHeight: 128,
            p: 2.5,
            display: 'flex',
            alignItems: 'center',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          {user?.coverPhoto && (
            <Box
              component="img"
              src={user.coverPhoto}
              alt=""
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.12,
              }}
            />
          )}
          <PatternArtwork
            kind="profile"
            sx={{
              position: 'absolute',
              right: 12,
              bottom: 4,
              width: 110,
              opacity: 0.18,
              pointerEvents: 'none',
            }}
          />
          <Stack
            direction="row"
            gap={1.5}
            alignItems="center"
            sx={{ width: '100%', position: 'relative', minWidth: 0 }}
          >
            <Badge
              overlap="circular"
              variant="dot"
              color={user?.isOnline ? 'success' : 'default'}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              sx={{
                '& .MuiBadge-badge': {
                  boxShadow: '0 0 0 2px var(--aurora-palette-background-default)',
                },
              }}
            >
              <Avatar src={userAvatar} alt="" sx={{ width: 52, height: 52, fontSize: 22 }}>
                {username[0]?.toUpperCase()}
              </Avatar>
            </Badge>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" gap={0.75} alignItems="center">
                <Typography variant="body1" fontWeight={700} noWrap sx={{ minWidth: 0 }}>
                  {username}
                </Typography>
                {country && <CountryFlagIcon code={country} size={16} />}
              </Stack>
              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                sx={{ display: 'block', minHeight: 18 }}
              >
                {name || (details.isLoading ? <Skeleton width="75%" /> : ' ')}
              </Typography>
              <Stack direction="row" alignItems="center" gap={1.25} sx={{ minHeight: 20, mt: 0.5 }}>
                <Tooltip title={lastSeen ? `${t('users.columns.lastSeen')}: ${lastSeen}` : ''}>
                  <Typography
                    variant="caption"
                    color={user?.isOnline ? 'success.main' : 'text.secondary'}
                    noWrap
                    sx={{ fontSize: 10 }}
                  >
                    {details.isLoading ? (
                      <Skeleton width={60} />
                    ) : user?.isOnline ? (
                      t('users.popover.online')
                    ) : (
                      (lastSeen ?? t('users.popover.offline'))
                    )}
                  </Typography>
                </Tooltip>
                {typeof streakValue === 'number' && streakValue > 0 && (
                  <Streak
                    streak={streakValue}
                    iconSize={16}
                    textVariant="metric"
                    fontWeight={500}
                    sx={{ '& .MuiTypography-root': { fontSize: 12 } }}
                  />
                )}
              </Stack>
            </Box>
            <IconButton
              size="small"
              aria-label={t('common.close')}
              onClick={close}
              sx={{ alignSelf: 'flex-start', mr: -1, mt: -0.75 }}
            >
              <IconifyIcon icon="mdi:close" fontSize={17} />
            </IconButton>
          </Stack>
        </Box>
        {(details.error || ratings.error) && (
          <Alert
            severity="warning"
            sx={{ mx: 2, mt: 2 }}
            action={
              <Button
                size="small"
                onClick={() => void Promise.allSettled([details.mutate(), ratings.mutate()])}
              >
                {t('common.retry')}
              </Button>
            }
          >
            {t('common.loadFailed')}
          </Alert>
        )}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
          {ratingConfig.map(({ key, labelKey }, index) => {
            const stat = ratings.data?.[key];
            const number = stat?.value == null ? undefined : Number(stat.value);
            return (
              <Box
                key={key}
                sx={{
                  px: 2,
                  py: 1.5,
                  minWidth: 0,
                  borderBottom: 1,
                  borderColor: 'divider',
                  ...(index % 2 === 0 ? { borderRight: 1, borderRightColor: 'divider' } : {}),
                }}
              >
                <Typography variant="label" color="text.secondary" sx={{ fontSize: 10 }}>
                  {t(labelKey)}
                </Typography>
                <Stack
                  direction="row"
                  gap={0.75}
                  alignItems="center"
                  sx={{ minHeight: 28, mt: 0.75 }}
                >
                  {key === 'contestsRating' && (
                    <Box component="span" sx={{ display: 'inline-flex', width: 22, flexShrink: 0 }}>
                      {ratings.isLoading ? (
                        <Skeleton variant="rectangular" width={22} height={22} />
                      ) : (
                        <ContestsRatingChip title={stat?.title} imgSize={22} />
                      )}
                    </Box>
                  )}
                  {key === 'challengesRating' && (
                    <Box component="span" sx={{ display: 'inline-flex', width: 36, flexShrink: 0 }}>
                      {ratings.isLoading ? (
                        <Skeleton variant="rectangular" width={36} height={22} />
                      ) : (
                        <ChallengesRatingChip title={stat?.title} />
                      )}
                    </Box>
                  )}
                  <Typography variant="metric" sx={{ fontSize: 21, minWidth: 0 }}>
                    {ratings.isLoading ? (
                      <Skeleton width={80} />
                    ) : number !== undefined && Number.isFinite(number) ? (
                      formatter.format(number)
                    ) : (
                      t('users.emptyValue')
                    )}
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  color={getRankColor(stat?.rank)}
                  sx={{ display: 'block', minHeight: 17, mt: 0.25, fontSize: 10 }}
                >
                  {ratings.isLoading ? (
                    <Skeleton width={40} />
                  ) : stat?.rank != null ? (
                    `#${formatter.format(stat.rank)}`
                  ) : (
                    t('users.emptyValue')
                  )}
                </Typography>
              </Box>
            );
          })}
        </Box>
        <Box sx={{ p: 2 }}>
          <Button
            component={RouterLink}
            to={getResourceByUsername(resources.UserProfile, username)}
            variant="contained"
            size="small"
            fullWidth
            endIcon={<IconifyIcon icon="mdi:arrow-right" />}
            onClick={() => {
              close();
              onViewDetails?.();
            }}
            sx={{ justifyContent: 'space-between', minHeight: 40 }}
          >
            {t('users.popover.viewDetails')}
          </Button>
        </Box>
      </Popover>
    </>
  );
};
export default UserPopover;
