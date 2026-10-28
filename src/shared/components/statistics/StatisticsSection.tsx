import { ReactNode, useId } from 'react';
import { Box, BoxProps, Stack, Typography } from '@mui/material';
import {
  statisticsHeadingSx,
  statisticsInset,
  statisticsPanelSx,
} from 'app/theme/styles/statistics';
import MixedText from 'shared/components/common/MixedText';

interface StatisticsSectionProps extends Omit<BoxProps, 'title'> {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

const StatisticsSection = ({
  title,
  subtitle,
  action,
  children,
  sx,
  ...rest
}: StatisticsSectionProps) => {
  const titleId = useId();
  return (
    <Box
      component="section"
      aria-labelledby={title ? titleId : undefined}
      {...rest}
      sx={[statisticsPanelSx, { p: statisticsInset }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      {(title || action) && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
          flexWrap="wrap"
          sx={{ mb: 2.5 }}
        >
          <Box sx={{ minWidth: 0, flex: '1 1 180px' }}>
            {title && (
              <Typography component="h2" id={titleId} sx={statisticsHeadingSx}>
                <MixedText>{title}</MixedText>
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {action && <Box sx={{ minWidth: 0, maxWidth: '100%' }}>{action}</Box>}
        </Stack>
      )}
      {children}
    </Box>
  );
};

export default StatisticsSection;
