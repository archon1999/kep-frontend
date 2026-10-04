import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Box, Card, Divider, Link, Stack, Typography } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import { type Hackathon, type HackathonStanding, HackathonStatus } from 'modules/hackathons/domain';
import { HackathonStatusChip } from 'modules/hackathons/ui/shared';
import KepIcon from 'shared/components/base/KepIcon';
import { formatDateTime } from 'shared/lib/dateTime';
import { createSafeHtml } from 'shared/lib/safeHtml';
import { cssVarRgba } from 'shared/lib/utils';
import HackathonTopParticipants from './HackathonTopParticipants';

interface HackathonSummaryCardProps {
  hackathon: Hackathon;
  standings?: HackathonStanding[];
  isStandingsLoading: boolean;
  standingsError?: unknown;
}

const HackathonSummaryCard = ({
  hackathon,
  standings,
  isStandingsLoading,
  standingsError,
}: HackathonSummaryCardProps) => {
  const { t } = useTranslation();
  const finished = hackathon.status === HackathonStatus.FINISHED;
  const upcoming = hackathon.status === HackathonStatus.NOT_STARTED;

  return (
    <Card
      component="section"
      sx={(theme) => ({
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: cssVarRgba(theme.vars.palette.primary.mainChannel, 0.12),
        borderLeft: '6px solid',
        borderLeftColor: finished ? 'primary.main' : upcoming ? 'warning.main' : 'success.main',
        background: `linear-gradient(135deg, ${cssVarRgba(theme.vars.palette.primary.lightChannel, 0.12)}, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.08)} 58%, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.04)})`,
      })}
    >
      <Box
        sx={(theme) => ({
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `radial-gradient(circle at 14% 18%, ${cssVarRgba(theme.vars.palette.primary.lightChannel, 0.16)}, transparent 34%), radial-gradient(circle at 85% 14%, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.12)}, transparent 28%)`,
          '&::after': hackathon.logo
            ? {
                content: '""',
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${hackathon.logo})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.035,
                filter: 'saturate(0.6)',
              }
            : undefined,
        })}
      />
      <Stack direction="column" spacing={2} sx={{ position: 'relative', zIndex: 1, p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="flex-start" justifyContent="space-between">
          <Stack direction="column" spacing={1} minWidth={0}>
            <Stack direction="row" spacing={1} alignItems="center">
              <KepIcon name="projects" fontSize={20} />
              <Typography
                variant="overline"
                color="text.secondary"
                fontWeight={700}
                textTransform="uppercase"
              >
                {t('hackathons.formatValue')}
              </Typography>
            </Stack>
            <Typography
              component="h2"
              variant="h6"
              fontWeight={800}
              sx={{ overflowWrap: 'anywhere' }}
            >
              {hackathon.title}
            </Typography>
          </Stack>
          <HackathonStatusChip hackathon={hackathon} />
        </Stack>
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} alignItems="stretch">
          <Box sx={{ flex: 1, minWidth: 0, borderRadius: 2, bgcolor: 'background.neutral', p: 2 }}>
            <Typography
              component="div"
              variant="body2"
              color="text.secondary"
              sx={{
                overflowWrap: 'anywhere',
                '& p': { mt: 0, mb: 1 },
                '& p:last-child': { mb: 0 },
                '& strong': { fontWeight: 600, color: 'text.primary' },
                '& img': { maxWidth: '100%', height: 'auto' },
                '& pre, & table': { maxWidth: '100%', overflowX: 'auto' },
                '& a': { color: 'primary.main' },
              }}
              dangerouslySetInnerHTML={createSafeHtml(
                hackathon.description || t('hackathons.noDescription'),
              )}
            />
          </Box>
          {!upcoming ? (
            <HackathonTopParticipants
              standings={standings}
              isLoading={isStandingsLoading}
              error={standingsError}
            />
          ) : null}
        </Stack>
        <Stack direction="column" spacing={1.5}>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            {[
              { date: hackathon.startTime, label: 'contests.startsLabel' },
              { date: hackathon.finishTime, label: 'contests.endsLabel' },
            ]
              .filter((item) => item.date)
              .map((item) => (
                <Stack key={item.label} direction="row" spacing={1} alignItems="center">
                  <KepIcon name="challenge-time" fontSize={18} />
                  <Typography variant="body2" color="text.secondary">
                    {t(item.label, { date: formatDateTime(item.date, 'compactDateTime') })}
                  </Typography>
                </Stack>
              ))}
          </Stack>
          <Divider sx={{ borderStyle: 'dashed', opacity: 0.6 }} />
          <Stack direction="row" spacing={2.5} flexWrap="wrap" useFlexGap>
            {[
              {
                icon: 'projects' as const,
                label: t('hackathons.projectsCount', { count: hackathon.projectsCount ?? 0 }),
                route: resources.HackathonProjects,
              },
              {
                icon: 'rating' as const,
                label: t('contests.registrantsLabel', { count: hackathon.registrantsCount ?? 0 }),
                route: resources.HackathonRegistrants,
              },
              ...(!upcoming
                ? [
                    {
                      icon: 'users' as const,
                      label: t('hackathons.participantsCount', {
                        count: hackathon.participantsCount ?? 0,
                      }),
                      route: resources.HackathonStandings,
                    },
                  ]
                : []),
            ].map((item) => (
              <Link
                key={item.route}
                component={RouterLink}
                to={getResourceById(item.route, hackathon.id)}
                color="inherit"
                underline="hover"
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}
              >
                <KepIcon name={item.icon} fontSize={18} />
                <Typography variant="body2" fontWeight={700}>
                  {item.label}
                </Typography>
              </Link>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};

export default HackathonSummaryCard;
