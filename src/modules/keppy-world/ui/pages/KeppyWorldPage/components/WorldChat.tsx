import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Badge,
  Box,
  ButtonBase,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import type { WorldChatMessage } from '../../../../domain';
import { chatLength, chatParts, kepChatEmoji } from '../../../../domain/utils/chat';

type Props = {
  messages: WorldChatMessage[];
  error: { code: string; clientId: string | null } | null;
  connected: boolean;
  hidden: boolean;
  onSend: (text: string, clientId: string) => boolean;
  onFocusChange: (focused: boolean) => void;
};

const WorldChat = ({ messages, error, connected, hidden, onSend, onFocusChange }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [emojis, setEmojis] = useState(false);
  const [text, setText] = useState('');
  const [pending, setPending] = useState<string | null>(null);
  const [seen, setSeen] = useState<string | undefined>();
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const last = messages[messages.length - 1]?.id;
  const length = chatLength(text);
  useEffect(() => {
    if (open && !hidden) {
      setSeen(last);
      list.current?.scrollTo({ top: list.current.scrollHeight });
    }
  }, [last, open, hidden]);
  useEffect(() => {
    if (pending && messages.some((message) => message.clientId === pending)) {
      setPending(null);
      setText('');
    } else if (pending && (error?.clientId === pending || !connected)) setPending(null);
  }, [messages, pending, error, connected]);
  useEffect(() => {
    if (hidden || !open) onFocusChange(false);
  }, [hidden, open, onFocusChange]);
  const send = () => {
    if (!text.trim() || length > 50 || !connected || pending) return;
    const id = crypto.randomUUID();
    if (onSend(text.trim(), id)) setPending(id);
  };
  return (
    <Box
      sx={{
        position: 'absolute',
        left: 16,
        bottom: { xs: 76, sm: 44 },
        zIndex: 5,
        display: hidden ? 'none' : 'block',
        maxWidth: 'calc(100% - 32px)',
      }}
      onKeyDown={(event) => {
        event.stopPropagation();
        if (event.key === 'Escape') {
          setOpen(false);
          input.current?.blur();
        }
      }}
    >
      {open ? (
        <Paper
          sx={{
            width: { xs: 290, sm: 320 },
            maxWidth: '100%',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 6px 30px rgba(20,47,65,.12)',
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 1.5, py: 0.5 }}
          >
            <Typography fontSize={14} fontWeight={600}>
              {t('keppyWorld.chat.title')}
            </Typography>
            <IconButton
              size="small"
              aria-label={t('keppyWorld.chat.collapse')}
              onClick={() => setOpen(false)}
            >
              <IconifyIcon icon="mdi:chevron-down" width={20} />
            </IconButton>
          </Stack>
          <Box
            ref={list}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            aria-label={t('keppyWorld.chat.title')}
            sx={{ height: { xs: 150, sm: 200 }, overflowY: 'auto', px: 1.5, py: 0.5 }}
          >
            {!messages.length && (
              <Typography variant="body2" color="text.secondary">
                {t('keppyWorld.chat.empty')}
              </Typography>
            )}
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{ mb: 1, overflowWrap: 'anywhere', fontSize: 13, lineHeight: 1.7 }}
              >
                <Typography
                  component="span"
                  fontSize="inherit"
                  fontWeight={600}
                  sx={{ color: 'primary.main', mr: 0.75 }}
                >
                  {message.username}
                </Typography>
                {chatParts(message.text).map((part, i) =>
                  part.emoji ? (
                    <Box
                      key={i}
                      component="img"
                      src={`/games/chat-emoji/${part.emoji.id}.png`}
                      alt={part.emoji.name}
                      sx={{ width: 26, height: 26, objectFit: 'contain', verticalAlign: 'middle' }}
                    />
                  ) : (
                    <span key={i}>{part.text}</span>
                  ),
                )}
              </Box>
            ))}
          </Box>
          {emojis && (
            <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ px: 1.5, py: 0.5 }}>
              {kepChatEmoji.map((emoji) => (
                <ButtonBase
                  key={emoji.id}
                  aria-label={emoji.name}
                  disabled={!!pending || length >= 50}
                  sx={{ p: 0.5, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}
                  onClick={() => {
                    const cursor = input.current?.selectionStart ?? text.length;
                    const next =
                      text.slice(0, cursor) +
                      `:kep-${emoji.id}:` +
                      text.slice(input.current?.selectionEnd ?? cursor);
                    if (chatLength(next) <= 50) setText(next);
                    input.current?.focus();
                  }}
                >
                  <Box
                    component="img"
                    src={`/games/chat-emoji/${emoji.id}.png`}
                    alt=""
                    sx={{ width: 27, height: 27 }}
                  />
                </ButtonBase>
              ))}
            </Stack>
          )}
          <Stack direction="row" alignItems="center" sx={{ px: 0.5, pb: 0.5 }}>
            <IconButton
              size="small"
              aria-label={t('keppyWorld.chat.emoji')}
              aria-expanded={emojis}
              onClick={() => setEmojis(!emojis)}
            >
              <IconifyIcon icon="mdi:emoticon-outline" width={21} />
            </IconButton>
            <TextField
              inputRef={input}
              size="small"
              variant="standard"
              value={text}
              disabled={!connected || !!pending}
              placeholder={t('keppyWorld.chat.placeholder')}
              onChange={(event) => setText(event.target.value)}
              onFocus={() => onFocusChange(true)}
              onBlur={() => onFocusChange(false)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
                  event.preventDefault();
                  send();
                }
              }}
              slotProps={{
                input: { disableUnderline: true },
                htmlInput: { maxLength: 1000, 'aria-label': t('keppyWorld.chat.placeholder') },
              }}
              sx={{ flex: 1, minWidth: 0 }}
            />
            <IconButton
              size="small"
              color="primary"
              aria-label={t('keppyWorld.chat.send')}
              disabled={!connected || !!pending || !text.trim() || length > 50}
              onClick={send}
            >
              <IconifyIcon icon="mdi:send" width={20} />
            </IconButton>
          </Stack>
          <Stack direction="row" justifyContent="space-between" sx={{ px: 1.5, pb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {error
                ? t(`keppyWorld.chat.errors.${error.code}`, {
                    defaultValue: t('keppyWorld.chat.failed'),
                  })
                : !connected
                  ? t('keppyWorld.reconnecting')
                  : ''}
            </Typography>
            <Typography variant="caption" color={length > 50 ? 'error.main' : 'text.secondary'}>
              {length}/50
            </Typography>
          </Stack>
        </Paper>
      ) : (
        <IconButton
          aria-label={t('keppyWorld.chat.open')}
          onClick={() => setOpen(true)}
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0 3px 16px rgba(20,47,65,.1)',
          }}
        >
          <Badge color="primary" variant="dot" invisible={!last || seen === last}>
            <IconifyIcon icon="mdi:chat-outline" width={22} />
          </Badge>
        </IconButton>
      )}
    </Box>
  );
};
export default WorldChat;

