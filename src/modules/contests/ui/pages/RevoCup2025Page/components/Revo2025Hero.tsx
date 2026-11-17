import { Box, Button, Stack, Typography } from '@mui/material';
import type { CompetitionEventModel } from 'modules/contests/application/hooks/useCompetitionEvent';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import MixedText from 'shared/components/common/MixedText';
import { PageHeroSurface } from 'shared/components/sections/common/PageHeader';

export const Revo2025Hero = ({ model }: { model: CompetitionEventModel }) => {
  const { event, copy, common, formatters } = model;
  return (
    <Box
      component={PageHeroSurface}
      className="event-hero event-revo25-hero"
      aria-labelledby="event-title"
    >
      <Stack
        direction="row"
        gap={2}
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        sx={{ mb: 4 }}
      >
        <Typography className="event-kicker">{copy('context')}</Typography>
      </Stack>
      <Box className="event-hero-grid" sx={{ alignItems: 'stretch' }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="h1"
            id="event-title"
            aria-label={copy('title')}
            className="event-display"
          >
            <MixedText>REVO CUP</MixedText>
            <Typography component="span" variant="pixel" className="event-year">
              2025
            </Typography>
          </Typography>
          <Typography className="event-summary" sx={{ mt: 3 }} color="text.secondary">
            {copy('summary')}
          </Typography>
          <Button
            component="a"
            href="#results"
            variant="contained"
            className="event-actions"
            endIcon={<IconifyIcon icon="mdi:arrow-right" />}
            sx={{ mt: 3 }}
          >
            {common('viewResults')}
          </Button>
        </Box>
        <Box className="event-revo25-fund">
          <Typography className="event-kicker">{copy('fundLabel')}</Typography>
          <Typography
            component="strong"
            variant="metric"
            className="event-fund-value"
            sx={{ lineHeight: 1, mt: 3, display: 'block' }}
          >
            {formatters.number.format(event.fund)}
            <span style={{ color: 'var(--kep-logo-sand)' }}>+</span>
          </Typography>
          <Typography component="p" variant="h5" sx={{ mt: 1 }}>
            {common('currency')}
          </Typography>
          <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle1">05.04.2025 · {copy('venue')}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {copy('fundNote')}
            </Typography>
          </Box>
          <Box aria-hidden="true" className="event-code-mark">
            &lt;/&gt;
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
