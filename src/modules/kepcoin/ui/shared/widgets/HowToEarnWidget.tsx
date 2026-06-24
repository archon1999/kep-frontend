import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import DailyTasksMenu from 'app/layouts/main-layout/common/DailyTasksMenu';
import { resources } from 'app/routes/resources';
import KepcoinValue from 'shared/components/common/KepcoinValue';

const actionButtonSx = {
  borderRadius: 999,
  textTransform: 'none',
  fontWeight: 700,
  whiteSpace: 'nowrap',
};

const HowToEarnWidget = () => {
  const { t } = useTranslation();

  const items = useMemo(
    () => [
      {
        value: '1',
        label: t('kepcoinPage.howToEarn.items.dailyActivity'),
        actions: null,
      },
      {
        value: '1-10',
        label: t('kepcoinPage.howToEarn.items.dailyTasks'),
        actions: <DailyTasksMenu type="action" label={t('kepcoinPage.actions.openDailyTasks')} />,
      },
      {
        value: '3, 10, 50',
        label: t('kepcoinPage.howToEarn.items.ratingWinner'),
        actions: (
          <Button
            component={RouterLink}
            to={resources.ProblemsRating}
            size="small"
            variant="outlined"
            sx={actionButtonSx}
          >
            {t('kepcoinPage.actions.openRating')}
          </Button>
        ),
      },
      {
        value: '5+',
        label: t('kepcoinPage.howToEarn.items.competitions'),
        actions: (
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button
              component={RouterLink}
              to={resources.Arena}
              size="small"
              variant="outlined"
              sx={actionButtonSx}
            >
              {t('kepcoinPage.actions.openArena')}
            </Button>
            <Button
              component={RouterLink}
              to={resources.Contests}
              size="small"
              variant="outlined"
              sx={actionButtonSx}
            >
              {t('kepcoinPage.actions.openContests')}
            </Button>
          </Stack>
        ),
      },
      {
        value: '10-100',
        label: t('kepcoinPage.howToEarn.items.blog'),
        actions: (
          <Button
            component={RouterLink}
            to={resources.BlogCreate}
            size="small"
            variant="outlined"
            sx={actionButtonSx}
          >
            {t('kepcoinPage.actions.writeBlog')}
          </Button>
        ),
      },
      {
        value: '5-15',
        label: t('kepcoinPage.howToEarn.items.oneTimeTasks'),
        actions: (
          <Button
            component={RouterLink}
            to={resources.KepcoinEarn}
            size="small"
            variant="outlined"
            sx={actionButtonSx}
          >
            {t('kepcoinPage.actions.openOneTimeTasks')}
          </Button>
        ),
      },
    ],
    [t],
  );

  return (
    <Card
      sx={{
        borderRadius: 2,
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
        boxShadow: 'none',
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack direction="column" spacing={2}>
          <Typography variant="h6" fontWeight={700}>
            {t('kepcoinPage.howToEarn.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('kepcoinPage.howToEarn.description')}
          </Typography>
          <Stack
            direction="column"
            spacing={1.5}
            divider={<Divider flexItem sx={{ borderColor: 'divider' }} />}
          >
            {items.map((item) => (
              <Stack
                key={`${item.value}-${item.label}`}
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                alignItems={{ xs: 'flex-start', md: 'center' }}
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={2} alignItems="center" flex={1}>
                  <KepcoinValue
                    label={item.value}
                    iconSize={18}
                    spacing={0.75}
                    textVariant="body2"
                    fontWeight={700}
                    color="text.primary"
                    sx={{ minWidth: 120 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {item.label}
                  </Typography>
                </Stack>

                {item.actions}
              </Stack>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default HowToEarnWidget;
