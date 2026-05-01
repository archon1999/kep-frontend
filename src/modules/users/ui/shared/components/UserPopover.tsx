import { ReactNode, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Popover,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { getResourceByUsername, resources } from 'app/routes/resources';
import { useUserDetails, useUserRatings } from 'modules/users/application/queries';
import { UserRatingInfo } from 'modules/users/domain/entities/user.entity';
import CountryFlagIcon from 'shared/components/common/CountryFlagIcon';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import Streak from 'shared/components/rating/Streak';

interface UserPopoverProps {
  username: string;
  children: ReactNode;
  countryCode?: string;
  fullName?: string;
  avatar?: string;
  streak?: number | null;
  sx?: object;
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
}: UserPopoverProps) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = Boolean(anchorEl);
  const { data: userDetails, isLoading: isDetailsLoading } = useUserDetails(open ? username : null);
  const { data: userRatings, isLoading: isRatingsLoading } = useUserRatings(open ? username : null);

  const displayName = useMemo(() => {
    if (userDetails) {
      return [userDetails.firstName, userDetails.lastName].filter(Boolean).join(' ');
    }

    return fullName ?? '';
  }, [fullName, userDetails]);

  const resolvedCountryCode = countryCode ?? (userDetails?.country as string | undefined);

  const ratingStats = useMemo(
    () =>
      ratingConfig
        .map(({ key, labelKey }) => {
          const stat = userRatings?.[key] as UserRatingInfo | undefined;
          return {
            key,
            label: t(labelKey),
            stat,
          };
        })
        .filter((item) => Boolean(item.stat)),
    [t, userRatings],
  );

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const profileLink = getResourceByUsername(resources.UserProfile, username);

  const streakValue = userDetails?.streak ?? streak ?? 0;
  const coverPhoto = userDetails?.coverPhoto;
  const userAvatar = userDetails?.avatar ?? avatar;

  return (
    <>
      <Box
        component="span"
        onClick={handleOpen}
        sx={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', minWidth: 0, ...sx }}
      >
        {children}
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        disableRestoreFocus
        slotProps={{ paper: { sx: { width: 360, maxWidth: '90vw' } } }}
      >
        <Card>
          <Box sx={{ height: 200, backgroundColor: 'background.neutral' }}>
            {coverPhoto ? (
              <Box
                component="img"
                src={coverPhoto}
                alt={`${username} cover`}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Skeleton variant="rectangular" width="100%" height="100%" />
            )}
          </Box>

          <CardContent>
            <Stack direction="column" spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Tooltip
                  arrow
                  title={
                    userDetails?.lastSeen
                      ? `${t('users.columns.lastSeen')}: ${userDetails.lastSeen}`
                      : ''
                  }
                  disableInteractive
                >
                  <Badge
                    overlap="circular"
                    variant="dot"
                    color={userDetails?.isOnline ? 'success' : 'default'}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  >
                    {userAvatar ? (
                      <Avatar src={userAvatar} alt={username} sx={{ width: 56, height: 56 }} />
                    ) : (
                      <Skeleton variant="circular" width={56} height={56} />
                    )}
                  </Badge>
                </Tooltip>

                <Stack direction="column" spacing={0.5} minWidth={0}>
                  <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
                    {isDetailsLoading ? (
                      <Skeleton variant="text" width={140} />
                    ) : (
                      <Typography variant="subtitle1" fontWeight={700} noWrap>
                        {username}
                      </Typography>
                    )}

                    {resolvedCountryCode && (
                      <CountryFlagIcon code={resolvedCountryCode} size={18} />
                    )}
                  </Stack>

                  {displayName ? (
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {displayName}
                    </Typography>
                  ) : (
                    isDetailsLoading && <Skeleton variant="text" width={120} />
                  )}

                  {streakValue > 0 && <Streak streak={streakValue} iconSize={18} spacing={0.5} />}
                </Stack>
              </Stack>

              <Divider />

              <Grid container spacing={1.5}>
                {ratingStats.length === 0 && isRatingsLoading && (
                  <>
                    <Grid size={3}>
                      <Skeleton variant="text" width="80%" />
                      <Skeleton variant="text" width="60%" />
                    </Grid>
                    <Grid size={3}>
                      <Skeleton variant="text" width="80%" />
                      <Skeleton variant="text" width="60%" />
                    </Grid>
                    <Grid size={3}>
                      <Skeleton variant="text" width="80%" />
                      <Skeleton variant="text" width="60%" />
                    </Grid>
                    <Grid size={3}>
                      <Skeleton variant="text" width="80%" />
                      <Skeleton variant="text" width="60%" />
                    </Grid>
                  </>
                )}

                {ratingStats.map(({ key, label, stat }) => (
                  <Grid key={key} size={3}>
                    <Stack direction="column" spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        {label}
                      </Typography>
                      <Stack direction="row" spacing={0.5}>
                        {stat?.title && (
                          <>
                            {key === 'contestsRating' ? (
                              <ContestsRatingChip title={stat.title} imgSize={20} />
                            ) : key === 'challengesRating' ? (
                              <ChallengesRatingChip title={stat.title} />
                            ) : (
                              <Typography variant="caption" color="text.secondary" noWrap>
                                {stat.title}
                              </Typography>
                            )}
                          </>
                        )}

                        <Typography variant="subtitle2" fontWeight={700}>
                          {stat?.value ?? t('users.emptyValue')}
                        </Typography>
                      </Stack>
                      {typeof stat?.rank === 'number' && (
                        <Typography variant="caption" color="text.secondary">
                          #{stat.rank}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>
                ))}
              </Grid>

              <Button
                component={RouterLink}
                to={profileLink}
                variant="text"
                size="small"
                fullWidth
                onClick={handleClose}
              >
                {t('users.popover.viewDetails')}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Popover>
    </>
  );
};

export default UserPopover;
