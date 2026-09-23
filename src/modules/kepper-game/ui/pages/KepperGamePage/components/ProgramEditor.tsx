import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import type { Command, Level } from 'modules/kepper-game/domain/entities';
import { countCommands } from 'modules/kepper-game/domain/utils/engine.ts';
import IconifyIcon from 'shared/components/base/IconifyIcon';

type ProgramEditorProps = {
  level: Level;
  program: Command[];
  source: string;
  mode: 'blocks' | 'code';
  disabled: boolean;
  onProgramChange: (commands: Command[]) => void;
  onSourceChange: (source: string) => void;
  onModeChange: (mode: 'blocks' | 'code') => void;
};

const createCommand = (kind: Command['kind']): Command => {
  const id = crypto.randomUUID();
  if (kind === 'repeat')
    return { id, kind, count: 2, body: [{ id: crypto.randomUUID(), kind: 'move' }] };
  if (kind === 'ifBlocked') return { id, kind, yes: [], no: [] };
  return { id, kind };
};

type BlocksProps = {
  commands: Command[];
  onChange: (commands: Command[]) => void;
  available: Level['available'];
  depth: number;
  disabled: boolean;
};

const Blocks = ({ commands, onChange, available, depth, disabled }: BlocksProps) => {
  const { t } = useTranslation();
  const update = (index: number, command: Command) =>
    onChange(commands.map((item, itemIndex) => (itemIndex === index ? command : item)));
  const move = (index: number, delta: number) => {
    const next = [...commands];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    onChange(next);
  };
  const palette = available.filter(
    (kind) => depth < 3 || (kind !== 'repeat' && kind !== 'ifBlocked'),
  );
  return (
    <Stack
      spacing={1}
      sx={{ pl: depth ? 1.5 : 0, borderLeft: depth ? '2px solid #b9d6fd' : undefined }}
    >
      {commands.map((command, index) => (
        <Box
          key={command.id}
          sx={{
            border: '1px solid #d8e8f8',
            borderRadius: 2,
            bgcolor: 'white',
            overflow: 'hidden',
            boxShadow: '0 4px 12px #1b65a50a',
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{
              px: 1,
              py: 0.75,
              bgcolor:
                command.kind === 'ifBlocked'
                  ? '#eef8ff'
                  : command.kind === 'repeat'
                    ? '#f2f0ff'
                    : '#fff',
            }}
          >
            <Chip
              size="small"
              icon={
                <IconifyIcon
                  icon={
                    command.kind === 'move'
                      ? 'mdi:arrow-right-bold'
                      : command.kind === 'left'
                        ? 'mdi:rotate-left'
                        : command.kind === 'right'
                          ? 'mdi:rotate-right'
                          : command.kind === 'repeat'
                            ? 'mdi:repeat'
                            : 'mdi:source-branch'
                  }
                />
              }
              label={t(`game.commands.${command.kind}`)}
              sx={{
                fontWeight: 750,
                bgcolor:
                  command.kind === 'ifBlocked'
                    ? '#d5f2f5'
                    : command.kind === 'repeat'
                      ? '#e6e0ff'
                      : '#e8f2ff',
              }}
            />
            {command.kind === 'repeat' && (
              <TextField
                size="small"
                type="number"
                label={t('game.times')}
                value={command.count}
                disabled={disabled}
                onChange={(event) =>
                  update(index, {
                    ...command,
                    count: Math.max(1, Math.min(8, Number(event.target.value) || 1)),
                  })
                }
                slotProps={{ htmlInput: { min: 1, max: 8, 'aria-label': t('game.times') } }}
                sx={{ width: 90, '& .MuiInputBase-root': { height: 32 } }}
              />
            )}
            <Box sx={{ flex: 1 }} />
            <Tooltip title={t('game.moveUp')}>
              <span>
                <IconButton
                  size="small"
                  aria-label={t('game.moveUp')}
                  disabled={disabled || index === 0}
                  onClick={() => move(index, -1)}
                >
                  <IconifyIcon icon="mdi:chevron-up" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={t('game.moveDown')}>
              <span>
                <IconButton
                  size="small"
                  aria-label={t('game.moveDown')}
                  disabled={disabled || index === commands.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <IconifyIcon icon="mdi:chevron-down" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={t('game.remove')}>
              <span>
                <IconButton
                  size="small"
                  aria-label={t('game.remove')}
                  disabled={disabled}
                  onClick={() => onChange(commands.filter((_, itemIndex) => itemIndex !== index))}
                >
                  <IconifyIcon icon="mdi:close" />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
          {command.kind === 'repeat' && (
            <Box sx={{ p: 1.25 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                {t('game.repeatBody')}
              </Typography>
              <Blocks
                commands={command.body}
                available={available}
                depth={depth + 1}
                disabled={disabled}
                onChange={(body) => update(index, { ...command, body })}
              />
            </Box>
          )}
          {command.kind === 'ifBlocked' && (
            <Stack spacing={1} sx={{ p: 1.25 }}>
              <Box>
                <Typography variant="caption" color="#168a91" fontWeight={800}>
                  {t('game.whenBlocked')}
                </Typography>
                <Blocks
                  commands={command.yes}
                  available={available}
                  depth={depth + 1}
                  disabled={disabled}
                  onChange={(yes) => update(index, { ...command, yes })}
                />
              </Box>
              <Box>
                <Typography variant="caption" color="#9b62aa" fontWeight={800}>
                  {t('game.otherwise')}
                </Typography>
                <Blocks
                  commands={command.no}
                  available={available}
                  depth={depth + 1}
                  disabled={disabled}
                  onChange={(no) => update(index, { ...command, no })}
                />
              </Box>
            </Stack>
          )}
        </Box>
      ))}
      <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ pt: 0.5 }}>
        {palette.map((kind) => (
          <Button
            key={kind}
            size="small"
            variant="outlined"
            disabled={disabled || countCommands(commands) >= 50}
            startIcon={<IconifyIcon icon="mdi:plus" width={16} />}
            onClick={() => onChange([...commands, createCommand(kind)])}
            sx={{ borderStyle: 'dashed', borderRadius: 2, textTransform: 'none', fontSize: 12 }}
          >
            {t(`game.commands.${kind}`)}
          </Button>
        ))}
      </Stack>
    </Stack>
  );
};

const ProgramEditor = ({
  level,
  program,
  source,
  mode,
  disabled,
  onProgramChange,
  onSourceChange,
  onModeChange,
}: ProgramEditorProps) => {
  const { t } = useTranslation();
  return (
    <Stack spacing={2} sx={{ height: '100%' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
        <Box>
          <Typography variant="h6" fontWeight={850}>
            {t('game.editorTitle')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t('game.editorCaption')}
          </Typography>
        </Box>
        <Stack direction="row" sx={{ bgcolor: '#edf5ff', borderRadius: 2, p: 0.4 }}>
          {(['blocks', 'code'] as const).map((value) => (
            <Button
              key={value}
              size="small"
              variant={mode === value ? 'contained' : 'text'}
              disabled={disabled}
              onClick={() => onModeChange(value)}
              sx={{ borderRadius: 1.5, minWidth: 74, textTransform: 'none' }}
            >
              {t(`game.modes.${value}`)}
            </Button>
          ))}
        </Stack>
      </Stack>
      {mode === 'blocks' ? (
        <Box sx={{ maxHeight: { xs: 420, lg: 490 }, minHeight: 210, overflowY: 'auto', pr: 0.5 }}>
          <Blocks
            commands={program}
            onChange={onProgramChange}
            available={level.available}
            depth={0}
            disabled={disabled}
          />
        </Box>
      ) : (
        <Stack spacing={1}>
          <TextField
            multiline
            minRows={14}
            maxRows={18}
            value={source}
            disabled={disabled}
            onChange={(event) => onSourceChange(event.target.value)}
            aria-label={t('game.codeLabel')}
            sx={{
              '& textarea': { fontFamily: 'Consolas, monospace', fontSize: 14, lineHeight: 1.6 },
              '& .MuiOutlinedInput-root': {
                bgcolor: '#101d39',
                color: '#e6f5ff',
                borderRadius: 2.5,
                alignItems: 'flex-start',
              },
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {t('game.codeHelp')}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default ProgramEditor;
