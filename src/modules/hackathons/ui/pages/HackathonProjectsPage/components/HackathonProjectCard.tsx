import { Box, Button, Card, CardActions, CardContent, Chip, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { getResourceByParams, resources } from 'app/routes/resources';
import { type HackathonProject } from 'modules/hackathons/domain';
import { getHackathonProjectPoints, HackathonPointsBadge } from 'modules/hackathons/ui/shared';
import IconifyIcon from 'shared/components/base/IconifyIcon';

interface HackathonProjectCardProps {
  hackathonId: number | string;
  project: HackathonProject;
}

const HackathonProjectCard = ({ hackathonId, project }: HackathonProjectCardProps) => {
  const { t } = useTranslation();
  const totalPoints = getHackathonProjectPoints(project);

  return (
    <Card
      background={1}
      sx={{
        height: 1,
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'column',
        outline: 'none',
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" spacing={1.5} alignItems="flex-start">
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" rowGap={1}>
            <Chip label={`${t('hackathons.projectSymbol')}: ${project.symbol}`} size="small" variant="outlined" />
            <HackathonPointsBadge value={totalPoints} color="primary" />
          </Stack>

          {project.project.logo ? (
            <Box
              component="img"
              src={project.project.logo}
              alt={project.project.title}
              sx={{
                width: 52,
                height: 52,
                objectFit: 'contain',
                borderRadius: 2,
                bgcolor: 'background.neutral',
                flexShrink: 0,
              }}
            />
          ) : null}
        </Stack>

        <Stack direction="column" spacing={1}>
          <Typography variant="h5" fontWeight={800}>
            {project.project.title}
          </Typography>

          {project.project.descriptionShort ? (
            <Typography
              variant="body2"
              color="text.secondary"
              component="div"
              sx={{
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 3,
                '& > *': {
                  m: 0,
                },
              }}
              dangerouslySetInnerHTML={{ __html: project.project.descriptionShort }}
            />
          ) : null}
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
          {project.project.availableTechnologies.map((technology) => (
            <Chip key={technology.technology} label={technology.technology} size="small" variant="outlined" />
          ))}
        </Stack>
      </CardContent>

      <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
        <Button
          fullWidth
          component={RouterLink}
          to={getResourceByParams(resources.HackathonProject, { id: hackathonId, symbol: project.symbol })}
          variant="contained"
          endIcon={<IconifyIcon icon="mdi:arrow-right" />}
        >
          {t('hackathons.openProject')}
        </Button>
      </CardActions>
    </Card>
  );
};

export default HackathonProjectCard;
