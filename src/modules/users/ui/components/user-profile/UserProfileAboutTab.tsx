import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab';
import {
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useUserAbout } from '../../../application/queries';

const UserProfileAboutTab = () => {
  const { t } = useTranslation();
  const { username = '' } = useParams();
  const { data, isLoading } = useUserAbout(username);

  const skills = data?.skills ?? {};
  const technologies = data?.technologies ?? [];
  const educations = data?.educations ?? [];
  const workExperiences = data?.workExperiences ?? [];
  const bio = data?.profileInfo?.bio || '';

  const skillEntries = useMemo(
    () =>
      Object.entries(skills)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([label, value]) => ({ label, value: Number(value ?? 0) })),
    [skills],
  );

  const renderTimeline = <T extends { fromYear: number | null; toYear: number | null }>(
    items: T[],
    getTitle: (item: T) => string,
    getSubtitle: (item: T) => string,
  ) => (
    <Timeline sx={{ '& .MuiTimelineItem-root:before': { flex: 0, padding: 0 }, mt: -1 }}>
      {items.map((item, index) => {
        const period =
          item.fromYear || item.toYear
            ? `${item.fromYear ?? t('users.emptyValue')} - ${item.toYear ?? t('users.profile.timeline.present')}`
            : t('users.profile.timeline.present');
        const isLast = index === items.length - 1;

        return (
          <TimelineItem key={`${getTitle(item)}-${index}`}>
            <TimelineSeparator>
              <TimelineDot color="primary" variant="outlined" />
              {!isLast ? (
                <TimelineConnector sx={{ bgcolor: 'primary.main', opacity: 0.2 }} />
              ) : null}
            </TimelineSeparator>
            <TimelineContent sx={{ py: 0.5 }}>
              <Stack direction="column" spacing={0.35}>
                <Typography variant="subtitle1" fontWeight={700}>
                  {getTitle(item)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {getSubtitle(item)}
                </Typography>
                <Typography>{period}</Typography>
              </Stack>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );

  if (isLoading) {
    return (
      <Stack direction="column" spacing={2}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} variant="outlined">
            <CardContent>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="rectangular" height={80} sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  return (
    <Stack direction="column" spacing={2}>
      <Card variant="outlined">
        <CardContent>
          <Stack direction="column" spacing={1}>
            <Typography variant="h6" fontWeight={700}>
              {t('users.profile.about')}
            </Typography>
            <Typography
              dangerouslySetInnerHTML={{ __html: bio }}
              variant="body2"
              color="text.secondary"
            />
          </Stack>
        </CardContent>
      </Card>

      {skillEntries.length ? (
        <>
          <Divider />
          <Card variant="outlined">
            <CardContent>
              <Stack direction="column" spacing={2}>
                <Typography variant="h6" fontWeight={700}>
                  {t('users.profile.skills')}
                </Typography>

                <Stack direction="column" spacing={1.5}>
                  {skillEntries.map((entry) => (
                    <Stack key={entry.label} direction="column" spacing={0.5}>
                      <Typography variant="body2" color="text.secondary">
                        {t(`settings.skillLabels.${entry.label}`, { defaultValue: entry.label })}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={entry.value}
                        sx={{ height: 8, borderRadius: 2 }}
                      />
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </>
      ) : null}

      {technologies.length ? (
        <>
          <Divider />
          <Card variant="outlined">
            <CardContent>
              <Stack direction="column" spacing={1.5}>
                <Typography variant="h6" fontWeight={700}>
                  {t('users.profile.technologies')}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {technologies.map((tech) => (
                    <Chip
                      key={`${tech.text}-${tech.devIconClass}`}
                      label={tech.text}
                      sx={{
                        bgcolor: tech.badgeColor || 'background.neutral',
                        color: 'white',
                        borderColor: tech.badgeColor || 'divider',
                      }}
                    />
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </>
      ) : null}

      {educations.length ? (
        <>
          <Divider />
          <Card variant="outlined">
            <CardContent>
              <Stack direction="column" spacing={1.25}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h6" fontWeight={700}>
                    {t('users.profile.education')}
                  </Typography>
                </Stack>
                {renderTimeline(
                  educations,
                  (education) => education.organization,
                  (education) => education.degree,
                )}
              </Stack>
            </CardContent>
          </Card>
        </>
      ) : null}

      {workExperiences.length ? (
        <>
          <Divider />
          <Card variant="outlined">
            <CardContent>
              <Stack direction="column" spacing={1.25}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h6" fontWeight={700}>
                    {t('users.profile.workExperience')}
                  </Typography>
                </Stack>
                {renderTimeline(
                  workExperiences,
                  (work) => work.company,
                  (work) => work.jobTitle,
                )}
              </Stack>
            </CardContent>
          </Card>
        </>
      ) : null}
    </Stack>
  );
};

export default UserProfileAboutTab;
