import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Box, Stack, Typography } from '@mui/material';
import { contentHeadingSx } from 'app/theme/styles/content';
import type { GameId } from 'modules/games/domain';
import { gamePath } from 'modules/games/ui/shared';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import MixedText from 'shared/components/common/MixedText';
import GameCardProgress from './GameCardProgress';
import { gamePreviewSrc } from './gameAssets';

type Props = { id: GameId; best?: number; featured?: boolean };

const GameTile = ({ id, best, featured = false }: Props) => {
  const { t } = useTranslation();
  const title = t(`games.catalog.${id}.title`);
  return (
    <Box
      component={RouterLink}
      to={gamePath(id)}
      aria-label={`${t('games.play')} ${title}`}
      sx={{
        display: 'flex',
        flexDirection: featured ? { xs: 'column', sm: 'row' } : 'column',
        height: '100%',
        minWidth: 0,
        color: 'text.primary',
        textDecoration: 'none',
        position: 'relative',
        '&:hover .game-title, &:focus-visible .game-title': { color: 'primary.main' },
        '&:hover .game-arrow': { transform: 'translate(3px, -3px)' },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: -2,
        },
        '@media (prefers-reduced-motion: reduce)': { '& .game-arrow': { transition: 'none' } },
      }}
    >
      <Box
        sx={{
          width: featured ? { xs: '100%', sm: '45%' } : '100%',
          flexShrink: 0,
          aspectRatio: '16 / 9',
          maxHeight: featured ? 220 : 190,
          overflow: 'hidden',
          bgcolor: 'action.hover',
          border: 0,
          borderStyle: 'solid',
          borderBottomWidth: featured ? { xs: 1, sm: 0 } : 1,
          borderRightWidth: featured ? { xs: 0, sm: 1 } : 0,
          borderColor: 'divider',
        }}
      >
        <Box
          component="img"
          src={gamePreviewSrc(id)}
          alt=""
          loading="lazy"
          sx={{ width: 1, height: 1, display: 'block', objectFit: 'cover' }}
        />
      </Box>
      <Stack gap={1.5} justifyContent="center" sx={{ p: { xs: 2.5, md: 3 }, minWidth: 0, flex: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
          <Typography
            className="game-title"
            component={featured ? 'h2' : 'h3'}
            sx={{ ...contentHeadingSx, fontSize: { xs: 21, md: 24 } }}
          >
            <MixedText>{title}</MixedText>
          </Typography>
          <IconifyIcon
            className="game-arrow"
            icon="mdi:arrow-up-right"
            width={22}
            sx={{ color: 'primary.main', flexShrink: 0, transition: 'transform 180ms ease' }}
          />
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          {t(`games.catalog.${id}.description`)}
        </Typography>
        <Box sx={{ mt: 'auto', pt: 0.5 }}>
          <GameCardProgress id={id} best={best} />
        </Box>
        {featured && (
          <Typography variant="button" color="primary.main">
            {t('games.play')}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};
export default GameTile;
