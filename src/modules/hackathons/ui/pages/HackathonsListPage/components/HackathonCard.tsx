import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Box, Card, CardActionArea, Divider, Stack, Typography } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import { type Hackathon } from 'modules/hackathons/domain';
import { HackathonStatusChip } from 'modules/hackathons/ui/shared';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { formatDateTime } from 'shared/lib/dateTime';

interface HackathonCardProps {
  hackathon: Hackathon;
}

const HackathonCard = ({ hackathon }: HackathonCardProps) => {
  const { t } = useTranslation();
  return (
    <Card
      sx={{ height: '100%', borderRadius: 4, outline: 'none', bgcolor: 'background.elevation1' }}
    >
      <CardActionArea
        component={RouterLink}
        to={getResourceById(resources.Hackathon, hackathon.id)}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <Box
          sx={{
            height: 220,
            display: 'grid',
            placeItems: 'center',
            position: 'relative',
            bgcolor: 'common.white',
          }}
        >
          {hackathon.logo ? (
            <Box
              component="img"
              src={hackathon.logo}
              alt=""
              loading="lazy"
              sx={{ width: '70%', height: 156, objectFit: 'contain' }}
            />
          ) : (
            <Typography variant="h2" sx={{ color: 'grey.600' }}>
              {hackathon.title.charAt(0)}
            </Typography>
          )}
          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            <HackathonStatusChip hackathon={hackathon} />
          </Box>
        </Box>
        <Stack direction="column" spacing={2} sx={{ p: 3, flex: 1 }}>
          <Typography component="h2" variant="h6" sx={{ minHeight: 52, overflowWrap: 'anywhere' }}>
            {hackathon.title}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconifyIcon icon="mdi:calendar-blank-outline" width={18} color="text.secondary" />
            <Typography variant="body2">
              {hackathon.startTime
                ? formatDateTime(hackathon.startTime, 'fullDate')
                : t('hackathons.noSchedule')}
            </Typography>
          </Stack>
          <Divider />
          <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary">
              {t('hackathons.projectsCount', { count: hackathon.projectsCount ?? 0 })}
              {' · '}
              {t('hackathons.participantsCount', { count: hackathon.participantsCount ?? 0 })}
            </Typography>
            <IconifyIcon icon="mdi:arrow-right" width={19} color="text.secondary" />
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
};
export default HackathonCard;
