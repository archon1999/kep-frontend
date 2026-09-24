import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Menu, MenuItem, Stack, Typography } from '@mui/material';
import type { Level } from 'modules/kepper-game/domain/entities';
import IconifyIcon from 'shared/components/base/IconifyIcon';

type LevelNavigatorProps = {
  levels: readonly Level[];
  selected: number;
  unlocked: number;
  completed: readonly number[];
  score: number;
  stars: Record<number, number>;
  playing: boolean;
  onSelect: (level: number) => void;
};

const LevelNavigator = ({
  levels,
  selected,
  unlocked,
  completed,
  score,
  stars,
  playing,
  onSelect,
}: LevelNavigatorProps) => {
  const { t } = useTranslation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const level = levels.find((item) => item.id === selected) ?? levels[0];

  return (
    <Box sx={{ pb: { xs: 1.5, md: 2 } }}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={2}>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              color: 'primary.main',
              fontSize: 11,
              fontWeight: 750,
              letterSpacing: '0.055em',
              lineHeight: 1.4,
            }}
          >
            {t(level.conceptKey)}
          </Typography>
          <Typography
            component="h2"
            sx={{ mt: 0.25, mb: 0, fontSize: { xs: 20, md: 25 }, fontWeight: 750, lineHeight: 1.2 }}
          >
            {t(level.titleKey)}
          </Typography>
        </Box>
        <Stack alignItems="flex-end" spacing={0.1} sx={{ flexShrink: 0 }}>
          <Button
            size="small"
            disabled={playing}
            onClick={(event) => setAnchor(event.currentTarget)}
            aria-label={t('game.levelSelector')}
            aria-expanded={Boolean(anchor)}
            endIcon={<IconifyIcon icon="mdi:chevron-down" width={17} />}
            sx={{
              minWidth: 0,
              px: 0.5,
              py: 0,
              color: 'text.primary',
              fontSize: 14,
              fontWeight: 750,
              fontVariantNumeric: 'tabular-nums',
              textTransform: 'none',
            }}
          >
            {String(selected).padStart(2, '0')}
            <Box component="span" sx={{ color: 'text.disabled', fontWeight: 500, mx: 0.35 }}>
              /
            </Box>
            {String(levels.length).padStart(2, '0')}
          </Button>
          <Typography
            sx={{ color: 'text.secondary', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}
            aria-label={t('game.totalScore', { score })}
          >
            {score} {t('game.scoreLabel')}
          </Typography>
        </Stack>
      </Stack>
      <Typography color="text.secondary" sx={{ mt: 0.9, fontSize: 14, lineHeight: 1.5 }}>
        {t(level.descriptionKey)}
      </Typography>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        MenuListProps={{ 'aria-label': t('game.levelSelector') }}
        slotProps={{
          paper: {
            sx: {
              width: { xs: 260, sm: 310 },
              maxHeight: 410,
              mt: 0.75,
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#192c42' : '#fff'),
              boxShadow: '0 18px 42px rgba(13, 38, 67, .18)',
            },
          },
        }}
      >
        {levels.map((item) => {
          const finished = completed.includes(item.id);
          return (
            <MenuItem
              key={item.id}
              selected={item.id === selected}
              disabled={playing || item.id > unlocked}
              onClick={() => {
                onSelect(item.id);
                setAnchor(null);
              }}
              sx={{ gap: 1.5, py: 1 }}
            >
              <Typography
                sx={{
                  width: 24,
                  fontSize: 12,
                  fontWeight: 750,
                  fontVariantNumeric: 'tabular-nums',
                }}
                color={item.id === selected ? 'primary.main' : 'text.secondary'}
              >
                {String(item.id).padStart(2, '0')}
              </Typography>
              <Typography
                sx={{ flex: 1, fontSize: 13, fontWeight: item.id === selected ? 700 : 500 }}
              >
                {t(item.titleKey)}
              </Typography>
              {finished && (
                <Typography sx={{ color: 'success.main', fontSize: 12 }}>
                  {'★'.repeat(stars[item.id] ?? 1)}
                </Typography>
              )}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};

export default LevelNavigator;
