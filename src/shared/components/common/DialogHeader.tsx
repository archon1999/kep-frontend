import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, DialogTitle, IconButton, Stack, Typography } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import MixedText from './MixedText';

interface DialogHeaderProps {
  id: string;
  title: string;
  subtitle?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  actionsPlacement?: 'below' | 'end';
  onClose?: () => void;
  closeDisabled?: boolean;
}

const DialogHeader = ({
  id,
  title,
  subtitle,
  icon,
  actions,
  actionsPlacement = 'below',
  onClose,
  closeDisabled = false,
}: DialogHeaderProps) => {
  const { t } = useTranslation();
  return (
    <DialogTitle component="div" id={`${id}-container`}>
      <Stack direction="row" gap={2} alignItems="flex-start" flexWrap="wrap">
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Stack direction="row" gap={1.25} alignItems="center">
            {icon}
            <Typography
              component="h2"
              variant="h5"
              id={id}
              sx={{
                fontFamily: 'var(--kep-display-font)',
                fontWeight: 500,
                overflowWrap: 'anywhere',
              }}
            >
              <MixedText>{title}</MixedText>
            </Typography>
          </Stack>
          {subtitle !== undefined && subtitle !== null && subtitle !== false && (
            <Typography component="div" variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {actions && actionsPlacement === 'end' && (
          <Stack
            direction="row"
            gap={1}
            flexWrap="wrap"
            alignItems="center"
            justifyContent="flex-end"
            sx={{
              ml: 'auto',
              alignSelf: 'center',
              maxWidth: '100%',
              flexBasis: { xs: '100%', md: 'auto' },
              order: { xs: 1, md: 0 },
            }}
          >
            {actions}
          </Stack>
        )}
        {onClose && (
          <IconButton
            aria-label={t('common.close')}
            onClick={onClose}
            disabled={closeDisabled}
            size="small"
            sx={{ flexShrink: 0 }}
          >
            <IconifyIcon icon="mdi:close" />
          </IconButton>
        )}
      </Stack>
      {actions && actionsPlacement === 'below' && (
        <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center" sx={{ mt: 2 }}>
          {actions}
        </Stack>
      )}
    </DialogTitle>
  );
};

export default DialogHeader;
