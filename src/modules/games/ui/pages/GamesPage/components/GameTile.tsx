import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Box, Stack, Typography } from '@mui/material';
import type { GameId } from 'modules/games/domain';
import { gamePath } from 'modules/games/ui/shared';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import GameCardProgress from './GameCardProgress';
import { gamePreviewSrc } from './gameAssets';

type Props = { id: GameId; best?: number; featured?: boolean };

const GameTile = ({ id, best, featured = false }: Props) => {
  const { t } = useTranslation();
  const title = t(`games.catalog.${id}.title`);
  const isWorld = id === 'keppy-world';
  const isCompactFeature = id === 'code-islands' && featured;
  const isWideQuick = id === 'memory-grid' && !featured;

  return (
    <Box
      component={RouterLink}
      to={gamePath(id)}
      aria-label={`${t('games.play')} ${title}`}
      sx={(theme) => ({
        display: 'flex',
        flexDirection: featured
          ? { xs: isCompactFeature ? 'row' : 'column', md: 'row' }
          : isWideQuick
            ? { xs: 'row', lg: 'column' }
            : 'column',
        gridColumn: isWideQuick ? { xs: '1 / -1', lg: 'auto' } : undefined,
        minWidth: 0,
        overflow: 'hidden',
        borderRadius: 3,
        bgcolor: 'background.elevation1',
        color: 'text.primary',
        textDecoration: 'none',
        transition: 'transform 180ms ease, box-shadow 180ms ease',
        ...theme.applyStyles('dark', { bgcolor: 'background.elevation2' }),
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 14px 30px -24px rgba(15, 43, 72, .6)',
        },
        '&:focus-visible': { outline: '3px solid', outlineColor: 'primary.main', outlineOffset: 2 },
      })}
    >
      <Box
        sx={{
          flexShrink: 0,
          width: featured
            ? { xs: isCompactFeature ? '42%' : '100%', md: isWorld ? '53%' : '55%' }
            : isWideQuick
              ? { xs: '43%', lg: '100%' }
              : '100%',
          height: featured
            ? { xs: isCompactFeature ? 168 : 205, md: 232 }
            : isWideQuick
              ? { xs: 144, lg: 'auto' }
              : undefined,
          aspectRatio: featured
            ? undefined
            : isWideQuick
              ? { xs: undefined, lg: '16 / 9' }
              : '16 / 9',
          bgcolor: isWorld ? '#CDEDF2' : id === 'code-islands' ? '#254E78' : '#D8EDF7',
          overflow: 'hidden',
          display: id === 'code-islands' ? 'grid' : undefined,
          placeItems: id === 'code-islands' ? 'center' : undefined,
        }}
      >
        <Box
          component="img"
          src={gamePreviewSrc(id)}
          alt=""
          sx={{
            display: 'block',
            width: id === 'code-islands' ? 'auto' : '100%',
            height: id === 'code-islands' ? 'auto' : '100%',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            borderRadius: id === 'code-islands' ? '11px' : 0,
          }}
        />
      </Box>
      <Stack
        justifyContent="center"
        sx={{
          flex: 1,
          minWidth: 0,
          p: featured
            ? { xs: isCompactFeature ? 1.75 : 2.25, md: 2.75 }
            : { xs: 1.5, sm: 2, md: 2.25 },
        }}
      >
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            <Typography
              component={featured ? 'h2' : 'h3'}
              sx={{
                fontSize: featured
                  ? { xs: isCompactFeature ? 21 : 23, md: 24 }
                  : { xs: 17, sm: 19, md: 20 },
                fontWeight: 600,
                lineHeight: 1.2,
                letterSpacing: '-0.015em',
              }}
            >
              {title}
            </Typography>
            {!featured && (
              <IconifyIcon
                icon="mdi:arrow-up-right"
                width={20}
                sx={{ color: 'primary.main', flexShrink: 0 }}
              />
            )}
          </Stack>
          <Box sx={{ mt: featured ? (isCompactFeature ? 1 : 1.5) : 0.75 }}>
            <GameCardProgress id={id} best={best} />
          </Box>
        </Box>
        {featured ? (
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{ color: 'primary.main', mt: isCompactFeature ? { xs: 1.5, md: 2.5 } : 2.5 }}
          >
            <Typography variant="subtitle2" fontWeight={600}>
              {t('games.play')}
            </Typography>
            <IconifyIcon icon="mdi:arrow-up-right" width={19} />
          </Stack>
        ) : null}
      </Stack>
    </Box>
  );
};

export default GameTile;
