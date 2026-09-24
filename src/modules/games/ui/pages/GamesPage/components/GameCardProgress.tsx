import { useTranslation } from 'react-i18next';
import { Box, Stack, Typography } from '@mui/material';
import { orange } from 'app/theme/palette/colors';
import type { GameId } from 'modules/games/domain';
import { gamesCatalog } from 'modules/games/ui/shared';
import IconifyIcon from 'shared/components/base/IconifyIcon';

type Props = { id: GameId; best?: number };

const MAX_SCORE = 1000;

const GameCardProgress = ({ id, best }: Props) => {
  const { t } = useTranslation();
  const game = gamesCatalog.find((entry) => entry.id === id);
  const score = Math.max(0, Math.min(MAX_SCORE, best ?? 0));
  const progress = Math.round((score / MAX_SCORE) * 100);

  if (!score) {
    return (
      <Stack direction="row" alignItems="center" spacing={0.75} sx={{ minWidth: 0 }}>
        <IconifyIcon
          icon={game?.icon ?? 'mdi:gamepad-variant-outline'}
          width={18}
          sx={{ flexShrink: 0, color: 'text.secondary' }}
        />
        <Typography variant="body2" color="text.secondary">
          {t(`games.catalog.${id}.type`)}
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={1}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={1}
      >
        <Stack direction="row" alignItems="center" spacing={0.75} sx={{ minWidth: 0 }}>
          <IconifyIcon
            icon={game?.icon ?? 'mdi:gamepad-variant-outline'}
            width={20}
            sx={{ flexShrink: 0, color: 'text.secondary' }}
          />
          <Typography variant="body2" color="text.secondary">
            {t(`games.catalog.${id}.type`)}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <IconifyIcon icon="mdi:trophy-outline" width={20} sx={{ color: 'text.secondary' }} />
          <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums' }}>
            {score.toLocaleString()} / {MAX_SCORE.toLocaleString()}
          </Typography>
        </Stack>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box
          role="progressbar"
          aria-label={t('games.personalBest')}
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={MAX_SCORE}
          sx={(theme) => ({
            flex: 1,
            minWidth: 0,
            height: 7,
            overflow: 'hidden',
            borderRadius: 6,
            bgcolor: orange[100],
            ...theme.applyStyles('dark', { bgcolor: orange[900] }),
          })}
        >
          <Box
            sx={{
              width: `${progress}%`,
              height: '100%',
              borderRadius: 'inherit',
              bgcolor: orange[500],
              transition: 'width 300ms ease',
            }}
          />
        </Box>
        <Typography
          component="span"
          sx={{
            minWidth: 46,
            textAlign: 'right',
            fontSize: 16,
            fontWeight: 500,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {progress}%
        </Typography>
      </Stack>
    </Stack>
  );
};

export default GameCardProgress;
