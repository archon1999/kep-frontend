import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Avatar, Box, Button, Chip, Link, Stack, Typography } from '@mui/material';
import { getResourceByParams, resources } from 'app/routes/resources';
import { type HackathonProject } from 'modules/hackathons/domain';
import { stripProjectDescription } from 'modules/projects/application/project-listing';
import MixedText from 'shared/components/common/MixedText';
import { getHackathonProjectPoints } from '../helpers/format';

const HackathonProjectCard = ({
  hackathonId,
  project,
}: {
  hackathonId: number | string;
  project: HackathonProject;
}) => {
  const { t } = useTranslation();
  const detail = project.project;
  const url = getResourceByParams(resources.HackathonProject, {
    id: hackathonId,
    symbol: project.symbol,
  });
  const technologies = [
    ...new Set(detail.availableTechnologies.map((item) => item.technology.trim()).filter(Boolean)),
  ];
  return (
    <Box
      component="article"
      sx={{
        p: { xs: 2.5, md: 4 },
        borderBottom: 1,
        borderColor: 'divider',
        '&:last-child': { borderBottom: 0 },
        minWidth: 0,
      }}
    >
      <Stack direction="row" alignItems="flex-start" gap={2}>
        <Typography
          variant="metric"
          color="primary.main"
          sx={{ fontSize: 28, width: 36, flexShrink: 0 }}
        >
          {project.symbol}
        </Typography>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" gap={1.5} alignItems="center">
            {detail.logo && (
              <Avatar
                variant="square"
                src={detail.logo}
                alt=""
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'transparent',
                  '& img': { objectFit: 'contain' },
                }}
              />
            )}
            <Typography
              component="h3"
              sx={{
                fontFamily: 'var(--kep-display-font)',
                fontSize: { xs: 21, md: 25 },
                lineHeight: 1.35,
                overflowWrap: 'anywhere',
              }}
            >
              <Link component={RouterLink} to={url} color="inherit" underline="hover">
                <MixedText>{detail.title}</MixedText>
              </Link>
            </Typography>
          </Stack>
          <Stack direction="row" gap={1.5} flexWrap="wrap" alignItems="center" sx={{ mt: 1.5 }}>
            <Chip
              variant="soft"
              size="small"
              label={detail.levelTitle}
              color={
                detail.level <= 1
                  ? 'info'
                  : detail.level === 2
                    ? 'primary'
                    : detail.level === 3
                      ? 'warning'
                      : 'error'
              }
            />
            <Typography variant="caption" color="text.secondary">
              {technologies.join(' · ')}
            </Typography>
            {detail.tasks.length > 0 && (
              <Typography variant="caption" color="text.secondary">
                {t('projects.taskSummary', { count: detail.tasks.length })}
              </Typography>
            )}
          </Stack>
          {detail.descriptionShort && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 2,
                lineHeight: 1.8,
                overflowWrap: 'anywhere',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {stripProjectDescription(detail.descriptionShort)}
            </Typography>
          )}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            gap={2}
            flexWrap="wrap"
            sx={{ mt: 2.5 }}
          >
            <Typography variant="metric" color="primary.main" fontSize={24}>
              {getHackathonProjectPoints(project)}
              <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                {t('hackathons.pointsUnit')}
              </Typography>
            </Typography>
            <Button
              component={RouterLink}
              to={url}
              variant="outlined"
              endIcon={<span aria-hidden="true">↗</span>}
            >
              {t('hackathons.openProject')}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};
export default HackathonProjectCard;
