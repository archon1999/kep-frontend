import { Box, Button, Stack, Typography } from '@mui/material';
import { getRankColor } from 'app/theme/colors/medals';
import type { CompetitionEventModel } from 'modules/contests/application/hooks/useCompetitionEvent';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import MixedText from 'shared/components/common/MixedText';
import { PageHeroSurface } from 'shared/components/sections/common/PageHeader';

const JuniorPodium = () => (
  <Box
    component="svg"
    viewBox="0 0 440 330"
    aria-hidden="true"
    focusable="false"
    sx={{ width: '100%', maxWidth: 460, height: 'auto', overflow: 'visible' }}
  >
    <g fill="none" stroke="var(--kep-logo-ice)" strokeWidth="1" opacity=".35">
      <path d="M0 55h82l24 24h42 M0 78h58l32 32h22 M440 70h-66l-24 24h-22 M440 93h-42l-24 24h-32 M20 275h52l22-22 M420 275h-40l-22-22" />
      <path d="M20 20h36 M20 20v36 M420 20h-36 M420 20v36 M20 310h36 M20 310v-36 M420 310h-36 M420 310v-36" />
      <circle cx="148" cy="79" r="3" />
      <circle cx="328" cy="94" r="3" />
    </g>
    {[
      { rank: 2, x: 35, y: 86, scale: 0.82 },
      { rank: 1, x: 151, y: 27, scale: 1 },
      { rank: 3, x: 296, y: 111, scale: 0.76 },
    ].map((cup) => (
      <g
        key={cup.rank}
        transform={`translate(${cup.x} ${cup.y}) scale(${cup.scale})`}
        stroke={getRankColor(cup.rank)}
        strokeWidth="1.5"
      >
        <path
          d="M20 24h100v56c0 66-100 66-100 0z"
          fill={`color-mix(in srgb, ${getRankColor(cup.rank)} 8%, transparent)`}
        />
        <path
          d="M20 36H2v34c0 26 26 32 30 32 M120 36h18v34c0 26-26 32-30 32 M70 128v32 M48 160h44 M37 176h66v12H37z M40 24v54c0 24 14 34 24 37"
          fill="none"
        />
        <text
          x="70"
          y="82"
          fill={getRankColor(cup.rank)}
          stroke="none"
          textAnchor="middle"
          fontSize="34"
          fontFamily="var(--kep-display-font)"
        >
          {String(cup.rank).padStart(2, '0')}
        </text>
      </g>
    ))}
    <g fill="none" stroke="var(--kep-line)" strokeWidth="1.2">
      <path d="M48 294v-38h112v38 M160 294v-70h124v70 M284 294v-24h108v24 M36 294h368" />
    </g>
  </Box>
);

export const JuniorHero = ({ model }: { model: CompetitionEventModel }) => {
  const { copy, common, event, formatters } = model;
  return (
    <Box
      component={PageHeroSurface}
      className="event-hero event-junior-hero"
      aria-labelledby="event-title"
    >
      <Box className="event-hero-grid">
        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="h1"
            id="event-title"
            aria-label={copy('title')}
            className="event-display"
            sx={{ maxWidth: 700 }}
          >
            <MixedText>KEP Junior</MixedText>
            <br />
            <MixedText>Algorithmics</MixedText>
            <Typography component="span" variant="pixel" className="event-year">
              2024
            </Typography>
          </Typography>
          <Typography className="event-summary" color="text.secondary" sx={{ mt: 3 }}>
            {copy('summary')}
          </Typography>
          <Stack direction="row" gap={1.5} className="event-actions" sx={{ mt: 3 }} flexWrap="wrap">
            <Button
              component="a"
              href="#results"
              variant="contained"
              endIcon={<IconifyIcon icon="mdi:arrow-right" />}
            >
              {common('viewResults')}
            </Button>
            <Button component="a" href="#schedule" variant="outlined">
              {common('viewSchedule')}
            </Button>
          </Stack>
        </Box>
        <Box sx={{ minWidth: 0, position: 'relative', textAlign: 'center' }}>
          <JuniorPodium />
          <Typography className="event-kicker">{copy('venue')}</Typography>
          <Typography component="p" variant="subtitle1" sx={{ mt: 1 }}>
            {formatters.date.format(new Date(event.stages[2].start))}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
