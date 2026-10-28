import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Alert, Box, Button, Skeleton, Stack, Typography } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import { type Hackathon, type HackathonStanding, HackathonStatus } from 'modules/hackathons/domain';
import { HackathonCountdownCard } from 'modules/hackathons/ui/shared';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import HackathonTopParticipants from './HackathonTopParticipants';

interface HackathonOverviewAsideProps {
  hackathon: Hackathon;
  totalPoints?: number;
  isProjectsLoading: boolean;
  onRegistration: () => void;
  isMutating: boolean;
  registrationError: boolean;
  standings?: HackathonStanding[];
  isStandingsLoading: boolean;
  standingsError?: unknown;
}
const HackathonOverviewAside = ({
  hackathon,
  totalPoints,
  isProjectsLoading,
  onRegistration,
  isMutating,
  registrationError,
  standings,
  isStandingsLoading,
  standingsError,
}: HackathonOverviewAsideProps) => {
  const { t } = useTranslation();
  const canChangeRegistration = hackathon.status === HackathonStatus.ALREADY;
  const finished = hackathon.status === HackathonStatus.FINISHED;
  return (
    <Stack direction="column" spacing={0}>
      <Box sx={{ px: 3, pt: 2, display: 'flex', justifyContent: 'center' }}>
        <PatternArtwork kind="hackathon" sx={{ width: 190 }} />
      </Box>
      <HackathonCountdownCard hackathon={hackathon} />
      <Stack direction="column" gap={1.5} sx={{ px: 3, pb: 3 }}>
        <Button
          component={RouterLink}
          to={getResourceById(resources.HackathonProjects, hackathon.id)}
          variant="contained"
          fullWidth
          endIcon={<span aria-hidden="true">↗</span>}
        >
          {t('hackathons.viewProjects')}
        </Button>
        {!finished && (
          <>
            <Button
              variant="outlined"
              color={hackathon.isRegistered ? 'neutral' : 'primary'}
              onClick={onRegistration}
              disabled={!canChangeRegistration || isMutating}
              loading={isMutating}
              fullWidth
            >
              {t(hackathon.isRegistered ? 'hackathons.unregister' : 'hackathons.register')}
            </Button>
            <Typography variant="body2" color="text.secondary">
              {t(
                hackathon.isRegistered
                  ? 'hackathons.registeredMessage'
                  : canChangeRegistration
                    ? 'hackathons.registrationMessage'
                    : 'hackathons.registrationOpensAtStart',
              )}
            </Typography>
          </>
        )}
        {registrationError && <Alert severity="error">{t('hackathons.registrationError')}</Alert>}
      </Stack>
      <Stack direction="column" gap={1.5} sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="label" color="text.secondary">
          {t('contests.typeInfo.scoringTitle')}
        </Typography>
        <Typography variant="subtitle2">{t('hackathons.scoringValue')}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
          {t('hackathons.scoringDescription')}
        </Typography>
        {(totalPoints !== undefined || isProjectsLoading) && (
          <Stack direction="row" gap={2} alignItems="center" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">
              {t('hackathons.maxPoints')}
            </Typography>
            {isProjectsLoading ? (
              <Skeleton width={64} />
            ) : (
              <Typography variant="metric" color="primary.main" fontSize={26}>
                {totalPoints}
                <Typography component="span" variant="caption" sx={{ ml: 1 }}>
                  {t('hackathons.pointsUnit')}
                </Typography>
              </Typography>
            )}
          </Stack>
        )}
      </Stack>
      {hackathon.status !== HackathonStatus.NOT_STARTED && (
        <>
          <HackathonTopParticipants
            standings={standings}
            isLoading={isStandingsLoading}
            error={standingsError}
          />
          <Box sx={{ p: 3, pt: 0 }}>
            <Button
              component={RouterLink}
              to={getResourceById(resources.HackathonStandings, hackathon.id)}
              variant="outlined"
              fullWidth
            >
              {t('hackathons.viewStandings')}
            </Button>
          </Box>
        </>
      )}
    </Stack>
  );
};
export default HackathonOverviewAside;
