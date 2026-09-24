import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Stack, Typography } from '@mui/material';

interface GameFrameProps {
  best: number;
  score: number;
  progress: number;
  children: ReactNode;
  showStatus?: boolean;
}

const GameFrame = ({ best, score, progress, children, showStatus = true }: GameFrameProps) => {
  const { t } = useTranslation();
  const scoreUnit = t('gamesMinis.common.score', { score: '' }).trim();
  const bestLabel = t('gamesMinis.common.best', { best: '' })
    .replace(/[:：]\s*$/, '')
    .trim();
  const currentProgress = Math.max(0, Math.min(100, progress));
  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
      }}
    >
      {showStatus && (
        <Box sx={{ mb: { xs: 1.5, md: 2 } }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
            sx={{ py: 0.5 }}
          >
            <Stack direction="row" alignItems="center" gap={1}>
              <Stack direction="row" alignItems="baseline" gap={0.65}>
                <Typography
                  component="span"
                  sx={{
                    color: 'text.primary',
                    fontSize: { xs: 22, sm: 24 },
                    fontWeight: 700,
                    lineHeight: 1,
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '-0.045em',
                  }}
                >
                  {score}
                </Typography>
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                  fontWeight={600}
                >
                  {scoreUnit}
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" alignItems="center" gap={0.65} sx={{ flexShrink: 0 }}>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {bestLabel}
              </Typography>
              <Typography
                variant="body2"
                fontWeight={750}
                sx={{ color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}
              >
                {best}
              </Typography>
            </Stack>
          </Stack>
          <Box
            role="progressbar"
            aria-valuenow={Math.round(currentProgress)}
            aria-valuemin={0}
            aria-valuemax={100}
            sx={{ height: 2, overflow: 'hidden', bgcolor: 'action.hover' }}
          >
            <Box
              sx={{
                height: '100%',
                width: `${currentProgress}%`,
                bgcolor: 'primary.main',
                transition: 'width 240ms ease',
              }}
            />
          </Box>
        </Box>
      )}
      {children}
    </Box>
  );
};

export default GameFrame;
