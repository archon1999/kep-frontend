import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import DailyTasksMenu from 'app/layouts/main-layout/common/DailyTasksMenu';
import { resources } from 'app/routes/resources';
import { contentInsetSx } from 'app/theme/styles/content';
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
            variant="text"
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
              variant="text"
              sx={actionButtonSx}
            >
              {t('kepcoinPage.actions.openArena')}
            </Button>
            <Button
              component={RouterLink}
              to={resources.Contests}
              size="small"
              variant="text"
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
            variant="text"
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
            variant="text"
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
    <Box>
      <Box>
        <Stack direction="column" spacing={2}>
          <Stack
            direction="column"
            spacing={2}
            sx={contentInsetSx}
            divider={<Divider flexItem sx={{ borderColor: 'divider' }} />}
          >
            {items.map((item) => (
              <Stack
                key={`${item.value}-${item.label}`}
                direction="column"
                spacing={2}
                alignItems="flex-start"
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={2} alignItems="baseline" sx={{ width: 1 }}>
                  <KepcoinValue
                    label={item.value}
                    iconSize={18}
                    spacing={0.75}
                    textVariant="metric"
                    fontWeight={700}
                    color="text.primary"
                    sx={{
                      minWidth: 110,
                      whiteSpace: 'nowrap',
                      '& .MuiTypography-root': { fontSize: 18 },
                    }}
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
      </Box>
    </Box>
  );
};

export default HowToEarnWidget;
