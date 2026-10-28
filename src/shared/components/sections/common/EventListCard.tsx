import { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router';
import { Box, Button, Chip, Grid, Link, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { listRuleStyles } from 'app/theme/styles/listPage';
import { contentEntranceStyles } from 'app/theme/styles/transitions';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { PointerSpotlight, ScrambleText } from 'shared/components/motion/InteractionEffects';
import { formatDateTime } from 'shared/lib/dateTime';

interface EventField {
  label: string;
  icon: string;
  value: ReactNode;
}

interface EventListCardProps {
  id: number;
  title: string;
  titleComponent?: 'h2' | 'h3';
  titleMinLines?: number;
  href: string;
  category: string;
  icon: string;
  actionLabel: string;
  badges?: ReactNode;
  media?: ReactNode;
  children?: ReactNode;
  details: EventField[];
  metrics: EventField[];
  loading?: boolean;
}

export const EventDate = ({ value, fallback = '—' }: { value?: string; fallback?: string }) =>
  value ? (
    <Box
      component="time"
      dateTime={value}
      sx={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 1 }}
    >
      <Typography variant="metric" sx={{ fontSize: 24 }}>
        {formatDateTime(value, 'time')}
      </Typography>
      <Typography component="span" variant="body2" color="text.secondary">
        {formatDateTime(value, 'compactDate')}
      </Typography>
    </Box>
  ) : (
    <Typography component="span" variant="body2" color="text.secondary">
      {fallback}
    </Typography>
  );

const EventListCard = ({
  id,
  title,
  titleComponent = 'h2',
  titleMinLines,
  href,
  category,
  icon,
  badges,
  media,
  children,
  details,
  metrics,
  actionLabel,
  loading = false,
}: EventListCardProps) => (
  <Paper
    component="article"
    variant="panel"
    aria-labelledby={loading ? undefined : `event-title-${id}`}
    aria-busy={loading || undefined}
    sx={{
      ...contentEntranceStyles,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderInline: 0,
      borderTop: 0,
    }}
  >
    <Box
      component={PointerSpotlight}
      sx={{
        px: { xs: 2.5, md: 4 },
        py: { xs: 2.5, md: 3 },
        background:
          'linear-gradient(120deg, transparent 35%, color-mix(in srgb, var(--kep-logo-ice) 5%, transparent))',
      }}
    >
      <Stack
        direction="row"
        gap={1.5}
        useFlexGap
        flexWrap="wrap"
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" gap={1} alignItems="center" sx={{ minWidth: 0 }}>
          <Chip
            variant="category"
            icon={
              loading ? (
                <Skeleton variant="rectangular" width={16} height={16} />
              ) : (
                <IconifyIcon icon={icon} />
              )
            }
            label={loading ? <Skeleton width={160} /> : category}
            sx={{
              maxWidth: '100%',
              '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' },
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {loading ? <Skeleton width={24} /> : `/${String(id).padStart(3, '0')}`}
          </Typography>
        </Stack>
        {badges && (
          <Stack direction="row" gap={1} flexWrap="wrap">
            {badges}
          </Stack>
        )}
      </Stack>
      <Stack direction="row" alignItems="center" gap={2} sx={{ mt: 2.5 }}>
        <Typography
          component={titleComponent}
          variant="h3"
          id={loading ? undefined : `event-title-${id}`}
          sx={{
            flex: 1,
            minWidth: 0,
            fontSize: 'clamp(26px, 2.4vw, 36px)',
            lineHeight: 1.2,
            minHeight: titleMinLines ? { lg: `${titleMinLines * 1.2}em` } : undefined,
            fontFamily: 'var(--kep-display-font)',
            fontFeatureSettings: 'normal',
            overflowWrap: 'anywhere',
          }}
        >
          {loading ? (
            <Skeleton width="75%" height="1.2em" />
          ) : (
            <Link
              component={RouterLink}
              to={href}
              underline="none"
              color="inherit"
              sx={{
                display: 'block',
                '&:focus-visible': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: 4,
                },
                '& .kep-scramble': { whiteSpace: 'normal', overflowWrap: 'anywhere' },
                '& .kep-scramble-visual': {
                  color: 'transparent',
                  background:
                    'linear-gradient(105deg, var(--kep-logo-sand), var(--kep-logo-mid) 40%, var(--kep-logo-ice))',
                  backgroundClip: 'text',
                },
              }}
            >
              <ScrambleText mixed>{title}</ScrambleText>
            </Link>
          )}
        </Typography>
        {media}
      </Stack>
    </Box>
    <Box sx={listRuleStyles} aria-hidden="true" />
    {children && <Box sx={{ px: { xs: 2.5, md: 4 }, py: 2 }}>{children}</Box>}
    <Box
      component="dl"
      sx={{
        m: 0,
        mt: 'auto',
        px: { xs: 2.5, md: 4 },
        py: 2.5,
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: `repeat(${details.length}, minmax(0, 1fr))` },
        gap: 2.5,
      }}
    >
      {details.map((field) => (
        <Box key={field.label} sx={{ minWidth: 0 }}>
          <Typography
            component="dt"
            variant="label"
            color="text.secondary"
            sx={{ display: 'flex', gap: 0.75, alignItems: 'center', mb: 1 }}
          >
            {loading ? (
              <Skeleton width={80} height={18} />
            ) : (
              <>
                <IconifyIcon icon={field.icon} sx={{ color: 'primary.main', fontSize: 16 }} />
                {field.label}
              </>
            )}
          </Typography>
          <Box component="dd" sx={{ m: 0, overflowWrap: 'anywhere' }}>
            {field.value}
          </Box>
        </Box>
      ))}
    </Box>
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      gap={3}
      alignItems={{ sm: 'center' }}
      sx={{ p: { xs: 2.5, md: 4 }, py: { xs: 2.5, md: 2.5 }, borderTop: 1, borderColor: 'divider' }}
    >
      <Box component="dl" sx={{ display: 'flex', flex: 1, gap: 2.5, m: 0, flexWrap: 'wrap' }}>
        {metrics.map((field) => (
          <Box key={field.label} sx={{ minWidth: 0 }}>
            <Typography
              component="dt"
              variant="label"
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}
            >
              {loading ? (
                <Skeleton width={90} height={18} />
              ) : (
                <>
                  <IconifyIcon icon={field.icon} sx={{ color: 'primary.main', fontSize: 16 }} />
                  {field.label}
                </>
              )}
            </Typography>
            <Typography component="dd" variant="metric" sx={{ m: 0, mt: 0.75, fontSize: 28 }}>
              {field.value}
            </Typography>
          </Box>
        ))}
      </Box>
      <Button
        {...(!loading ? { component: RouterLink, to: href } : { disabled: true })}
        aria-hidden={loading || undefined}
        variant="contained"
        endIcon={
          loading ? (
            <Skeleton variant="rectangular" width={16} height={16} />
          ) : (
            <IconifyIcon icon="mdi:arrow-right" />
          )
        }
        sx={{
          flexShrink: 0,
          alignSelf: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
        }}
      >
        {loading ? (
          <Skeleton width={110} height="1.429em" />
        ) : (
          <ScrambleText>{actionLabel}</ScrambleText>
        )}
      </Button>
    </Stack>
  </Paper>
);

