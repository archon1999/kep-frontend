import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Alert, Box, Button, Skeleton, Typography } from '@mui/material';
import { resources } from 'app/routes/resources';
import { getRankColor } from 'app/theme/colors/medals';
import { contentInsetSx } from 'app/theme/styles/content';
import { useProjectUserRating } from 'modules/projects/application/queries';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import SectionHeader from 'shared/components/sections/common/SectionHeader';
import { createNumberFormatter } from 'shared/lib/numberFormat';

const ProjectsUserRatingSection = ({ username }: { username: string }) => {
  const { t } = useTranslation();
  const { data, isLoading, error, mutate } = useProjectUserRating(username);
  const formatter = createNumberFormatter({ maximumFractionDigits: 0 });
  const metrics = [
    { key: 'points', value: data?.rating, color: 'primary.main' },
    { key: 'place', value: data?.rank, color: getRankColor(data?.rank) },
    { key: 'completed', value: data?.completedProjects, color: 'text.primary' },
    { key: 'passedTasks', value: data?.passedTasks, color: 'text.primary' },
  ];
  return (
    <Box component="section">
      <SectionHeader
        title={t('projects.title')}
        action={
          <Button
            component={RouterLink}
            to={resources.ProjectsRating}
            variant="outlined"
            endIcon={<IconifyIcon icon="mdi:arrow-right" />}
          >
            {t('projects.rating.leaderboard')}
          </Button>
        }
      />
      {error ? (
        <Box sx={contentInsetSx}>
          <Alert
            severity="error"
            action={
              <Button color="inherit" onClick={() => void mutate()}>
                {t('common.retry')}
              </Button>
            }
          >
            {t('common.loadFailed')}
          </Alert>
        </Box>
      ) : (
        <Box
          component="dl"
          aria-busy={isLoading}
          sx={{
            ...contentInsetSx,
            m: 0,
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(4, minmax(0, 1fr))',
            },
            gap: 3,
          }}
        >
          {metrics.map(({ key, value, color }) => (
            <Box key={key}>
              <Typography component="dt" variant="label" color="text.secondary">
                {t(`projects.rating.${key}`)}
              </Typography>
              <Typography
                component="dd"
                variant="metric"
                color={color}
                sx={{ m: 0, mt: 1, fontSize: 28 }}
              >
                {isLoading ? (
                  <Skeleton width={84} />
                ) : value == null ? (
                  '—'
                ) : (
                  formatter.format(value)
                )}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ProjectsUserRatingSection;
