import dayjs from 'dayjs';
import { Box, Button, Chip, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from 'app/providers/AuthProvider';
import { resources } from 'app/routes/resources';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { cssVarRgba } from 'shared/lib/utils';
import { useKepCoverSummary } from 'modules/kep-cover/application/queries';

const KepCoverAnnouncementSection = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { data, isLoading } = useKepCoverSummary();

  if (isLoading && !data) {
    return <Skeleton variant="rounded" height={220} />;
  }

  if (!data || data.status !== 'active' || !data.id) {
    return null;
  }

  return (
    <Box
      sx={(theme) => ({
        overflow: 'hidden',
        position: 'relative',
        background: `linear-gradient(135deg, ${cssVarRgba(theme.vars.palette.warning.mainChannel, 0.16)}, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.1)})`,
      })}
    >
      <Box
        sx={(theme) => ({
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at top left, ${cssVarRgba(theme.vars.palette.warning.mainChannel, 0.22)}, transparent 38%), radial-gradient(circle at bottom right, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.16)}, transparent 35%)`,
          pointerEvents: 'none',
        })}
      />

      <Stack spacing={2.5} sx={{ ...responsivePagePaddingSx, position: 'relative' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <Chip label={t('kepCover.home.live')} color="warning" variant="filled" />
              <Typography variant="body2" color="text.secondary">
                {t('kepCover.home.endsAt', {
                  date: data.endTime ? dayjs(data.endTime).format('DD MMM, HH:mm') : '-',
                })}
              </Typography>
            </Stack>

            <Typography variant="h4" fontWeight={800}>
              {data.title}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720 }}>
              {t('kepCover.home.subtitle')}
            </Typography>
          </Stack>

          <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
            <Typography variant="body2" color="text.secondary">
              {t('kepCover.home.entries', { count: data.totalEntries })}
            </Typography>
            {currentUser ? (
              <Typography variant="body2" fontWeight={700}>
                {t('kepCover.home.remainingVotes', {
                  count: data.remainingVotes,
                  total: data.maxVoteCount,
                })}
              </Typography>
            ) : (
              <Typography variant="body2" fontWeight={700}>
                {t('kepCover.home.signInToVote')}
              </Typography>
            )}
            <Button component={RouterLink} to={resources.KepCover} variant="contained" color="warning">
              {t('kepCover.home.cta')}
            </Button>
          </Stack>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
            gap: 2,
          }}
        >
          {data.topEntries.map((entry, index) => (
            <Box
              key={entry.id}
              sx={{
                position: 'relative',
                aspectRatio: '16 / 8',
                borderRadius: 3,
                overflow: 'hidden',
                backgroundImage: `url(${entry.coverPhoto})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.8) 100%)',
                }}
              />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-end"
                sx={{ position: 'absolute', inset: 0, p: 2, color: 'common.white' }}
              >
                <Box>
                  <Typography variant="overline" color="rgba(255,255,255,0.75)">
                    #{index + 1}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={800} noWrap>
                    {entry.user.username}
                  </Typography>
                </Box>

                <Chip label={`${entry.likesCount} votes`} color="error" variant="filled" />
              </Stack>
            </Box>
          ))}
        </Box>
      </Stack>
    </Box>
  );
};

export default KepCoverAnnouncementSection;
