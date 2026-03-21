import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { getResourceById, resources } from 'app/routes/resources';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import { responsivePagePaddingSx } from 'shared/lib/styles';

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
    <Card
      sx={{
        borderRadius: 5,
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
        boxShadow: '0 24px 50px rgba(18, 28, 45, 0.08)',
      }}
    >
      <CardContent sx={responsivePagePaddingSx}>
        <Stack direction="column" spacing={2}>
          <Typography variant="h5" fontWeight={700}>
            {t('kepcoinPage.howToSpend.title')}
          </Typography>
          <Stack
            direction="column"
            spacing={1.5}
            divider={<Divider flexItem sx={{ borderColor: 'divider' }} />}
          >
            {items.map((item, index) => (
              <Stack
                key={`${item.value}-${index}`}
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

                <Button
                  component={RouterLink}
                  to={item.to}
                  size="small"
                  variant="outlined"
                  sx={actionButtonSx}
                >
                  {item.action}
                </Button>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default HowToSpendWidget;
