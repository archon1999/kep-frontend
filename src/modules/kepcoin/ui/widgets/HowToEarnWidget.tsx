import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import { responsivePagePaddingSx } from 'shared/lib/styles';

const HowToEarnWidget = () => {
  const { t } = useTranslation();

  const items = useMemo(
    () => [
      { value: '1', label: t('kepcoinPage.howToEarn.items.dailyActivity') },
      { value: '1-10', label: t('kepcoinPage.howToEarn.items.dailyTasks') },
      { value: '3, 10, 50', label: t('kepcoinPage.howToEarn.items.ratingWinner') },
      { value: '5+', label: t('kepcoinPage.howToEarn.items.competitions') },
      { value: '10-100', label: t('kepcoinPage.howToEarn.items.blog') },
      { value: '1-50', label: t('kepcoinPage.howToEarn.items.problemEditing') },
    ],
    [t],
  );

  return (
    <Card>
      <CardContent sx={responsivePagePaddingSx}>
        <Stack direction="column" spacing={2}>
          <Typography variant="h5" fontWeight={700}>
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
                direction="row"
                spacing={2}
                alignItems="center"
              >
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

export default HowToEarnWidget;
