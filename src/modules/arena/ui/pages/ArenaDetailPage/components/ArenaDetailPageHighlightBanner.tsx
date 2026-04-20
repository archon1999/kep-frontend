import { Box, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { ArenaHighlight } from 'modules/arena/domain/entities/arena-highlight.entity.ts';

interface ArenaDetailPageHighlightBannerProps {
  highlight?: ArenaHighlight;
}

const highlightIconByKey: Record<string, string> = {
  top_streak: 'mdi:fire',
  top_performance: 'mdi:chart-line',
  top_win_rate: 'mdi:target',
  top_player: 'mdi:crown',
  arena_volume: 'mdi:sword-cross',
  participant_count: 'mdi:account-group',
  streak_rule: 'mdi:fire',
  buchholz_rule: 'mdi:calculator-variant',
  performance_rule: 'mdi:chart-timeline-variant',
  win_rate_rule: 'mdi:percent',
  queue_rule: 'mdi:account-switch',
};

const highlightIconByKind: Record<ArenaHighlight['kind'], string> = {
  achievement: 'mdi:trophy-award',
  fact: 'mdi:lightbulb-on',
  statistic: 'mdi:chart-box',
};

const getHighlightIcon = (highlight: ArenaHighlight) =>
  highlightIconByKey[highlight.key] ?? highlightIconByKind[highlight.kind];

const ArenaDetailPageHighlightBanner = ({ highlight }: ArenaDetailPageHighlightBannerProps) => {
  if (!highlight || (!highlight.title && !highlight.message)) {
    return null;
  }

  const color = highlight.tone;

  return (
    <Box
      aria-live="polite"
      sx={(theme) => ({
        width: '100%',
        maxWidth: { md: 460 },
        flex: { md: 1 },
        minWidth: 0,
        px: { xs: 1.5, sm: 2 },
        py: 1.25,
        borderRadius: 1,
        background: alpha(theme.palette[color].main, 0.1),
      })}
    >
      <Stack direction="row" spacing={1.25} alignItems="flex-start" minWidth={0}>
        <Box
          sx={(theme) => ({
            width: 32,
            height: 32,
            borderRadius: 1,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: '0 0 auto',
            color: theme.palette[color].main,
          })}
        >
          <IconifyIcon icon={getHighlightIcon(highlight)} fontSize={22} />
        </Box>
        <Stack direction="column" spacing={0.25} minWidth={0}>
          {highlight.title ? (
            <Typography
              fontWeight={600}
              color={`${color}.main`}
              sx={{ letterSpacing: 0, lineHeight: 1.25 }}
            >
              {highlight.title}
            </Typography>
          ) : null}
          {highlight.message ? (
            <Typography
              variant="body2"
              color="text.primary"
              sx={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                overflow: 'hidden',
                overflowWrap: 'anywhere',
                lineHeight: 1.35,
              }}
            >
              {highlight.message}
            </Typography>
          ) : null}
        </Stack>
      </Stack>
    </Box>
  );
};

export default ArenaDetailPageHighlightBanner;
