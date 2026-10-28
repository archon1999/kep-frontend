import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { ContestDetail } from 'modules/contests/domain/entities/contest-detail.entity';
import { getContestTypeTitle } from 'modules/contests/ui/shared/utils/contestType';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { EventDate } from 'shared/components/sections/common/EventListCard';
import { createSafeHtml } from 'shared/lib/safeHtml';

const ContestAnnouncement = ({ contest }: { contest: ContestDetail }) => {
  const { t } = useTranslation();
  const fields = [
    {
      label: t('contests.typeLabel'),
      icon: 'mdi:code-braces',
      value: (
        <Typography variant="pixel" sx={{ fontSize: 21 }}>
          {getContestTypeTitle(contest.type, contest.typeInfo)}
        </Typography>
      ),
    },
    {
      label: t('contests.card.starts'),
      icon: 'mdi:calendar-outline',
      value: <EventDate value={contest.startTime} fallback={t('contests.startsUnknown')} />,
    },
    {
      label: t('contests.card.ends'),
      icon: 'mdi:clock-outline',
      value: <EventDate value={contest.finishTime} />,
    },
  ];
  return (
    <Card variant="section" component="section" aria-labelledby="contest-announcement-title">
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 }, '&:last-child': { pb: 3.5 } }}>
        <Stack direction="row" gap={1} alignItems="center" sx={{ mb: 2 }}>
          <IconifyIcon icon="mdi:bullhorn-outline" sx={{ color: 'primary.main', fontSize: 20 }} />
          <Typography component="h2" variant="label" id="contest-announcement-title">
            {t('contests.detail.announcement')}
          </Typography>
        </Stack>
        <Typography
          component="div"
          variant="body1"
          color="text.secondary"
          sx={{
            lineHeight: 1.85,
            overflowWrap: 'anywhere',
            '& p': { my: 1 },
            '& strong': { color: 'text.primary', fontWeight: 600 },
            '& img': { maxWidth: '100%', height: 'auto' },
            '& a': { color: 'primary.main' },
            '& table': { display: 'block', overflowX: 'auto', maxWidth: '100%' },
          }}
          dangerouslySetInnerHTML={createSafeHtml(
            contest.description || t('contests.noDescription'),
          )}
        />
      </CardContent>
      <Grid container component="dl" sx={{ m: 0, borderTop: 1, borderColor: 'divider' }}>
        {fields.map((field, index) => (
          <Grid
            size={{ xs: 12, sm: 4 }}
            key={field.label}
            sx={{
              p: 2.5,
              borderLeft: { sm: index ? '1px solid var(--kep-line)' : 0 },
              borderTop: { xs: index ? '1px solid var(--kep-line)' : 0, sm: 0 },
              borderColor: 'divider',
            }}
          >
            <Typography
              component="dt"
              variant="label"
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}
            >
              <IconifyIcon icon={field.icon} sx={{ fontSize: 16, color: 'primary.main' }} />
              {field.label}
            </Typography>
            <Box component="dd" sx={{ m: 0 }}>
              {field.value}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};
export default ContestAnnouncement;
