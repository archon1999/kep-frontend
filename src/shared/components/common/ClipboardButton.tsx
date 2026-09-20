import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconButton, Tooltip } from '@mui/material';
import KepIcon from '../base/KepIcon';

interface ClipboardButtonProps {
  text?: string;
  onCopy?: () => void;
  size?: 'small' | 'medium';
  iconOnly?: boolean;
}

const ClipboardButton = ({
  text = '',
  onCopy,
  size = 'small',
  iconOnly = false,
}: ClipboardButtonProps) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  const handleCopy = async () => {
    const value = text ?? '';

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      setCopied(true);
      onCopy?.();
      timeoutRef.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const label = copied ? t('problems.detail.copied') : t('problems.detail.copy');
  const icon = <KepIcon name={copied ? 'check' : 'copy'} width={18} height={18} />;

  if (iconOnly) {
    return (
      <Tooltip title={label}>
        <IconButton
          size={size}
          color={copied ? 'success' : 'default'}
          aria-label={label}
          onClick={handleCopy}
        >
          {icon}
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Button
      size={size}
      variant="text"
      color={copied ? 'success' : 'primary'}
      startIcon={icon}
      onClick={handleCopy}
    >
      {label}
    </Button>
  );
};

export default ClipboardButton;
