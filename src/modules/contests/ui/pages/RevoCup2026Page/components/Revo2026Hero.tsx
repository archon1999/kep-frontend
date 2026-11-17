import { Box, Button, Stack, Typography } from '@mui/material';
import type { CompetitionEventModel } from 'modules/contests/application/hooks/useCompetitionEvent';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import MixedText from 'shared/components/common/MixedText';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import { PageHeroSurface } from 'shared/components/sections/common/PageHeader';

export const Revo2026Hero = ({ model }: { model: CompetitionEventModel }) => {
  const { event, common, copy, live, currentStage, countdown, formatters } = model;
  return (
    <Box
      component={PageHeroSurface}
      className="event-hero event-revo26-hero"
      aria-labelledby="event-title"
    >
      <Typography className="event-kicker">{copy('context')}</Typography>
      <Box className="event-hero-grid" sx={{ mt: 3 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="h1"
            id="event-title"
            aria-label={copy('title')}
            className="event-display"
          >
            <MixedText>REVO CUP</MixedText>
            <Typography component="span" variant="pixel" className="event-year">
              2026
            </Typography>
          </Typography>
          <Typography className="event-summary" color="text.secondary" sx={{ mt: 3 }}>
            {copy('summary')}
          </Typography>
          <Stack direction="row" gap={1.5} className="event-actions" sx={{ mt: 3 }} flexWrap="wrap">
            <Button
              component="a"
              href="#schedule"
              variant="contained"
              endIcon={<IconifyIcon icon="mdi:arrow-right" />}
            >
              {common('viewSchedule')}
            </Button>
            <Button component="a" href="#rules" variant="outlined">
              {common('readRules')}
            </Button>
          </Stack>
        </Box>
        <Box className="event-revo26-signal">
          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
            <Typography className="event-kicker">{copy('fundLabel')}</Typography>
            <IconifyIcon icon="mdi:trophy-outline" sx={{ fontSize: 30, color: 'secondary.main' }} />
          </Stack>
          <Typography
            component="strong"
            variant="metric"
            className="event-fund-value"
            sx={{ display: 'block', lineHeight: 1, mt: 2 }}
          >
            {formatters.number.format(event.fund)}
          </Typography>
          <Typography component="p" variant="h6" sx={{ mt: 1 }}>
            {common('currency')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {copy('fundNote')}
          </Typography>
          <Box sx={{ borderTop: 1, borderColor: 'divider', mt: 3, pt: 3 }}>
            {currentStage ? (
              <>
                <Typography className="event-kicker">
                  {common(live ? 'endsIn' : 'startsIn')} · {common(`stages.${currentStage.key}`)}
                </Typography>
                <Stack
                  direction="row"
                  gap={{ xs: 2, md: 3 }}
                  sx={{ mt: 2 }}
                  aria-label={common('countdown')}
                  aria-live="off"
                >
                  {countdown.map((part) => (
                    <Box key={part.key}>
                      <Typography
                        variant="metric"
                        sx={{ fontSize: { xs: 26, md: 34 }, fontVariantNumeric: 'tabular-nums' }}
                      >
                        {String(part.value).padStart(2, '0')}
                      </Typography>
                      <Typography className="event-kicker" sx={{ mt: 0.5 }}>
                        {common(part.key)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </>
            ) : (
              <PatternArtwork kind="competitions" sx={{ width: 180 }} />
            )}
          </Box>
          <Typography variant="body2" sx={{ mt: 3 }}>
            <strong>{event.finalists}</strong> · {copy('finalistsLabel')}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
