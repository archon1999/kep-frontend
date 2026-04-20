import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Logo from 'shared/components/common/Logo';
import { cssVarRgba } from 'shared/lib/utils';

type Props = {
  total: number;
};

const ArenaListPageHeroCard = ({ total }: Props) => {
  const { t } = useTranslation();

  return (
    <Card
      sx={(theme) => ({
        borderRadius: 3,
        background: `linear-gradient(135deg, ${cssVarRgba(theme.vars.palette.warning.lightChannel, 0.08)}, ${cssVarRgba(theme.vars.palette.warning.mainChannel, 0.06)})`,
      })}
    >
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Stack direction="column" spacing={1.25}>
          <Typography variant="h4" fontWeight={800}>
            {t('arena.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720 }}>
            {t('arena.listSubtitle', { count: total })}
          </Typography>
        </Stack>
      </CardContent>

      <Box
        sx={{
          position: 'absolute',
          right: { xs: -24, md: 24 },
          bottom: { xs: -24, md: 8 },
          opacity: 0.08,
          pointerEvents: 'none',
        }}
      >
        <Logo sx={{ width: { xs: 200, md: 280 }, height: { xs: 200, md: 280 } }} />
      </Box>
    </Card>
  );
};

export default ArenaListPageHeroCard;
