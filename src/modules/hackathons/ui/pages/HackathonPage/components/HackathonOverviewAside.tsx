import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import { type Hackathon, HackathonStatus } from 'modules/hackathons/domain';
import { HackathonCountdownCard } from 'modules/hackathons/ui/shared';
import KepIcon from 'shared/components/base/KepIcon';

interface HackathonOverviewAsideProps {
  hackathon: Hackathon;
  totalPoints?: number;
  isProjectsLoading: boolean;
  onRegistration: () => void;
  isMutating: boolean;
  registrationError: boolean;
}

const HackathonOverviewAside = ({
  hackathon,
  totalPoints,
  isProjectsLoading,
  onRegistration,
  isMutating,
  registrationError,
}: HackathonOverviewAsideProps) => {
  const { t } = useTranslation();
  const canChangeRegistration = hackathon.status === HackathonStatus.ALREADY;
  const finished = hackathon.status === HackathonStatus.FINISHED;

  return (
    <Stack direction="column" spacing={3}>
      <HackathonCountdownCard hackathon={hackathon} />
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent>
          <Stack direction="column" spacing={1.5}>
            <Stack
              direction="column"
              spacing={1.5}
              divider={<Divider sx={{ borderStyle: 'dashed' }} />}
            >
              {[
                {
                  icon: 'competition' as const,
                  title: t('contests.typeInfo.title'),
                  value: t('hackathons.formatValue'),
                },
                {
                  icon: 'projects' as const,
                  title: t('contests.typeInfo.scoringTitle'),
                  value: t('hackathons.scoringValue'),
                },
                ...(totalPoints !== undefined || isProjectsLoading
                  ? [
                      {
                        icon: 'rating' as const,
                        title: t('hackathons.maxPoints'),
                        value: isProjectsLoading ? (
                          <Skeleton width={80} />
                        ) : (
                          `${totalPoints} ${t('hackathons.pointsUnit')}`
                        ),
                      },
                    ]
                  : []),
              ].map((item) => (
                <Stack key={item.title} direction="row" spacing={1.25} alignItems="center">
                  <KepIcon name={item.icon} fontSize={18} />
                  <Stack direction="column" spacing={0.25} minWidth={0}>
                    <Typography variant="caption" fontWeight={500}>
                      {item.title}
                    </Typography>
                    <Typography component="div" variant="body2" fontWeight={700}>
                      {item.value}
                    </Typography>
                  </Stack>
                </Stack>
              ))}
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {t('hackathons.scoringDescription')}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
      {finished ? (
        <Button
          component={RouterLink}
          to={getResourceById(resources.HackathonStandings, hackathon.id)}
          variant="contained"
          fullWidth
        >
          {t('hackathons.viewStandings')}
        </Button>
      ) : (
        <Stack direction="column" spacing={1.5}>
          <Button
            variant="contained"
            color={hackathon.isRegistered ? 'error' : 'primary'}
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
        </Stack>
      )}
      {registrationError ? (
        <Alert severity="error">{t('hackathons.registrationError')}</Alert>
      ) : null}
    </Stack>
  );
};

export default HackathonOverviewAside;
