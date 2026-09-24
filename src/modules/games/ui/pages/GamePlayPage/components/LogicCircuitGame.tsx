import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import {
  CIRCUIT_PUZZLES,
  DEFAULT_CIRCUIT,
  GATES,
  circuitMatches,
  circuitPairLabels,
  circuitRoundScore,
  circuitRows,
} from 'modules/games/domain/mini-games/logic-circuit';
import type { CircuitConfig, LogicGate } from 'modules/games/domain/mini-games/logic-circuit';
import CircuitDiagram from './CircuitDiagram.tsx';
import GameFrame from './GameFrame.tsx';
import MiniGameCompletion from './MiniGameCompletion.tsx';
import MiniGameIntro from './MiniGameIntro.tsx';
import type { MiniGameProps } from './types.ts';

const GatePicker = ({
  label,
  gates,
  value,
  onChange,
  disabled,
}: {
  label: string;
  gates: readonly LogicGate[];
  value: LogicGate;
  onChange: (gate: LogicGate) => void;
  disabled: boolean;
}) => (
  <Box>
    <Typography variant="body2" fontWeight={600} sx={{ mb: 0.75, fontSize: 13 }}>
      {label}
    </Typography>
    <ToggleButtonGroup
      exclusive
      size="small"
      value={value}
      aria-label={label}
      onChange={(_, gate: LogicGate | null) => {
        if (gate) onChange(gate);
      }}
    >
      {gates.map((gate) => (
        <ToggleButton
          key={gate}
          value={gate}
          disabled={disabled}
          sx={{ minWidth: 62, fontWeight: 700 }}
        >
          {gate}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  </Box>
);

const LogicCircuitGame = ({ best, onScore, audio }: MiniGameProps) => {
  const { t } = useTranslation();
  const [started, setStarted] = useState(false);
  const [round, setRound] = useState(0);
  const [config, setConfig] = useState<CircuitConfig>({ ...DEFAULT_CIRCUIT });
  const [attempts, setAttempts] = useState(0);
  const [checked, setChecked] = useState(false);
  const [feedback, setFeedback] = useState<'miss' | 'success' | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const roundRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const puzzle = CIRCUIT_PUZZLES[round];
  const [firstPair, secondPair] = circuitPairLabels[config.pairing];
  const rows = useMemo(() => circuitRows(puzzle, config), [puzzle, config]);
  const matches = rows.filter((row) => row.actual === row.expected).length;
  const expression =
    puzzle.inputCount === 4
      ? `${config.thirdGate}(${config.firstGate}(${firstPair.join(', ')}), ${config.secondGate}(${secondPair.join(', ')}))`
      : puzzle.inputCount === 3
        ? `${config.secondGate}(${config.firstGate}(A, B), C)`
        : `${config.firstGate}(A, B)`;
  const circuitExpression = config.invert ? `NOT(${expression})` : expression;

  useEffect(() => {
    if ((round === 0 && !done) || !window.matchMedia('(max-width: 899.95px)').matches) return;
    const frame = requestAnimationFrame(() => {
      (done ? doneRef.current : roundRef.current)?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
        block: 'start',
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [round, done]);

  const updateConfig = (next: CircuitConfig) => {
    audio.playCue('select');
    setConfig(next);
    setFeedback(null);
  };

  const check = () => {
    if (feedback === 'success' || done) return;
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setChecked(true);
    if (circuitMatches(puzzle, config)) {
      audio.playCue('correct');
      setScore((value) => value + circuitRoundScore(nextAttempts));
      setFeedback('success');
    } else {
      audio.playCue('wrong');
      setFeedback('miss');
    }
  };

  const next = () => {
    if (round === CIRCUIT_PUZZLES.length - 1) {
      audio.stop();
      audio.playCue('complete');
      setDone(true);
      onScore(score);
      return;
    }
    setRound((value) => value + 1);
    setConfig({ ...DEFAULT_CIRCUIT });
    setAttempts(0);
    setChecked(false);
    setFeedback(null);
  };

  const restart = () => {
    audio.startFromGesture();
    setStarted(true);
    setRound(0);
    setConfig({ ...DEFAULT_CIRCUIT });
    setAttempts(0);
    setChecked(false);
    setFeedback(null);
    setScore(0);
    setDone(false);
  };

  return (
    <GameFrame
      best={best}
      score={score}
      progress={done ? 100 : (round / CIRCUIT_PUZZLES.length) * 100}
      showStatus={false}
    >
      {!started ? (
        <MiniGameIntro
          id="logic-circuit"
          title={t('gamesMinis.logicCircuit.readyTitle')}
          description={t('gamesMinis.logicCircuit.description')}
          action={t('gamesMinis.common.start')}
          onStart={() => {
            audio.startFromGesture();
            setStarted(true);
          }}
        />
      ) : done ? (
        <Box ref={doneRef} sx={{ scrollMarginTop: 80 }}>
          <MiniGameCompletion
            score={score}
            best={best}
            title={t('gamesMinis.logicCircuit.doneTitle')}
            detail={t('gamesMinis.logicCircuit.doneDetail')}
            onReplay={restart}
          />
        </Box>
      ) : (
        <Stack ref={roundRef} sx={{ scrollMarginTop: 80 }}>
          <Box>
            <Box sx={{ pt: 0.5 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                gap={2}
                flexWrap="wrap"
              >
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  {t('gamesMinis.common.round', {
                    current: round + 1,
                    total: CIRCUIT_PUZZLES.length,
                  })}
                </Typography>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  {attempts > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      {t('gamesMinis.logicCircuit.attempts', { count: attempts })}
                    </Typography>
                  )}
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    sx={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {t('gamesMinis.common.score', { score })}
                  </Typography>
                  {checked && (
                    <Typography variant="caption" fontWeight={700} color="primary.main">
                      {t('gamesMinis.logicCircuit.matched', { count: matches, total: rows.length })}
                    </Typography>
                  )}
                </Stack>
              </Stack>
              <Typography
                component="h2"
                sx={{ mt: 1, fontSize: { xs: 18, sm: 20 }, fontWeight: 700, lineHeight: 1.3 }}
              >
                {t(`gamesMinis.logicCircuit.puzzles.${puzzle.id}.title`)}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, maxWidth: '68ch', lineHeight: 1.55 }}
              >
                {t('gamesMinis.logicCircuit.task')}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1fr) 380px' },
                gridTemplateAreas: {
                  xs: '"diagram" "controls" "table"',
                  md: '"diagram table" "controls table"',
                },
                alignItems: 'start',
                gap: { xs: 2, md: 2.5 },
                pt: { xs: 2, md: 2.5 },
              }}
            >
              <Box sx={{ gridArea: 'diagram', minWidth: 0 }}>
                <CircuitDiagram
                  config={config}
                  inputCount={puzzle.inputCount}
                  expression={circuitExpression}
                />
              </Box>
              <Box
                sx={{
                  gridArea: 'table',
                  minWidth: 0,
                }}
              >
                <Box sx={{ pb: 1 }}>
                  <Typography variant="body2" fontWeight={700} sx={{ fontSize: 14 }}>
                    {t('gamesMinis.logicCircuit.truthTable')}
                  </Typography>
                </Box>
                <TableContainer
                  sx={{
                    pb: 1,
                    maxHeight: { md: puzzle.inputCount === 4 ? 466 : undefined },
                  }}
                >
                  <Table
                    size="small"
                    stickyHeader={puzzle.inputCount === 4}
                    aria-label={t('gamesMinis.logicCircuit.truthTable')}
                    sx={{
                      '& th, & td': {
                        px: 0.75,
                        py: 0.9,
                        borderBottom: 0,
                        textAlign: 'center',
                        fontVariantNumeric: 'tabular-nums',
                      },
                      '& th': { color: 'text.secondary', fontSize: 12, fontWeight: 600 },
                      '& td': { fontSize: 13, fontWeight: 500 },
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>A</TableCell>
                        <TableCell>B</TableCell>
                        {puzzle.inputCount === 3 && <TableCell>C</TableCell>}
                        {puzzle.inputCount === 4 && (
                          <>
                            <TableCell>C</TableCell>
                            <TableCell>D</TableCell>
                          </>
                        )}
                        <TableCell>{t('gamesMinis.logicCircuit.target')}</TableCell>
                        <TableCell>{t('gamesMinis.logicCircuit.yours')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow key={`${row.a}${row.b}${row.c}${row.d}`}>
                          <TableCell>{row.a}</TableCell>
                          <TableCell>{row.b}</TableCell>
                          {puzzle.inputCount === 3 && <TableCell>{row.c}</TableCell>}
                          {puzzle.inputCount === 4 && (
                            <>
                              <TableCell>{row.c}</TableCell>
                              <TableCell>{row.d}</TableCell>
                            </>
                          )}
                          <TableCell sx={{ fontWeight: 700 }}>{row.expected}</TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              color: checked
                                ? row.actual === row.expected
                                  ? 'success.main'
                                  : 'error.main'
                                : 'text.disabled',
                            }}
                          >
                            {checked ? row.actual : '–'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'stretch', sm: 'flex-end' }}
                flexWrap="wrap"
                gap={{ xs: 1.5, sm: 2 }}
                sx={{ gridArea: 'controls' }}
              >
                {puzzle.pairings.length > 1 && (
                  <Box sx={{ flexBasis: '100%' }}>
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 0.75, fontSize: 13 }}>
                      {t('gamesMinis.logicCircuit.pairing')}
                    </Typography>
                    <ToggleButtonGroup
                      exclusive
                      size="small"
                      value={config.pairing}
                      aria-label={t('gamesMinis.logicCircuit.pairing')}
                      onChange={(_, pairing: CircuitConfig['pairing'] | null) => {
                        if (pairing) updateConfig({ ...config, pairing });
                      }}
                    >
                      {puzzle.pairings.map((pairing) => (
                        <ToggleButton
                          key={pairing}
                          value={pairing}
                          disabled={feedback === 'success'}
                          sx={{ fontWeight: 700, minWidth: 92 }}
                        >
                          {circuitPairLabels[pairing].map((pair) => pair.join('–')).join(' · ')}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </Box>
                )}
                <GatePicker
                  label={
                    puzzle.inputCount === 4
                      ? t('gamesMinis.logicCircuit.pairGate', {
                          first: firstPair[0],
                          second: firstPair[1],
                        })
                      : t('gamesMinis.logicCircuit.firstGate')
                  }
                  gates={puzzle.gates}
                  value={config.firstGate}
                  onChange={(firstGate) => updateConfig({ ...config, firstGate })}
                  disabled={feedback === 'success'}
                />
                {puzzle.inputCount >= 3 && (
                  <GatePicker
                    label={t(
                      puzzle.inputCount === 4
                        ? 'gamesMinis.logicCircuit.secondPairGate'
                        : 'gamesMinis.logicCircuit.secondGate',
                      puzzle.inputCount === 4
                        ? { first: secondPair[0], second: secondPair[1] }
                        : undefined,
                    )}
                    gates={puzzle.gates}
                    value={config.secondGate}
                    onChange={(secondGate) => updateConfig({ ...config, secondGate })}
                    disabled={feedback === 'success'}
                  />
                )}
                {puzzle.inputCount === 4 && (
                  <GatePicker
                    label={t('gamesMinis.logicCircuit.combineGate')}
                    gates={puzzle.gates}
                    value={config.thirdGate}
                    onChange={(thirdGate) => updateConfig({ ...config, thirdGate })}
                    disabled={feedback === 'success'}
                  />
                )}
                <Stack direction="row" alignItems="center" gap={1} sx={{ minHeight: 36 }}>
                  <Switch
                    checked={config.invert}
                    onChange={(_, invert) => updateConfig({ ...config, invert })}
                    disabled={feedback === 'success' || !puzzle.allowInvert}
                    slotProps={{ input: { 'aria-label': t('gamesMinis.logicCircuit.invert') } }}
                  />
                  <Typography variant="body2" fontWeight={700}>
                    {t('gamesMinis.logicCircuit.invert')}
                  </Typography>
                </Stack>
                <Button
                  variant="contained"
                  onClick={check}
                  disabled={feedback === 'success'}
                  sx={{ ml: { md: 'auto' } }}
                >
                  {t('gamesMinis.logicCircuit.check')}
                </Button>
                {puzzle.gates.length > GATES.length && (
                  <Typography variant="caption" color="text.secondary" sx={{ flexBasis: '100%' }}>
                    {t(
                      puzzle.gates.length === 4
                        ? 'gamesMinis.logicCircuit.nandGateHelp'
                        : 'gamesMinis.logicCircuit.advancedGateHelp',
                    )}
                  </Typography>
                )}
              </Stack>
            </Box>
          </Box>
          {feedback === 'miss' && (
            <Alert severity="info" sx={{ mx: 2, mb: 2 }}>
              {t('gamesMinis.logicCircuit.tryAgain', { count: matches, total: rows.length })}
            </Alert>
          )}
          {attempts >= 2 && feedback !== 'success' && (
            <Alert severity="warning" sx={{ mx: 2, mb: 2 }}>
              {t(`gamesMinis.logicCircuit.puzzles.${puzzle.id}.hint`)}
            </Alert>
          )}
          {feedback === 'success' && (
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              justifyContent="space-between"
              gap={1.5}
              sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}
            >
              <Typography variant="body2" fontWeight={700} color="success.main" role="status">
                {t('gamesMinis.logicCircuit.success', { points: circuitRoundScore(attempts) })}
              </Typography>
              <Button variant="contained" onClick={next}>
                {round === CIRCUIT_PUZZLES.length - 1
                  ? t('gamesMinis.common.finish')
                  : t('gamesMinis.common.next')}
              </Button>
            </Stack>
          )}
        </Stack>
      )}
    </GameFrame>
  );
};

export default LogicCircuitGame;
