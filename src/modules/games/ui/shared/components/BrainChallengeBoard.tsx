import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import type { BrainAnswer, BrainPuzzle } from 'modules/games/domain/mini-games/brain-games';
import IconifyIcon from 'shared/components/base/IconifyIcon';

export type BrainChallengeBoardProps = {
  puzzle: BrainPuzzle;
  onAnswer: (answer: BrainAnswer) => void;
  disabled?: boolean;
};

/** A controlled puzzle surface, reused by standalone games and server-owned world quests. */
const BrainChallengeBoard = ({ puzzle, onAnswer, disabled = false }: BrainChallengeBoardProps) => {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const [focusCell, setFocusCell] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const numericPrompt =
    puzzle.kind === 'quick-math'
      ? puzzle.expression
      : puzzle.kind === 'number-sequence'
        ? puzzle.sequence.join(',')
        : '';

  useEffect(() => {
    setValue('');
  }, [numericPrompt]);

  useEffect(() => {
    if (numericPrompt && !disabled) inputRef.current?.focus({ preventScroll: true });
  }, [numericPrompt, disabled]);

  const moveGridFocus = (event: KeyboardEvent, cell: number, columns: number, count: number) => {
    const direction: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -columns,
      ArrowDown: columns,
    };
    if (!(event.key in direction)) return;
    event.preventDefault();
    const next = Math.max(0, Math.min(count - 1, cell + direction[event.key]));
    setFocusCell(next);
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-cell="${next}"]`)?.focus();
  };

  if (puzzle.kind === 'math-compare') {
    return (
      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary">
          {t('gamesMinis.brain.comparePrompt')}
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: { xs: 1, sm: 2 },
          }}
        >
          {(['left', 'right'] as const).map((side) => (
            <Button
              key={side}
              disabled={disabled}
              onClick={() => onAnswer({ choice: side })}
              aria-label={t(`gamesMinis.brain.${side}Expression`, { expression: puzzle[side] })}
              sx={{
                minWidth: 0,
                minHeight: { xs: 140, sm: 180 },
                p: { xs: 1.5, sm: 3 },
                bgcolor: 'background.elevation1',
                borderRadius: 2,
                color: 'text.primary',
                fontFamily: 'monospace',
                fontSize: { xs: 22, sm: 30 },
                fontWeight: 500,
                lineHeight: 1.55,
                whiteSpace: 'normal',
                overflowWrap: 'anywhere',
                textTransform: 'none',
                '&:hover': { bgcolor: 'primary.lighter' },
              }}
            >
              {puzzle[side]}
            </Button>
          ))}
        </Box>
        <Button
          disabled={disabled}
          onClick={() => onAnswer({ choice: 'equal' })}
          sx={{ alignSelf: 'center', minWidth: 140 }}
          startIcon={<IconifyIcon icon="mdi:equal" width={20} />}
        >
          {t('gamesMinis.brain.equal')}
        </Button>
      </Stack>
    );
  }

  if (puzzle.kind === 'quick-math' || puzzle.kind === 'number-sequence') {
    return (
      <Stack
        component="form"
        spacing={3}
        onSubmit={(event) => {
          event.preventDefault();
          if (!disabled && value.trim()) onAnswer({ value });
        }}
      >
        <Box
          sx={{
            bgcolor: 'background.elevation1',
            borderRadius: 2,
            px: { xs: 2, sm: 4 },
            py: { xs: 4, sm: 5 },
            textAlign: 'center',
          }}
        >
          {puzzle.kind === 'quick-math' ? (
            <Typography
              sx={{
                fontFamily: 'monospace',
                fontSize: { xs: 27, sm: 38 },
                fontWeight: 500,
                lineHeight: 1.65,
                overflowWrap: 'anywhere',
              }}
            >
              {puzzle.expression}
            </Typography>
          ) : (
            <Stack
              direction="row"
              flexWrap="wrap"
              justifyContent="center"
              alignItems="center"
              gap={{ xs: 1.5, sm: 2.5 }}
              aria-label={t('gamesMinis.brain.sequenceLabel')}
            >
              {puzzle.sequence.map((number, index) => (
                <Typography
                  key={index}
                  sx={{
                    fontSize: { xs: 24, sm: 30 },
                    fontWeight: 500,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {number}
                </Typography>
              ))}
              <Typography
                sx={{ color: 'primary.main', fontSize: { xs: 30, sm: 36 }, fontWeight: 700 }}
              >
                ?
              </Typography>
            </Stack>
          )}
        </Box>
        <Stack
          direction="row"
          gap={1.5}
          sx={{ maxWidth: 400, width: '100%', mx: 'auto !important' }}
        >
          <TextField
            inputRef={inputRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            disabled={disabled}
            label={t('gamesMinis.brain.answer')}
            autoComplete="off"
            slotProps={{
              htmlInput: {
                inputMode: 'text',
                pattern: '[-−]?[0-9]*',
                maxLength: 16,
                'aria-label': t('gamesMinis.brain.answer'),
              },
            }}
            sx={{
              flex: 1,
              minWidth: 0,
              '& input': {
                fontFamily: 'monospace',
                fontSize: 20,
                fontVariantNumeric: 'tabular-nums',
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={disabled || !value.trim()}
            sx={{ flexShrink: 0, px: 2.5, boxShadow: 'none' }}
          >
            {t('gamesMinis.brain.check')}
          </Button>
        </Stack>
      </Stack>
    );
  }

  const matrix = puzzle.kind === 'memory-matrix';
  const watching = matrix && puzzle.phase === 'watch';
  const count = puzzle.rows * puzzle.columns;
  return (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 510, mx: 'auto' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
        <Typography variant="body2" color="text.secondary">
          {t(
            matrix
              ? watching
                ? 'gamesMinis.brain.watchCells'
                : 'gamesMinis.brain.recallCells'
              : 'gamesMinis.brain.findNumber',
          )}
        </Typography>
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 650,
            color: 'primary.main',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {matrix ? `${puzzle.selected.length} / ${puzzle.targetCount}` : puzzle.next}
        </Typography>
      </Stack>
      <Box
        ref={gridRef}
        role="group"
        aria-label={t(matrix ? 'gamesMinis.brain.matrixLabel' : 'gamesMinis.brain.numberGridLabel')}
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${puzzle.columns}, minmax(0, 1fr))`,
          gap: { xs: 0.5, sm: 0.75 },
          bgcolor: 'background.elevation1',
          p: { xs: 0.75, sm: 1 },
          borderRadius: 2,
        }}
      >
        {Array.from({ length: count }, (_, cell) => {
          const selected = matrix
            ? puzzle.selected.includes(cell)
            : puzzle.cells[cell] < puzzle.next;
          const highlighted = matrix && watching && puzzle.highlighted?.includes(cell);
          return (
            <Button
              key={cell}
              data-cell={cell}
              type="button"
              aria-disabled={disabled || watching || selected}
              aria-pressed={matrix ? selected || Boolean(highlighted) : undefined}
              aria-label={
                matrix
                  ? t('gamesMinis.brain.cell', {
                      row: Math.floor(cell / puzzle.columns) + 1,
                      column: (cell % puzzle.columns) + 1,
                    })
                  : String(puzzle.cells[cell])
              }
              tabIndex={focusCell === cell && !disabled && !watching ? 0 : -1}
              onFocus={() => setFocusCell(cell)}
              onKeyDown={(event) => moveGridFocus(event, cell, puzzle.columns, count)}
              onClick={() => {
                if (!disabled && !watching && !selected) onAnswer({ cell });
              }}
              sx={{
                minWidth: 0,
                aspectRatio: 1,
                p: 0,
                borderRadius: 1,
                boxShadow: 'none',
                bgcolor: highlighted
                  ? 'primary.main'
                  : selected
                    ? 'success.lighter'
                    : 'background.paper',
                color: selected ? 'success.main' : 'text.primary',
                fontSize: { xs: puzzle.columns > 5 ? 16 : 20, sm: 22 },
                fontWeight: 600,
                fontVariantNumeric: 'tabular-nums',
                transition: 'background-color 140ms ease',
                '&:hover': {
                  bgcolor: watching
                    ? highlighted
                      ? 'primary.main'
                      : 'background.paper'
                    : selected
                      ? 'success.lighter'
                      : 'primary.lighter',
                },
                '&:focus-visible': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: 1,
                },
              }}
            >
              {selected ? (
                <IconifyIcon icon="mdi:check" width={21} />
              ) : matrix ? (
                highlighted ? (
                  <Box
                    sx={{ width: '32%', height: '32%', borderRadius: 0.5, bgcolor: 'common.white' }}
                  />
                ) : null
              ) : (
                puzzle.cells[cell]
              )}
            </Button>
          );
        })}
      </Box>
    </Stack>
  );
};

export default BrainChallengeBoard;
