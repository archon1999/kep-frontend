import { useTranslation } from 'react-i18next';
import { Box, IconButton, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import { contentGridSx, contentInsetSx } from 'app/theme/styles/content';
import { UserDetails, UserRatings } from 'modules/users/domain/entities/user.entity';
import KepIcon from 'shared/components/base/KepIcon';
import StatusAvatar from 'shared/components/base/StatusAvatar';
import CountryFlagIcon from 'shared/components/common/CountryFlagIcon';
import MixedText from 'shared/components/common/MixedText';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import Streak from 'shared/components/rating/Streak';
import { KepIconName } from 'shared/config/icons';
import ProfileFollowButton from './user-profile/ProfileFollowButton';

const metrics: Array<{ key: keyof UserRatings; label: string; icon: KepIconName }> = [
  { key: 'skillsRating', label: 'users.columns.skills', icon: 'rating' },
  { key: 'activityRating', label: 'users.columns.activity', icon: 'todo' },
  { key: 'contestsRating', label: 'users.columns.contests', icon: 'contests' },
  { key: 'challengesRating', label: 'users.columns.challenges', icon: 'challenges' },
];

const ProfileHeader = ({
  user,
  ratings,
  ratingsLoading,
  onPreviewCover,
}: {
  user: UserDetails;
  ratings?: UserRatings;
  ratingsLoading: boolean;
  onPreviewCover: () => void;
}) => {
  const { t } = useTranslation();
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
  const status = user.isOnline ? t('homePage.userActivity.onlineNow') : user.lastSeen;

  return (
    <Box component="header" sx={{ position: 'relative', isolation: 'isolate', overflow: 'hidden' }}>
      {user.coverPhoto && (
        <Box
          component="img"
          src={user.coverPhoto}
          alt=""
          aria-hidden="true"
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: -2,
            width: 1,
            height: 1,
            objectFit: 'cover',
            opacity: 0.12,
            pointerEvents: 'none',
          }}
        />
      )}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          opacity: 0.18,
          backgroundImage: 'radial-gradient(var(--kep-logo-ice) 1px, transparent 1px)',
          backgroundSize: '12px 12px',
          maskImage: 'linear-gradient(120deg, transparent 15%, black 100%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          ...contentInsetSx,
          py: { xs: 2.5, md: 3 },
        }}
      >
        <Stack direction="row" gap={{ xs: 2, md: 3 }} alignItems="center" sx={{ minWidth: 0 }}>
          <Tooltip title={status || ''}>
            <Box sx={{ flexShrink: 0 }}>
              <StatusAvatar
                src={user.avatar}
                alt={user.username}
                status={user.isOnline ? 'online' : 'offline'}
                sx={{ width: { xs: 64, md: 80 }, height: { xs: 64, md: 80 } }}
              >
                {user.username.slice(0, 1).toUpperCase()}
              </StatusAvatar>
            </Box>
          </Tooltip>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Stack direction="row" gap={1.5} alignItems="center">
              <Typography
                component="h1"
                sx={{
                  fontFamily: 'var(--kep-display-font)',
                  fontSize: { xs: 30, md: 44 },
                  minWidth: 0,
                  fontWeight: 500,
                  letterSpacing: '-.04em',
                  lineHeight: 1.15,
                  overflowWrap: 'anywhere',
                  background: 'linear-gradient(100deg, var(--kep-logo-sand), var(--kep-logo-ice))',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                <MixedText>{fullName || user.username}</MixedText>
              </Typography>
              <ProfileFollowButton username={user.username} isFollowing={user.isFollowing} />
            </Stack>
            <Stack direction="row" gap={1.5} flexWrap="wrap" alignItems="center" sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                @{user.username}
              </Typography>
              {user.country && <CountryFlagIcon code={user.country} size={20} />}
              {user.streak ? (
                <Streak
                  streak={user.streak}
                  maxStreak={user.maxStreak}
                  iconSize={18}
                  textVariant="body2"
                />
              ) : null}
              {user.isOnline && (
                <Typography variant="caption" color="success.main">
                  {t('homePage.userActivity.onlineNow')}
                </Typography>
              )}
            </Stack>
          </Box>
          {user.coverPhoto && (
            <Tooltip title={t('users.profile.previewCover')}>
              <IconButton
                size="small"
                onClick={onPreviewCover}
                aria-label={t('users.profile.previewCover')}
                sx={{ flexShrink: 0, alignSelf: 'flex-start', color: 'text.secondary' }}
              >
                <KepIcon name="view" fontSize={20} />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Box>
      <Box
        sx={[
          contentGridSx,
          {
            bgcolor: 'transparent',
            '& > *': { bgcolor: 'transparent' },
            borderTopWidth: 1,
            borderTopStyle: 'solid',
            borderColor: 'divider',
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(4, minmax(0, 1fr))',
            },
          },
        ]}
      >
        {metrics.map(({ key, label, icon }) => {
          const metric = ratings?.[key];
          return (
            <Box key={key} component="dl" sx={{ ...contentInsetSx, m: 0, py: { xs: 2, md: 2.5 } }}>
              <Stack component="dt" direction="row" gap={1} alignItems="center">
                <KepIcon name={icon} color="primary.main" fontSize={17} />
                <Typography component="span" variant="label" color="text.secondary">
                  {t(label)}
                </Typography>
              </Stack>
              <Stack
                component="dd"
                direction="row"
                gap={1}
                alignItems="center"
                flexWrap="wrap"
                sx={{ m: 0, mt: 1.25 }}
              >
                {ratingsLoading ? (
                  <Skeleton width={70} />
                ) : (
                  <>
                    {key === 'contestsRating' && (
                      <ContestsRatingChip title={metric?.title} imgSize={25} />
                    )}
                    {key === 'challengesRating' && <ChallengesRatingChip title={metric?.title} />}
                    <Typography variant="metric" sx={{ fontSize: { xs: 25, md: 32 } }}>
                      {metric?.value ?? '—'}
                    </Typography>
                    {metric?.rank != null && (
                      <Typography variant="caption" color="text.secondary">
                        #{metric.rank}
                      </Typography>
                    )}
                  </>
                )}
              </Stack>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default ProfileHeader;
