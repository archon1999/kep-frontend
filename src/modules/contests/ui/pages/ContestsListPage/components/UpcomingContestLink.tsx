import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Box, Chip, Stack, Typography, chipClasses } from '@mui/material';
import { getEventHighlightStyles } from 'app/theme/styles/listPage';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { ScrambleText } from 'shared/components/motion/InteractionEffects';
import { formatDateTime } from 'shared/lib/dateTime';

interface UpcomingContestLinkProps {
  title: string;
  startTime: string;
  href: string;
}

const UpcomingContestLink = ({ title, startTime, href }: UpcomingContestLinkProps) => {
  const { t } = useTranslation();

  return (
    <Box
      component={Link}
      to={href}
      sx={(theme) => ({
        ...getEventHighlightStyles(theme, 'upcoming'),
        backgroundColor: 'var(--kep-bg)',
        border: '1px solid var(--kep-line)',
        display: 'grid',
        gridTemplateColumns: { xs: 'minmax(0, 1fr) auto', md: 'minmax(0, 1fr) auto auto' },
        gridTemplateAreas: { xs: '"identity arrow" "time time"', md: '"identity time arrow"' },
        alignItems: 'center',
        columnGap: { xs: 1.5, md: 2 },
        rowGap: 0.75,
        py: 2,
        pl: { xs: 2, sm: 2.5 },
        pr: 2,
        color: 'var(--kep-text)',
        textAlign: 'start',
        textDecoration: 'none',
        '&:hover, &:focus-visible': {
          borderColor: 'var(--kep-logo-ice)',
          '& .contests-upcoming-arrow': { color: 'var(--kep-logo-ice)' },
        },
        '&:focus-visible': { outline: '2px solid var(--kep-logo-ice)', outlineOffset: 3 },
      })}
    >
      <Stack component="span" spacing={0.75} sx={{ gridArea: 'identity', minWidth: 0 }}>
        <Typography
          component="span"
          variant="label"
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            color: 'text.primary',
            letterSpacing: '0.02em',
            ...theme.applyStyles('dark', { color: theme.vars.palette.common.white }),
          })}
        >
          <IconifyIcon icon="mdi:clock-outline" fontSize={16} color="warning.main" aria-hidden />
          {t('contests.nextContest')}
        </Typography>
        <Typography
          component="span"
          variant="h5"
          sx={{
            fontFamily: 'var(--kep-reading-font)',
            fontWeight: 500,
            lineHeight: 1.2,
            letterSpacing: '-0.025em',
            overflowWrap: 'anywhere',
          }}
        >
          <ScrambleText className="contest-title-text" mixed>
            {title}
          </ScrambleText>
        </Typography>
      </Stack>
      <Chip
        component="time"
        dateTime={startTime}
        variant="category"
        icon={<IconifyIcon icon="mdi:calendar-outline" aria-hidden />}
        label={t('contests.startsLabel', { date: formatDateTime(startTime, 'compactDateTime') })}
        sx={{
          gridArea: 'time',
          justifySelf: 'start',
          fontVariantNumeric: 'tabular-nums',
          [`& .${chipClasses.label}`]: { whiteSpace: 'normal' },
        }}
      />
      <Box
        component="span"
        className="contests-upcoming-arrow"
        aria-hidden="true"
        sx={{
          gridArea: 'arrow',
          display: 'grid',
          placeItems: 'center',
          height: 36,
          width: 36,
          border: '1px solid var(--kep-line)',
          color: 'text.secondary',
        }}
      >
        <IconifyIcon icon="mdi:arrow-top-right" fontSize={20} />
      </Box>
    </Box>
  );
};

export default UpcomingContestLink;
