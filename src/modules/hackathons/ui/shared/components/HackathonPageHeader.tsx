import { ReactNode } from 'react';
import { Box, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { type Hackathon, HackathonStatus } from 'modules/hackathons/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { formatHackathonDateTime } from '../helpers/format';

interface HackathonHeaderStat {
  label: string;
  value: ReactNode;
  icon: string;
}

interface HackathonPageHeaderProps {
  hackathon?: Hackathon;
  eyebrow?: string;
  title?: string;
  lead?: string;
  action?: ReactNode;
  stats?: HackathonHeaderStat[];
}

const HackathonPageHeader = ({
  hackathon,
  eyebrow,
  title,
  lead,
  action,
  stats,
}: HackathonPageHeaderProps) => {
  const { t, i18n } = useTranslation();

  if (!hackathon) return null;

  const statusLabel = (() => {
    if (hackathon.status === HackathonStatus.NOT_STARTED) return t('hackathons.upcoming');
    if (hackathon.status === HackathonStatus.FINISHED) return t('hackathons.finished');
    return t('hackathons.active');
  })();

  const statusColor =
    hackathon.status === HackathonStatus.FINISHED
      ? 'default'
      : hackathon.status === HackathonStatus.ALREADY
        ? 'success'
        : 'warning';

  const headerStats =
    stats ??
    [
      {
        label: t('hackathons.projects'),
        value: hackathon.projectsCount ?? 0,
        icon: 'mdi:clipboard-text-outline',
      },
      {
        label: t('hackathons.registrants'),
        value: hackathon.registrantsCount ?? hackathon.participantsCount ?? 0,
        icon: 'mdi:account-group-outline',
      },
      {
        label: t('hackathons.startsAt'),
        value: formatHackathonDateTime(hackathon.startTime, i18n.language),
        icon: 'mdi:calendar-start',
      },
      {
        label: t('hackathons.endsAt'),
        value: formatHackathonDateTime(hackathon.finishTime, i18n.language),
        icon: 'mdi:calendar-end',
      },
    ];

  return (
    <Card
      background={1}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 4,
        outline: 'none',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: (theme) => `
            radial-gradient(circle at top right, ${theme.palette.primary.main}22 0%, transparent 42%),
            radial-gradient(circle at left bottom, ${theme.palette.warning.main}16 0%, transparent 35%)
          `,
          pointerEvents: 'none',
        }}
      />

      <CardContent sx={{ position: 'relative', p: { xs: 3, md: 4 } }}>
        <Stack direction="column" spacing={3}>
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={3}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', lg: 'center' }}
          >
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Box
                sx={{
                  width: { xs: 64, md: 80 },
                  height: { xs: 64, md: 80 },
                  borderRadius: 3,
                  bgcolor: 'background.neutral',
                  backgroundImage: hackathon.logo ? `url(${hackathon.logo})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: (theme) => `inset 0 0 0 1px ${theme.palette.divider}`,
                }}
              >
                {!hackathon.logo ? (
                  <Typography variant="h4" fontWeight={800} color="primary.main">
                    {(title ?? hackathon.title).charAt(0)}
                  </Typography>
                ) : null}
              </Box>

              <Stack direction="column" spacing={1.25} minWidth={0}>
                <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1} alignItems="center">
                  {eyebrow ? (
                    <Typography variant="overline" color="text.secondary">
                      {eyebrow}
                    </Typography>
                  ) : null}
                  <Chip label={statusLabel} color={statusColor} size="small" />
                </Stack>

                <Typography variant="h3" fontWeight={800} sx={{ lineHeight: 1.1 }}>
                  {title ?? hackathon.title}
                </Typography>

                {lead ? (
                  <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
                    {lead}
                  </Typography>
                ) : null}
              </Stack>
            </Stack>

            {action ? <Box sx={{ width: { xs: 1, lg: 'auto' } }}>{action}</Box> : null}
          </Stack>

          <Grid container spacing={2}>
            {headerStats.map((item) => (
              <Grid size={{ xs: 12, sm: 6, xl: 3 }} key={item.label}>
                <Box
                  sx={{
                    height: 1,
                    p: 2,
                    borderRadius: 3,
                    bgcolor: 'background.neutral',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Stack direction="row" spacing={1.25} alignItems="flex-start">
                    <IconifyIcon icon={item.icon} color="primary.main" />
                    <Stack direction="column" spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        {item.label}
                      </Typography>
                      {typeof item.value === 'string' || typeof item.value === 'number' ? (
                        <Typography variant="subtitle1" fontWeight={800}>
                          {item.value}
                        </Typography>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', minHeight: 32 }}>
                          {item.value}
                        </Box>
                      )}
                    </Stack>
                  </Stack>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default HackathonPageHeader;
