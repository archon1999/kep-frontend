import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import type { Command, Level } from 'modules/kepper-game/domain/entities';
import { countCommands } from 'modules/kepper-game/domain/utils/engine.ts';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import GameCodeEditor from './GameCodeEditor.tsx';

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
  if (kind === 'ifBlocked' || kind === 'ifCrystalAhead') return { id, kind, yes: [], no: [] };
  return { id, kind };
};

type BlocksProps = {
  commands: Command[];
  onChange: (commands: Command[]) => void;
  available: Level['available'];
  depth: number;
  disabled: boolean;
  parentPath?: string;
};

const Blocks = ({ commands, onChange, available, depth, disabled, parentPath }: BlocksProps) => {
  const { t } = useTranslation();
  const [paletteAnchor, setPaletteAnchor] = useState<HTMLElement | null>(null);
  const commandPath = (command: Command, index: number) =>
    [parentPath, `${index + 1}. ${t(`game.commands.${command.kind}`)}`].filter(Boolean).join(', ');
  const update = (index: number, command: Command) =>
    onChange(commands.map((item, itemIndex) => (itemIndex === index ? command : item)));
  const move = (index: number, delta: number) => {
    const next = [...commands];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    onChange(next);
  };
  const palette = available.filter(
    (kind) => depth < 3 || (kind !== 'repeat' && kind !== 'ifBlocked' && kind !== 'ifCrystalAhead'),
  );
  const commandPalette =
    depth > 0 ? (
      <>
        <Button
          size="small"
          variant="text"
          disabled={disabled || countCommands(commands) >= 50}
          startIcon={<IconifyIcon icon="mdi:plus" width={16} />}
          onClick={(event) => setPaletteAnchor(event.currentTarget)}
          sx={{ alignSelf: 'flex-start', minHeight: 30, px: 0.75, fontSize: 12, fontWeight: 600 }}
        >
          {t('game.addCommand')}
        </Button>
        <Menu
          anchorEl={paletteAnchor}
          open={Boolean(paletteAnchor)}
          onClose={() => setPaletteAnchor(null)}
        >
          {palette.map((kind) => (
            <MenuItem
              key={kind}
              onClick={() => {
                onChange([...commands, createCommand(kind)]);
                setPaletteAnchor(null);
              }}
            >
              {t(`game.commands.${kind}`)}
            </MenuItem>
          ))}
        </Menu>
      </>
    ) : (
      <Stack
        direction="row"
        gap={0.5}
        flexWrap="wrap"
        sx={{
          py: 0.5,
          ...(depth === 0 && {
            position: 'sticky',
            top: 0,
            zIndex: 1,
            bgcolor: 'action.hover',
            pb: 1,
          }),
        }}
      >
        {palette.map((kind) => (
          <Button
            key={kind}
            size="small"
            variant="text"
            disabled={disabled || countCommands(commands) >= 50}
            startIcon={<IconifyIcon icon="mdi:plus" width={16} />}
            onClick={() => onChange([...commands, createCommand(kind)])}
            sx={{
              minHeight: 32,
              px: 1,
              bgcolor: 'background.paper',
              borderRadius: 1,
              color: 'text.primary',
              textTransform: 'none',
              fontSize: 13,
              fontWeight: 600,
              boxShadow: 'none',
              '&:hover': { bgcolor: 'action.selected' },
            }}
          >
            {t(`game.commands.${kind}`)}
          </Button>
        ))}
      </Stack>
    );
  return (
    <Stack spacing={0.75} sx={{ pl: depth ? 1.5 : 0 }}>
      {depth === 0 && commandPalette}
      {commands.map((command, index) => (
        <Box
          key={command.id}
          sx={{
            borderRadius: 1,
            bgcolor: 'background.paper',
            overflow: 'hidden',
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{
              px: 1.25,
              py: 0.75,
              bgcolor:
                command.kind === 'repeat' ||
                command.kind === 'ifBlocked' ||
                command.kind === 'ifCrystalAhead'
                  ? 'action.hover'
                  : 'transparent',
            }}
          >
            <Typography variant="caption" color="text.disabled" sx={{ width: 18, flexShrink: 0 }}>
              {String(index + 1).padStart(2, '0')}
            </Typography>
            <IconifyIcon
              icon={
                command.kind === 'move'
                  ? 'mdi:arrow-right-bold'
                  : command.kind === 'left'
                    ? 'mdi:rotate-left'
                    : command.kind === 'right'
                      ? 'mdi:rotate-right'
                      : command.kind === 'jump'
                        ? 'mdi:arrow-expand-right'
                        : command.kind === 'repeat'
                          ? 'mdi:repeat'
                          : command.kind === 'ifCrystalAhead'
                            ? 'mdi:diamond-stone'
                            : 'mdi:source-branch'
              }
              width={18}
              color={
                command.kind === 'repeat'
                  ? 'info.main'
                  : command.kind === 'ifBlocked' || command.kind === 'ifCrystalAhead'
                    ? 'warning.main'
                    : 'primary.main'
              }
            />
            <Typography variant="body2" fontWeight={600} sx={{ minWidth: 0 }}>
              {t(`game.commands.${command.kind}`)}
            </Typography>
            {command.kind === 'repeat' && (
              <Stack direction="row" alignItems="center" gap={0.25} sx={{ flexShrink: 0 }}>
                <Typography component="span" variant="body2" color="text.secondary">
                  ×
                </Typography>
                <TextField
                  size="small"
                  type="number"
                  value={command.count}
                  disabled={disabled}
                  onChange={(event) =>
                    update(index, {
                      ...command,
                      count: Math.max(1, Math.min(8, Number(event.target.value) || 1)),
                    })
                  }
                  slotProps={{
                    htmlInput: {
                      min: 1,
                      max: 8,
                      'aria-label': `${t('game.times')}: ${commandPath(command, index)}`,
                    },
                  }}
                  sx={{
                    width: 62,
                    '& .MuiInputBase-root': { height: 32 },
                    '& input': { px: 0.5, textAlign: 'center' },
                  }}
                />
              </Stack>
            )}
            <Box sx={{ flex: 1 }} />
            <Tooltip title={t('game.moveUp')}>
              <span>
                <IconButton
                  size="small"
                  aria-label={`${t('game.moveUp')}: ${commandPath(command, index)}`}
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
                  aria-label={`${t('game.moveDown')}: ${commandPath(command, index)}`}
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
                  aria-label={`${t('game.remove')}: ${commandPath(command, index)}`}
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
                parentPath={`${commandPath(command, index)}, ${t('game.repeatBody')}`}
                onChange={(body) => update(index, { ...command, body })}
              />
            </Box>
          )}
          {(command.kind === 'ifBlocked' || command.kind === 'ifCrystalAhead') && (
            <Stack spacing={1} sx={{ p: 1.25 }}>
              <Box>
                <Typography variant="caption" color="primary.main" fontWeight={700}>
                  {t(command.kind === 'ifBlocked' ? 'game.whenBlocked' : 'game.whenCrystalAhead')}
                </Typography>
                <Blocks
                  commands={command.yes}
                  available={available}
                  depth={depth + 1}
                  disabled={disabled}
                  parentPath={`${commandPath(command, index)}, ${t(command.kind === 'ifBlocked' ? 'game.whenBlocked' : 'game.whenCrystalAhead')}`}
                  onChange={(yes) => update(index, { ...command, yes })}
                />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  {t('game.otherwise')}
                </Typography>
                <Blocks
                  commands={command.no}
                  available={available}
                  depth={depth + 1}
                  disabled={disabled}
                  parentPath={`${commandPath(command, index)}, ${t('game.otherwise')}`}
                  onChange={(no) => update(index, { ...command, no })}
                />
              </Box>
            </Stack>
          )}
        </Box>
      ))}
      {depth > 0 && commandPalette}
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
    <Stack spacing={1.5}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
        <Stack direction="row" alignItems="center" gap={0.75} sx={{ minWidth: 0 }}>
          <Typography
            component="h3"
            sx={{
              fontSize: { xs: 15, md: 16 },
              fontWeight: 750,
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
            }}
          >
            {t('game.editorTitle')}
          </Typography>
          <Tooltip title={t('game.starTarget', { count: level.par })}>
            <IconButton
              size="small"
              aria-label={t('game.starTarget', { count: level.par })}
              sx={{ width: 28, height: 28, color: 'warning.main' }}
            >
              <IconifyIcon icon="mdi:star-four-points" width={16} />
            </IconButton>
          </Tooltip>
        </Stack>
        <Tabs
          value={mode}
          onChange={(_, value: 'blocks' | 'code') => onModeChange(value)}
          aria-label={t('game.editorTitle')}
          sx={{
            minHeight: 36,
            flexShrink: 0,
            '& .MuiTab-root': {
              minHeight: 36,
              minWidth: 48,
              px: { xs: 0.75, sm: 1.5 },
              fontSize: 12,
              fontWeight: 700,
            },
          }}
        >
          {(['blocks', 'code'] as const).map((value) => (
            <Tab key={value} value={value} label={t(`game.modes.${value}`)} disabled={disabled} />
          ))}
        </Tabs>
      </Stack>
      {mode === 'blocks' ? (
        <Box
          sx={{
            minHeight: { xs: 230, lg: 360 },
            maxHeight: { xs: 350, lg: 440 },
            overflowY: 'auto',
            p: 1,
            bgcolor: 'background.elevation1',
            borderRadius: 1,
          }}
        >
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
          <GameCodeEditor value={source} disabled={disabled} onChange={onSourceChange} />
          <Box component="details" sx={{ color: 'text.secondary' }}>
            <Typography
              component="summary"
              variant="caption"
              sx={{ color: 'primary.main', fontWeight: 700, cursor: 'pointer' }}
            >
              {t('game.codeHelpTitle')}
            </Typography>
            <Typography variant="caption" component="p" sx={{ mt: 0.75, mb: 0 }}>
              {t('game.codeHelp')}
            </Typography>
          </Box>
        </Stack>
      )}
    </Stack>
  );
};

export default ProgramEditor;
