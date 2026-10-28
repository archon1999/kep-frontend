import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import { contentInsetSx } from 'app/theme/styles/content';
import KepcoinValue from 'shared/components/common/KepcoinValue';

interface HowToSpendWidgetProps {
  balance?: number;
}

const actionButtonSx = {
  borderRadius: 999,
  textTransform: 'none',
  fontWeight: 700,
  whiteSpace: 'nowrap',
};

const HowToSpendWidget = ({ balance: _balance = 0 }: HowToSpendWidgetProps) => {
  const { t } = useTranslation();

  const items = [
    {
      value: '0-14',
      label: t('kepcoinPage.howToSpend.items.viewAttempt'),
      to: resources.Attempts,
      action: t('kepcoinPage.actions.openAttempts'),
    },
    {
      value: '1',
      label: t('kepcoinPage.howToSpend.items.viewTest'),
      to: resources.Tests,
      action: t('kepcoinPage.actions.openTests'),
    },
    {
      value: '2-50',
      label: t('kepcoinPage.howToSpend.items.problemSolution'),
      to: resources.Problems,
      action: t('kepcoinPage.actions.openProblems'),
    },
    {
      value: '5',
      label: t('kepcoinPage.howToSpend.items.coverPhoto'),
      to: resources.SettingsInformation,
      action: t('kepcoinPage.actions.openSettings'),
    },
    {
      value: '1',
      label: t('kepcoinPage.howToSpend.items.passTest'),
      to: resources.Tests,
      action: t('kepcoinPage.actions.openTests'),
    },
    {
      value: '10',
      label: t('kepcoinPage.howToSpend.items.testFunction'),
      to: getResourceById(resources.Problem, 1),
      action: t('kepcoinPage.actions.openProblems'),
    },
    {
      value: '10+',
      label: t('kepcoinPage.howToSpend.items.merch'),
      to: resources.Shop,
      action: t('kepcoinPage.actions.openShop'),
    },
  ];

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
            {items.map((item, index) => (
              <Stack
                key={`${item.value}-${index}`}
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

                <Button
                  component={RouterLink}
                  to={item.to}
                  size="small"
                  variant="text"
                  sx={actionButtonSx}
                >
                  {item.action}
                </Button>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default HowToSpendWidget;
