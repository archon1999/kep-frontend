import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import Logo from 'shared/components/common/Logo';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { cssVarRgba } from 'shared/lib/utils';
import { resources } from 'app/routes/resources';

const EarnKepcoinWidget = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Card
      sx={(theme) => ({
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${cssVarRgba(theme.vars.palette.warning.lightChannel, 0.12)}, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.05)})`,
      })}
    >
      <CardContent sx={responsivePagePaddingSx}>
        <Stack direction="column" spacing={2.5}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <IconifyIcon icon="solar:coins-bold-duotone" fontSize={28} />
            <Stack direction="column" spacing={0.5}>
              <Typography variant="h5" fontWeight={700}>
                {t('kepcoinPage.earnEntry.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('kepcoinPage.earnEntry.description')}
              </Typography>
            </Stack>
          </Stack>

          <Button
            size="large"
            variant="contained"
            endIcon={<IconifyIcon icon="solar:arrow-right-up-linear" />}
            onClick={() => navigate(resources.KepcoinEarn)}
            sx={{ alignSelf: 'flex-start' }}
          >
            {t('kepcoinPage.earnEntry.action')}
          </Button>
        </Stack>
      </CardContent>

      <Box
        sx={{
          position: 'absolute',
          right: -18,
          bottom: -32,
          opacity: 0.08,
          pointerEvents: 'none',
        }}
      >
        <Logo sx={{ width: 150, height: 150 }} />
      </Box>
    </Card>
  );
};

export default EarnKepcoinWidget;
