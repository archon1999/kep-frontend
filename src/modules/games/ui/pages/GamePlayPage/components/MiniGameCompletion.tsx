import { useTranslation } from 'react-i18next';
import { Box, Button, Stack, Typography } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';

type Props = {
  score: number;
  best: number;
  title: string;
  detail: string;
  onReplay: () => void;
};

const MiniGameCompletion = ({ score, best, title, detail, onReplay }: Props) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 900,
        mx: 'auto',
        px: { xs: 2.5, sm: 3, md: 4 },
        py: { xs: 3, md: 4 },
        display: 'grid',
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1fr) 220px' },
        gridTemplateAreas: { xs: '"score" "summary"', md: '"summary score"' },
        alignItems: 'center',
        gap: { xs: 2, md: 4 },
      }}
    >
      <Stack sx={{ gridArea: 'summary', minWidth: 0 }} alignItems="flex-start" spacing={2.5}>
        <Box>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: 25, md: 29 },
              fontWeight: 700,
              lineHeight: 1.18,
              letterSpacing: '-0.035em',
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 1, maxWidth: 520, lineHeight: 1.6 }}
          >
            {detail}
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          onClick={onReplay}
          startIcon={<IconifyIcon icon="mdi:replay" width={20} />}
          sx={{ boxShadow: 'none' }}
        >
          {t('gamesMinis.common.playAgain')}
        </Button>
      </Stack>
      <Box
        sx={{
          gridArea: 'score',
          minWidth: 0,
        }}
      >
        <Stack direction="row" alignItems="baseline" spacing={0.75}>
          <Typography
            sx={{
              fontSize: { xs: 48, md: 60 },
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: '-0.055em',
              fontVariantNumeric: 'tabular-nums',
              color: 'primary.main',
            }}
          >
            {score}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('games.points')}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 1.5 }}>
          <IconifyIcon icon="mdi:trophy-outline" width={17} sx={{ color: 'warning.dark' }} />
          <Typography variant="body2" color="text.secondary">
            {t('gamesMinis.common.best', { best: Math.max(best, score) })}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default MiniGameCompletion;
