import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, IconButton, type SxProps, SvgIcon, type Theme, Tooltip } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { copyText } from 'shared/lib/clipboard';

interface ClipboardButtonProps {
  text?: string;
  onCopy?: () => void;
  size?: 'small' | 'medium';
  iconOnly?: boolean;
  labels?: Partial<Record<keyof typeof copyLabels, string>>;
  sx?: SxProps<Theme>;
}

const copyLabels = {
  idle: 'problems.detail.copy',
  copied: 'problems.detail.copied',
  failed: 'common.copyFailed',
} as const;

const ClipboardButton = ({
  text = '',
  onCopy,
  size = 'small',
  iconOnly = false,
  labels,
  sx,
}: ClipboardButtonProps) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<keyof typeof copyLabels>('idle');
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const handleCopy = async (event: MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const didCopy = await copyText(text, button);
    if (!button.isConnected || button.closest('[aria-hidden="true"]')) return;

    setStatus(didCopy ? 'copied' : 'failed');
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setStatus('idle'), 1800);
    if (didCopy) onCopy?.();
  };

  const label = labels?.[status] ?? t(copyLabels[status]);
  const copied = status === 'copied';
  const feedbackColor = status === 'failed' ? 'error' : copied ? 'success' : undefined;
  const icon = (
    <SvgIcon sx={{ fontSize: 18 }}>
      {copied ? (
        <path d="m9 16.2-4.2-4.2-1.4 1.4L9 19 21 7l-1.4-1.4z" />
      ) : (
        <path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11z" />
      )}
    </SvgIcon>
  );

  return (
    <>
      {iconOnly ? (
        <Tooltip title={label}>
          <IconButton
            type="button"
            size={size}
            color={feedbackColor ?? 'default'}
            aria-label={label}
            onClick={handleCopy}
            sx={sx}
          >
            {icon}
          </IconButton>
        </Tooltip>
      ) : (
        <Button
          type="button"
          size={size}
          variant="text"
          color={feedbackColor ?? 'primary'}
          startIcon={icon}
          onClick={handleCopy}
          sx={sx}
        >
          {label}
        </Button>
      )}
      <Box component="span" role="status" sx={visuallyHidden}>
        {status === 'idle' ? '' : label}
      </Box>
    </>
  );
};

export default ClipboardButton;
