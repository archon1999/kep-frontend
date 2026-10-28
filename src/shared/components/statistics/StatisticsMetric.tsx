import { ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import StatisticsSection from './StatisticsSection';

export interface StatisticsMetricProps {
  label: string;
  value?: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  valueColor?: string;
  embedded?: boolean;
  layout?: 'stacked' | 'inline';
}

const StatisticsMetric = ({
  label,
  value,
  subtitle,
  icon,
  valueColor,
  embedded,
  layout = 'stacked',
}: StatisticsMetricProps) => (
  <StatisticsSection sx={embedded ? { outline: 0, p: 0 } : undefined}>
    <Stack
      component="dl"
      spacing={1}
      sx={{
        m: 0,
        ...(layout === 'inline' && {
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) auto',
          alignItems: 'center',
          columnGap: 2,
        }),
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems={layout === 'inline' ? 'center' : 'flex-start'}
        gap={1}
      >
        <Typography
          component="dt"
          variant="label"
          color="text.secondary"
          sx={{ minHeight: layout === 'inline' ? undefined : '3em' }}
        >
          {label}
        </Typography>
        {icon && (
          <Box
            aria-hidden
            sx={{ color: 'primary.main', display: 'flex', flexShrink: 0, fontSize: 20 }}
          >
            {icon}
          </Box>
        )}
      </Stack>
      <Typography
        component="dd"
        variant="metric"
        color={valueColor ?? 'text.primary'}
        sx={{
          m: 0,
          fontSize: layout === 'inline' ? 28 : { xs: 28, md: 34 },
          overflowWrap: 'anywhere',
        }}
      >
        {value ?? '—'}
      </Typography>
      {subtitle && (
        <Typography
          component="dd"
          variant="body2"
          color="text.secondary"
          sx={{
            m: 0,
            overflowWrap: 'anywhere',
            ...(layout === 'inline' && { gridColumn: '1 / -1' }),
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Stack>
  </StatisticsSection>
);

export default StatisticsMetric;
