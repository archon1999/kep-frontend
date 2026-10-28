import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import MixedText from 'shared/components/common/MixedText';

const ProblemIntro = ({
  symbol,
  title,
  timeLimit,
  memoryLimit,
  metadata,
}: {
  symbol?: string;
  title: string;
  timeLimit: number;
  memoryLimit: number;
  metadata?: ReactNode;
}) => {
  const { t } = useTranslation();
  return (
    <Box component="header" sx={{ pb: 2, borderBottom: 1, borderColor: 'divider' }}>
      <Stack direction="row" gap={1.25} alignItems="baseline">
        <Typography variant="metric" color="text.secondary" sx={{ fontSize: 18, flexShrink: 0 }}>
          {symbol}
        </Typography>
        <Typography
          component="h1"
          sx={{
            fontFamily: 'var(--kep-display-font)',
            fontSize: { xs: 22, md: 26 },
            lineHeight: 1.3,
            fontWeight: 500,
            overflowWrap: 'anywhere',
          }}
        >
          <MixedText>{title}</MixedText>
        </Typography>
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap"
        gap={1.5}
        sx={{ mt: 1.25, color: 'text.secondary', '& .MuiChip-root': { height: 24, fontSize: 12 } }}
      >
        {metadata}
        {[
          {
            label: t('problems.detail.timeLimit'),
            value: timeLimit + ' ms',
            icon: 'mdi:timer-outline',
          },
          {
            label: t('problems.detail.memoryLimit'),
            value: memoryLimit + ' MB',
            icon: 'mdi:memory',
          },
        ].map((item) => (
          <Tooltip key={item.icon} title={item.label}>
            <Stack
              direction="row"
              gap={0.6}
              alignItems="center"
              aria-label={item.label + ': ' + item.value}
            >
              <IconifyIcon icon={item.icon} sx={{ fontSize: 15 }} />
              <Typography variant="body2" sx={{ fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>
                {item.value}
              </Typography>
            </Stack>
          </Tooltip>
        ))}
      </Stack>
    </Box>
  );
};
export default ProblemIntro;
