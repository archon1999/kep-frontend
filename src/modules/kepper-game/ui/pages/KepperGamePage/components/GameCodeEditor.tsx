import { type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, Tooltip } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';

type GameCodeEditorProps = {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
};

const tokenPattern =
  /(\/\/[^\n]*|\b(?:repeat|if|else)\b|\b(?:move|left|right|jump)\b|\b(?:blocked|crystal|ahead)\b|\b\d+\b|[{}])/g;

const tokenColor = (token: string) => {
  if (token.startsWith('//')) return '#788b99';
  if (/^(repeat|if|else)$/.test(token)) return '#296fd8';
  if (/^(move|left|right|jump)$/.test(token)) return '#087f73';
  if (/^(blocked|crystal|ahead)$/.test(token)) return '#9b5c18';
  if (/^\d+$/.test(token)) return '#9b5c18';
  return '#596a78';
};

const GameCodeEditor = ({ value, disabled, onChange }: GameCodeEditorProps) => {
  const { t } = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightedRef = useRef<HTMLPreElement>(null);
  const numbersRef = useRef<HTMLDivElement>(null);
  const copyTimer = useRef<number | null>(null);
  const [copied, setCopied] = useState(false);
  const lineCount = value.split('\n').length;
  const editorHeight = {
    xs: Math.min(360, Math.max(230, lineCount * 22 + 30)),
    lg: Math.min(460, Math.max(370, lineCount * 22 + 30)),
  };

  useEffect(() => {
    return () => {
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
    };
  }, []);

  const syncScroll = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    if (highlightedRef.current) {
      highlightedRef.current.style.transform = `translate(${-textarea.scrollLeft}px, ${-textarea.scrollTop}px)`;
    }
    if (numbersRef.current) {
      numbersRef.current.style.transform = `translateY(${-textarea.scrollTop}px)`;
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Tab') return;
    event.preventDefault();
    const textarea = event.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    onChange(`${value.slice(0, start)}  ${value.slice(end)}`);
    requestAnimationFrame(() => textareaRef.current?.setSelectionRange(start + 2, start + 2));
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height: editorHeight,
        overflow: 'hidden',
        borderRadius: 1,
        bgcolor: '#f7f9fb',
        '&:focus-within': { boxShadow: 'inset 0 0 0 2px rgba(47, 124, 238, .3)' },
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: '0 auto 0 0',
          width: 44,
          bgcolor: '#edf2f6',
          overflow: 'hidden',
        }}
      >
        <Box
          ref={numbersRef}
          sx={{
            pt: '12px',
            pr: 1,
            textAlign: 'right',
            color: '#8a9ba9',
            font: '13px/22px Consolas, monospace',
          }}
        >
          {Array.from({ length: lineCount }, (_, index) => (
            <Box key={index} sx={{ height: 22 }}>
              {index + 1}
            </Box>
          ))}
        </Box>
      </Box>
      <Box
        component="pre"
        ref={highlightedRef}
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: 12,
          left: 56,
          m: 0,
          width: 'max-content',
          minWidth: 'calc(100% - 56px)',
          whiteSpace: 'pre',
          pointerEvents: 'none',
          color: '#243847',
          font: '14px/22px Consolas, monospace',
        }}
      >
        {value.split(tokenPattern).map((token, index) => (
          <Box component="span" key={index} sx={{ color: tokenColor(token) }}>
            {token}
          </Box>
        ))}
        {'\n'}
      </Box>
      <Box
        component="textarea"
        ref={textareaRef}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        onScroll={syncScroll}
        aria-label={t('game.codeLabel')}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          p: '12px 44px 12px 56px',
          m: 0,
          border: 0,
          outline: 0,
          resize: 'none',
          overflow: 'auto',
          whiteSpace: 'pre',
          overflowWrap: 'normal',
          bgcolor: 'transparent',
          color: 'transparent',
          WebkitTextFillColor: 'transparent',
          caretColor: '#1d5fc5',
          font: '14px/22px Consolas, monospace',
          '&::selection': { bgcolor: 'rgba(47, 124, 238, .22)' },
          '&:disabled': { cursor: 'default' },
        }}
      />
      <Tooltip title={t(copied ? 'game.copiedCode' : 'game.copyCode')}>
        <IconButton
          size="small"
          onClick={copyCode}
          aria-label={t(copied ? 'game.copiedCode' : 'game.copyCode')}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            zIndex: 2,
            bgcolor: 'background.paper',
            color: copied ? 'success.main' : 'text.secondary',
          }}
        >
          <IconifyIcon icon={copied ? 'mdi:check' : 'mdi:content-copy'} width={18} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default GameCodeEditor;
