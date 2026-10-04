import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Avatar, Button, Chip, Grid, Link, Paper, Stack, Typography } from '@mui/material';
import { getResourceByParams, resources } from 'app/routes/resources';
import { type HackathonProject } from 'modules/hackathons/domain';
import { stripProjectDescription } from 'modules/projects/ui/pages/ProjectsListPage/project-listing';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { getHackathonProjectPoints } from '../helpers/format';

interface HackathonProjectCardProps {
  hackathonId: number | string;
  project: HackathonProject;
}

const HackathonProjectCard = ({ hackathonId, project }: HackathonProjectCardProps) => {
  const { t } = useTranslation();
  const detail = project.project;
  const projectUrl = getResourceByParams(resources.HackathonProject, {
    id: hackathonId,
    symbol: project.symbol,
  });
  const technologies = [
    ...new Set(
      detail.availableTechnologies.map(({ technology }) => technology.trim()).filter(Boolean),
    ),
  ];
  const technologySummary = [
    technologies.slice(0, 2).join(', '),
    technologies.length > 2 ? `+${technologies.length - 2}` : '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <Paper
      component="article"
      background={1}
      sx={{
        outline: 0,
        p: { xs: 2, sm: 3 },
        borderRadius: 6,
        '&:hover': { bgcolor: 'background.elevation2' },
      }}
    >
      <Grid container spacing={{ xs: 1, sm: 2 }}>
        <Grid size="auto">
          <Avatar
            variant="rounded"
            src={detail.logo}
            alt=""
            sx={{
              width: 54,
              height: 54,
              borderRadius: 2.5,
              bgcolor: 'transparent',
              '& img': { objectFit: 'contain' },
            }}
          >
            {detail.title.charAt(0)}
          </Avatar>
        </Grid>
        <Grid size={{ xs: 12, sm: 'grow' }} order={{ xs: 1, sm: 0 }} sx={{ minWidth: 0 }}>
          <Stack direction="column" spacing={2}>
            <Stack direction="column" spacing={0.5}>
              <Typography
                component="h3"
                variant="h6"
                lineHeight={1.5}
                sx={{ overflowWrap: 'anywhere' }}
              >
                <Link component={RouterLink} to={projectUrl} color="inherit" underline="hover">
                  {project.symbol}. {detail.title}
                </Link>
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
                {technologySummary ? (
                  <Typography variant="subtitle2" fontWeight={600} title={technologies.join(', ')}>
                    {technologySummary}
                  </Typography>
                ) : null}
                <Chip
                  variant="soft"
                  color={
                    detail.level <= 1
                      ? 'info'
                      : detail.level === 2
                        ? 'primary'
                        : detail.level === 3
                          ? 'warning'
                          : 'error'
                  }
                  label={detail.levelTitle}
                  size="small"
                  aria-label={`${t('projects.level')}: ${detail.levelTitle}`}
                />
                <Typography variant="subtitle2" fontWeight={500}>
                  {getHackathonProjectPoints(project)} {t('hackathons.pointsUnit')}
                </Typography>
                {detail.tasks.length > 0 ? (
                  <Typography variant="caption" color="text.secondary">
                    {t('projects.taskSummary', { count: detail.tasks.length })}
                  </Typography>
                ) : null}
              </Stack>
            </Stack>
            {detail.descriptionShort ? (
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={500}
                sx={{ overflowWrap: 'anywhere' }}
              >
                {stripProjectDescription(detail.descriptionShort)}
              </Typography>
            ) : null}
          </Stack>
        </Grid>
        <Grid size="auto" flexGrow={{ xs: 1, sm: 0 }}>
          <Stack direction="row" justifyContent="flex-end">
            <Button
              component={RouterLink}
              to={projectUrl}
              shape="square"
              color="neutral"
              aria-label={t('hackathons.openProject')}
              title={t('hackathons.openProject')}
            >
              <IconifyIcon icon="material-symbols:arrow-forward" sx={{ fontSize: 20 }} />
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};
export default HackathonProjectCard;
