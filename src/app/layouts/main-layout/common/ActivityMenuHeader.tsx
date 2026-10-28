import { useTranslation } from 'react-i18next';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import MixedText from 'shared/components/common/MixedText';
import PatternArtwork, { type PatternArtworkKind } from 'shared/components/common/PatternArtwork';

interface ActivityMenuHeaderProps {
  title: string;
  subtitle?: string;
  illustration: PatternArtworkKind;
  onClose: () => void;
}

const ActivityMenuHeader = ({
  title,
  subtitle,
  illustration,
  onClose,
}: ActivityMenuHeaderProps) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ position: 'relative', px: 2.5, py: 2.5, flexShrink: 0, overflow: 'hidden' }}>
      <PatternArtwork
        kind={illustration}
        sx={{
          position: 'absolute',
          width: 120,
          right: 36,
          bottom: 0,
          opacity: 0.85,
          pointerEvents: 'none',
          '& .kep-pattern-signal': { animation: 'none', opacity: 1 },
        }}
      />
      <Stack direction="row" alignItems="flex-start" spacing={1} sx={{ position: 'relative' }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography component="h2" variant="h5" sx={{ fontSize: 24, lineHeight: 1.25, mb: 1 }}>
            <MixedText>{title}</MixedText>
          </Typography>
          {subtitle && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', maxWidth: 'calc(100% - 72px)' }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        <IconButton
          size="small"
          aria-label={t('common.close')}
          onClick={onClose}
          sx={{ mt: -0.5, mr: -1 }}
        >
          <IconifyIcon icon="material-symbols:close-rounded" sx={{ fontSize: 20 }} />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default ActivityMenuHeader;