export default EventListCard;

export const EventListCardSkeleton = ({
  description = false,
  media = false,
  titleMinLines,
  detailCount = 3,
  metricCount = 3,
  badgeCount = 2,
  firstDetailIsDate = false,
}: {
  description?: boolean;
  media?: boolean | { width: number; height: number; mobile?: boolean };
  titleMinLines?: number;
  detailCount?: number;
  metricCount?: number;
  badgeCount?: number;
  firstDetailIsDate?: boolean;
}) => (
  <EventListCard
    loading
    id={0}
    title=""
    titleMinLines={titleMinLines}
    href=""
    category=""
    icon=""
    actionLabel=""
    badges={
      badgeCount ? (
        <>
          {Array.from({ length: badgeCount }, (_, index) => (
            <Skeleton key={index} variant="rounded" width={68} height={30} />
          ))}
        </>
      ) : undefined
    }
    media={
      media ? (
        <Skeleton
          variant="rectangular"
          width={typeof media === 'object' ? media.width : 100}
          height={typeof media === 'object' ? media.height : 60}
          sx={{
            display: {
              xs: typeof media === 'object' && media.mobile ? 'block' : 'none',
              sm: 'block',
            },
            flexShrink: 0,
          }}
        />
      ) : undefined
    }
    details={Array.from({ length: detailCount }, (_, index) => ({
      label: String(index),
      icon: '',
      value: (
        <Typography
          variant={index === 0 && !firstDetailIsDate ? 'body2' : 'metric'}
          sx={{ fontSize: index === 0 && !firstDetailIsDate ? 14 : 24 }}
        >
          <Skeleton
            width={index === 0 ? 120 : 160}
            height={index === 0 && !firstDetailIsDate ? '1.5em' : '1.2em'}
            sx={{ maxWidth: '100%' }}
          />
        </Typography>
      ),
    }))}
    metrics={Array.from({ length: metricCount }, (_, index) => ({
      label: String(index),
      icon: '',
      value: <Skeleton width={64} height="1.2em" />,
    }))}
  >
    {description ? (
      <Box>
        <Skeleton width="95%" height={24} />
        <Skeleton width="80%" height={24} />
      </Box>
    ) : undefined}
  </EventListCard>
);

export const EventListSkeletons = ({
  columns = 1,
  count = columns * 2,
  ...props
}: { columns?: 1 | 2; count?: number } & Parameters<typeof EventListCardSkeleton>[0]) => (
  <Grid container spacing={0}>
    {Array.from({ length: count }, (_, index) => (
      <Grid
        key={index}
        size={{ xs: 12, lg: columns === 2 ? 6 : 12 }}
        sx={{
          minWidth: 0,
          borderRight: { lg: columns === 2 && index % 2 === 0 ? '1px solid var(--kep-line)' : 0 },
        }}
      >
        <EventListCardSkeleton {...props} />
      </Grid>
    ))}
  </Grid>
);
