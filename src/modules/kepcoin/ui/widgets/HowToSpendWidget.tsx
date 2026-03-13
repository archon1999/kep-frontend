import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import { responsivePagePaddingSx } from 'shared/lib/styles';


const HowToSpendWidget = () => {
  const { t } = useTranslation();

  const items = useMemo(
    () => [
      { value: '0-14', label: t('kepcoinPage.howToSpend.items.viewAttempt') },
      { value: '1', label: t('kepcoinPage.howToSpend.items.viewTest') },
      { value: '2-50', label: t('kepcoinPage.howToSpend.items.problemSolution') },
      { value: '5', label: t('kepcoinPage.howToSpend.items.coverPhoto') },
      { value: '1', label: t('kepcoinPage.howToSpend.items.passTest') },
      { value: '1-1000', label: t('kepcoinPage.howToSpend.items.course') },
      { value: '10', label: t('kepcoinPage.howToSpend.items.testFunction') },
      { value: '25', label: t('kepcoinPage.howToSpend.items.doubleRating') },
      { value: '25', label: t('kepcoinPage.howToSpend.items.keepRating') },
    ],
    [t],
  );

  return (
    <Card>
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
              <Stack key={`${item.value}-${index}`} direction="row" spacing={2} alignItems="center">
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
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default HowToSpendWidget;
