import { PropsWithChildren, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, IconButton, Popover, Stack, Typography } from '@mui/material';
import { filterPopoverStyles } from 'app/theme/styles/overlays';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import MixedText from './MixedText';

interface FilterPopoverProps {
  id: string;
  title: ReactNode;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  resetLabel: ReactNode;
  doneLabel: string;
  align?: 'left' | 'right';
}

const FilterPopover = ({
  id,
  title,
  anchorEl,
  onClose,
  onReset,
  hasActiveFilters,
  resetLabel,
  doneLabel,
  align = 'left',
  children,
}: PropsWithChildren<FilterPopoverProps>) => {
  const { t } = useTranslation();
  return (
    <Popover
      id={id}
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: align }}
      transformOrigin={{ vertical: 'top', horizontal: align }}
      marginThreshold={16}
      slotProps={{
        paper: {
          variant: 'framed',
          role: 'dialog',
          'aria-labelledby': `${id}-title`,
          sx: filterPopoverStyles,
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        sx={{ p: { xs: 2, sm: 2.5 }, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}
      >
        <Typography
          id={`${id}-title`}
          component="h2"
          variant="h5"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            fontFamily: 'var(--kep-display-font)',
            fontWeight: 500,
            minWidth: 0,
            overflowWrap: 'anywhere',
          }}
        >
          <IconifyIcon icon="mdi:tune-variant" sx={{ fontSize: 20, color: 'primary.main' }} />
          <Box component="span">
            {typeof title === 'string' ? <MixedText>{title}</MixedText> : title}
          </Box>
        </Typography>
        <IconButton
          onClick={onClose}
          aria-label={t('common.close')}
          size="small"
          sx={{ flexShrink: 0 }}
        >
          <IconifyIcon icon="mdi:close" />
        </IconButton>
      </Stack>
      <Box
        sx={{
          p: { xs: 2, sm: 2.5 },
          minHeight: 0,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
        }}
      >
        {children}
      </Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        gap={2}
        flexWrap="wrap"
        sx={{ px: { xs: 2, sm: 2.5 }, py: 2, borderTop: 1, borderColor: 'divider', flexShrink: 0 }}
      >
        <Button variant="text" disabled={!hasActiveFilters} onClick={onReset}>
          {resetLabel}
        </Button>
        <Button
          variant="contained"
          onClick={onClose}
          endIcon={<IconifyIcon icon="mdi:arrow-right" />}
        >
          {doneLabel}
        </Button>
      </Stack>
    </Popover>
  );
};

export default FilterPopover;
