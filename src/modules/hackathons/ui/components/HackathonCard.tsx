import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Avatar, Box, Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { getResourceById, resources } from 'app/routes/resources';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { Hackathon, HackathonStatus } from '../../domain/entities/hackathon.entity';

dayjs.extend(relativeTime);

interface HackathonCardProps {
  hackathon: Hackathon;
}

const HackathonCard = ({ hackathon }: HackathonCardProps) => {
  const { t } = useTranslation();

  const startTime = hackathon.startTime ? dayjs(hackathon.startTime) : null;
  const finishTime = hackathon.finishTime ? dayjs(hackathon.finishTime) : null;

  const statusLabel = (() => {
    if (hackathon.status === HackathonStatus.FINISHED || (finishTime && finishTime.isBefore(dayjs()))) {
      return t('hackathons.finished');
    }

    if (hackathon.status === HackathonStatus.NOT_STARTED || (startTime && startTime.isAfter(dayjs()))) {
      const timeLabel = startTime ? startTime.fromNow() : '';
      return `${t('hackathons.startsIn')} ${timeLabel}`.trim();
    }

    if (finishTime) {
      return `${t('hackathons.endsIn')} ${finishTime.fromNow()}`;
    }

    return t('hackathons.active');
  })();

  return (
    <Card
      background={1}
      sx={{
        outline: 'none',
        height: 1,
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={getResourceById(resources.Hackathon, hackathon.id)}
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', height: 1 }}
      >
        <Box
          sx={{
            position: 'relative',
            height: 400,
            bgcolor: 'background.neutral',
            backgroundImage: hackathon.logo ? `url(${hackathon.logo})` : 'none',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{ width: 48, height: 48, bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 800 }}
              src={hackathon.logo || undefined}
            >
              {!hackathon.logo ? hackathon.title?.charAt(0) ?? 'H' : null}
            </Avatar>
            <Stack direction="row" spacing={0.5} flex={1} minWidth={0}>
              <Typography variant="h6" fontWeight={800} noWrap>
                {hackathon.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {statusLabel}
              </Typography>
            </Stack>
            <Chip label={t('hackathons.projectsCount', { count: hackathon.projectsCount ?? 0 })} color="primary" size="small" />
          </Stack>

          {hackathon.description ? (
            <Typography
              variant="body2"
              color="text.secondary"
              component="div"
              sx={{
                maxHeight: 140,
                overflow: 'hidden',
                '& p': { m: 0 },
              }}
              dangerouslySetInnerHTML={{ __html: hackathon.description }}
            />
          ) : null}

          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Stack direction="row" spacing={1} alignItems="center">
              <IconifyIcon icon="mdi:account-group" width={18} />
              <Typography variant="body2" color="text.secondary">
                {t('hackathons.participantsCount', { count: hackathon.participantsCount ?? hackathon.registrantsCount ?? 0 })}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <IconifyIcon icon="mdi:calendar-clock" width={18} />
              <Typography variant="body2" color="text.secondary">
                {startTime
                  ? t('hackathons.schedule', {
                    start: startTime.format('DD MMM, HH:mm'),
                    end: finishTime ? finishTime.format('DD MMM, HH:mm') : '',
                  })
                  : t('hackathons.noSchedule')}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default HackathonCard;
