import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import { useContestTopContestants } from 'modules/contests/application/queries';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';

const ContestPodium = ({ contestId }: { contestId: number }) => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useContestTopContestants(contestId, true);
  const leaders = (data ?? []).filter((row) => row.username || row.teamName).slice(0, 3);
  return (
    <Card variant="section" component="section">
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2.5 }}>
          <IconifyIcon icon="mdi:trophy-outline" sx={{ color: 'secondary.main', fontSize: 20 }} />
          <Typography component="h2" variant="label">
            {t('contests.topContestants.title')}
          </Typography>
        </Stack>
        {isLoading ? (
          <Skeleton height={70} />
        ) : error ? (
          <Typography role="alert" color="error.main">
            {t('contests.card.leadersError')}
          </Typography>
        ) : leaders.length ? (
          <Box
            component="ol"
            sx={{
              m: 0,
              p: 0,
              listStyle: 'none',
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
              gap: 2,
            }}
          >
            {leaders.map((leader, index) => (
              <Stack
                component="li"
                key={leader.username || leader.teamName}
                direction="row"
                gap={1.5}
                alignItems="center"
                sx={{ minWidth: 0 }}
              >
                <Typography
                  variant="metric"
                  sx={{
                    fontSize: 32,
                    color: ['var(--kep-gold)', 'var(--kep-silver)', 'var(--kep-bronze)'][index],
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </Typography>
                <Stack gap={0.75} sx={{ minWidth: 0 }}>
                  {leader.teamName ? (
                    <Typography variant="body2" fontWeight={600} sx={{ overflowWrap: 'anywhere' }}>
                      {leader.teamName}
                    </Typography>
                  ) : (
                    <UserPopover
                      username={leader.username}
                      fullName={leader.fullName}
                      countryCode={leader.country}
                    >
                      <Typography
                        component="button"
                        variant="body2"
                        sx={{
                          p: 0,
                          border: 0,
                          bgcolor: 'transparent',
                          color: 'text.primary',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontWeight: 600,
                          overflowWrap: 'anywhere',
                        }}
                      >
                        {leader.username}
                      </Typography>
                    </UserPopover>
                  )}
                  {leader.ratingTitle && (
                    <ContestsRatingChip title={leader.ratingTitle} imgSize={22} />
                  )}
                  {leader.teamName && leader.teamMembers?.length ? (
                    <Typography variant="caption" color="text.secondary">
                      {leader.teamMembers.map((member) => member.username).join(', ')}
                    </Typography>
                  ) : null}
                </Stack>
              </Stack>
            ))}
          </Box>
        ) : (
          <Typography color="text.secondary">{t('contests.topContestants.empty')}</Typography>
        )}
      </CardContent>
    </Card>
  );
};
export default ContestPodium;
