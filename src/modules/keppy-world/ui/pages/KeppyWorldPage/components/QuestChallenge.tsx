import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  ButtonBase,
  Checkbox,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import GameCodeEditor from 'modules/kepper-game/ui/pages/KepperGamePage/components/GameCodeEditor';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import type { WorldChallenge, WorldResult, WorldRun } from '../../../../domain';
import WorldBrainChallenge from './WorldBrainChallenge';

type Props = {
  run: WorldRun;
  pending: boolean;
  onSubmit: (answer: unknown) => Promise<WorldResult | undefined>;
  onDone: () => void;
};
type ChallengeProps<T extends WorldChallenge['kind']> = {
  challenge: Extract<WorldChallenge, { kind: T }>;
  pending: boolean;
  submit: Props['onSubmit'];
};

const BugChallenge = ({ challenge, pending, submit }: ChallengeProps<'bug-hunt'>) => {
  const { t } = useTranslation();
  const [line, setLine] = useState<number | null>(null);
  const [fix, setFix] = useState('');
  return (
    <Stack spacing={2}>
      <Box sx={{ bgcolor: 'background.elevation1', borderRadius: 2, py: 1, overflowX: 'auto' }}>
        <Box sx={{ width: 'max-content', minWidth: '100%' }}>
          {challenge.code.map((code, index) => (
            <ButtonBase
              key={index}
              disabled={pending}
              onClick={() => {
                setLine(index + 1);
                setFix(code.trim());
              }}
              aria-pressed={line === index + 1}
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                width: '100%',
                textAlign: 'left',
                py: 0.25,
                px: 2,
                gap: 2,
                bgcolor: line === index + 1 ? 'primary.lighter' : undefined,
                color: line === index + 1 ? 'primary.main' : 'text.primary',
                '&:hover': { bgcolor: 'action.hover' },
                '&.Mui-focusVisible': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: -2,
                },
              }}
            >
              <Box
                component="span"
                aria-hidden="true"
                sx={{
                  flex: '0 0 3ch',
                  textAlign: 'right',
                  userSelect: 'none',
                  color: 'text.disabled',
                  font: '13px/1.7 monospace',
                }}
              >
                {index + 1}
              </Box>
              <Box
                component="code"
                sx={{ whiteSpace: 'pre', tabSize: 4, font: '14px/1.7 Consolas, monospace' }}
              >
                {code || ' '}
              </Box>
            </ButtonBase>
          ))}
        </Box>
      </Box>
      {challenge.requiresFix && (
        <TextField
          label={t('keppyWorld.correctedLine')}
          value={fix}
          onChange={(event) => setFix(event.target.value)}
          disabled={pending || line === null}
          fullWidth
          slotProps={{ htmlInput: { spellCheck: false, maxLength: 500 } }}
        />
      )}
      <Button
        variant="contained"
        disabled={pending || line === null}
        onClick={() => void submit({ line, fix })}
      >
        {t('keppyWorld.check')}
      </Button>
    </Stack>
  );
};

const CircuitChallenge = ({ challenge, pending, submit }: ChallengeProps<'logic-circuit'>) => {
  const { t } = useTranslation();
  const [expression, setExpression] = useState('');
  return (
    <Stack spacing={2}>
      <Box sx={{ bgcolor: 'background.elevation1', borderRadius: 2, overflow: 'auto' }}>
        <Table
          size="small"
          aria-label={t('keppyWorld.truthTable')}
          sx={{
            '& td, & th': {
              border: 0,
              textAlign: 'center',
              fontVariantNumeric: 'tabular-nums',
              py: 1,
            },
            '& tbody tr:nth-of-type(even)': { bgcolor: 'action.hover' },
          }}
        >
          <TableHead>
            <TableRow>
              {challenge.inputs.map((name) => (
                <TableCell key={name}>{name}</TableCell>
              ))}
              <TableCell>{t('keppyWorld.output')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {challenge.rows.map((row, index) => (
              <TableRow key={index}>
                {row.inputs.map((value, i) => (
                  <TableCell key={i}>{value}</TableCell>
                ))}
                <TableCell sx={{ color: 'primary.main', fontWeight: 700 }}>{row.output}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <TextField
        value={expression}
        onChange={(event) => setExpression(event.target.value)}
        disabled={pending}
        label={t('keppyWorld.expression')}
        placeholder="(A AND B) OR NOT C"
        helperText={t('keppyWorld.gateLimit', { count: challenge.maxGates })}
        slotProps={{ htmlInput: { maxLength: 500, spellCheck: false } }}
      />
      <Button
        variant="contained"
        disabled={pending || !expression.trim()}
        onClick={() => void submit({ expression })}
      >
        {t('keppyWorld.check')}
      </Button>
    </Stack>
  );
};

const IslandsChallenge = ({ challenge, pending, submit }: ChallengeProps<'code-islands'>) => {
  const { t } = useTranslation();
  const [program, setProgram] = useState('');
  const columns = Math.max(...challenge.grid.map((row) => row.length));
  const directions: Record<string, string> = {
    east: 'mdi:arrow-right',
    west: 'mdi:arrow-left',
    north: 'mdi:arrow-up',
    south: 'mdi:arrow-down',
  };
  return (
    <Stack spacing={2}>
      <Box
        sx={{
          bgcolor: '#214666',
          borderRadius: 2,
          p: 2,
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: 0.5,
          maxWidth: 380,
          width: '100%',
          alignSelf: 'center',
        }}
      >
        {challenge.grid.flatMap((row, y) =>
          Array.from({ length: columns }, (_, x) => {
            const tile = row[x] ?? '#';
            const icon =
              tile === 'S'
                ? directions[challenge.startDirection]
                : tile === 'G'
                  ? 'mdi:flag-checkered'
                  : tile === 'K'
                    ? 'mdi:diamond-stone'
                    : null;
            return (
              <Box
                key={`${x}-${y}`}
                aria-label={tile === '#' ? undefined : `${x + 1}, ${y + 1}: ${tile}`}
                sx={{
                  aspectRatio: '1',
                  borderRadius: 0.8,
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: tile === '#' ? 'transparent' : tile === 'G' ? '#aee6d7' : '#e8f0f7',
                  color: tile === 'K' ? '#c88922' : '#246ad3',
                }}
              >
                {icon && <IconifyIcon icon={icon} width={22} />}
              </Box>
            );
          }),
        )}
      </Box>
      <Typography variant="caption" color="text.secondary">
        {t('keppyWorld.programHelp', { count: challenge.maxCommands })}
      </Typography>
      <GameCodeEditor value={program} disabled={pending} onChange={setProgram} />
      <Button
        variant="contained"
        startIcon={<IconifyIcon icon="mdi:play" />}
        disabled={pending || !program.trim()}
        onClick={() => void submit({ program })}
      >
        {t('keppyWorld.runProgram')}
      </Button>
    </Stack>
  );
};

const MemoryChallenge = ({ challenge, pending, submit }: ChallengeProps<'memory-grid'>) => {
  const { t } = useTranslation();
  const [paused, setPaused] = useState(false);
  const observe = useCallback(async () => {
    const result = await submit({ action: 'observe' });
    setPaused(!result);
  }, [submit]);
  useEffect(() => {
    if (challenge.phase !== 'watch' || pending || paused) return;
    const delay = challenge.nextRevealAt
      ? Math.max(100, Date.parse(challenge.nextRevealAt) - Date.now() + 80)
      : 150;
    const timer = window.setTimeout(() => void observe(), delay);
    return () => window.clearTimeout(timer);
  }, [challenge, pending, paused, observe]);
  return (
    <Stack spacing={2}>
      <Typography variant="body2" color="text.secondary">
        {t(challenge.phase === 'watch' ? 'keppyWorld.watch' : 'keppyWorld.repeatSequence')}
      </Typography>
      {paused && (
        <Button onClick={() => void observe()} disabled={pending}>
          {t('keppyWorld.retry')}
        </Button>
      )}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${challenge.columns}, 1fr)`,
          gap: 1,
          maxWidth: 400,
          width: '100%',
          alignSelf: 'center',
        }}
      >
        {Array.from({ length: challenge.rows * challenge.columns }, (_, cell) => (
          <ButtonBase
            key={cell}
            aria-label={t('keppyWorld.cell', { count: cell + 1 })}
            disabled={pending || challenge.phase === 'watch'}
            onClick={() => void submit({ cell, index: challenge.entered })}
            sx={{
              aspectRatio: '1',
              borderRadius: 1.5,
              bgcolor:
                challenge.phase === 'watch' && challenge.reveal?.cell === cell
                  ? 'primary.main'
                  : 'background.elevation2',
              color:
                challenge.phase === 'watch' && challenge.reveal?.cell === cell
                  ? 'primary.contrastText'
                  : 'text.secondary',
              fontSize: 18,
              transition: 'background-color 100ms',
              '&:active': { bgcolor: 'primary.light' },
            }}
          >
            {cell + 1}
          </ButtonBase>
        ))}
      </Box>
      <LinearProgress variant="determinate" value={(100 * challenge.entered) / challenge.length} />
      <Typography variant="caption" color="text.secondary">
        {challenge.entered} / {challenge.length}
      </Typography>
    </Stack>
  );
};

const CargoChallenge = ({ challenge, pending, submit }: ChallengeProps<'cargo'>) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string[]>([]);
  const chosen = challenge.items.filter((item) => selected.includes(item.id));
  const weight = chosen.reduce((sum, item) => sum + item.weight, 0);
  const value = chosen.reduce((sum, item) => sum + item.value, 0);
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={3}>
        <Typography color={weight > challenge.capacity ? 'error.main' : 'text.primary'}>
          {t('keppyWorld.capacity')}: {weight}/{challenge.capacity}
        </Typography>
        <Typography color="primary.main">
          {t('keppyWorld.value')}: {value}/{challenge.targetValue}
        </Typography>
      </Stack>
      <Box>
        {challenge.items.map((item) => (
          <ButtonBase
            key={item.id}
            disabled={pending}
            onClick={() =>
              setSelected((ids) =>
                ids.includes(item.id) ? ids.filter((id) => id !== item.id) : [...ids, item.id],
              )
            }
            sx={{
              width: '100%',
              p: 1,
              borderRadius: 1,
              textAlign: 'left',
              bgcolor: selected.includes(item.id) ? 'action.selected' : undefined,
            }}
          >
            <Checkbox checked={selected.includes(item.id)} tabIndex={-1} disableRipple />
            <Typography sx={{ flex: 1 }} variant="body2">
              {item.label}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <IconifyIcon icon="mdi:weight-kilogram" width={17} />
              <Typography variant="body2">{item.weight}</Typography>
              <IconifyIcon icon="mdi:diamond-stone" width={17} />
              <Typography variant="body2">{item.value}</Typography>
            </Stack>
          </ButtonBase>
        ))}
      </Box>
      <Button
        variant="contained"
        disabled={pending || !selected.length || weight > challenge.capacity}
        onClick={() => void submit({ itemIds: selected })}
      >
        {t('keppyWorld.loadCargo')}
      </Button>
    </Stack>
  );
};

const QuestChallenge = ({ run, pending, onSubmit, onDone }: Props) => {
  const { t } = useTranslation();
  const [incorrect, setIncorrect] = useState(false);
  const [expired, setExpired] = useState(() => Date.parse(run.expiresAt) <= Date.now());
  useEffect(() => {
    const remaining = Date.parse(run.expiresAt) - Date.now();
    setExpired(remaining <= 0);
    if (run.status !== 'active' || !Number.isFinite(remaining) || remaining <= 0) return;
    const timer = window.setTimeout(() => setExpired(true), remaining);
    return () => window.clearTimeout(timer);
  }, [run.expiresAt, run.status]);
  const submit = useCallback(
    async (answer: unknown) => {
      const result = await onSubmit(answer);
      // Memory observations and individual correct cells are progress, not failed submissions.
      setIncorrect(result?.feedback === 'incorrect');
      return result;
    },
    [onSubmit],
  );
  const challenge = run.challenge;
  if (run.status === 'completed')
    return (
      <Stack alignItems="center" spacing={2} py={4}>
        <IconifyIcon icon="mdi:check-circle-outline" width={52} sx={{ color: 'success.main' }} />
        <Typography component="h3" fontSize={24} fontWeight={700}>
          {t('keppyWorld.completed')}
        </Typography>
        <Typography color="primary.main" fontSize={20}>
          +{run.xp} XP
        </Typography>
        <Button variant="contained" disabled={pending} onClick={onDone}>
          {t('keppyWorld.backToWorld')}
        </Button>
      </Stack>
    );
  if (expired || ['expired', 'abandoned'].includes(run.status))
    return (
      <Stack spacing={2}>
        <Alert severity="info">{t('keppyWorld.expired')}</Alert>
        <Button disabled={pending} onClick={onDone}>
          {t('keppyWorld.backToWorld')}
        </Button>
      </Stack>
    );
  return (
    <Stack spacing={2.5}>
      <Typography
        sx={{ fontSize: 15, lineHeight: 1.7, whiteSpace: 'pre-line', color: 'text.secondary' }}
      >
        {challenge.prompt}
      </Typography>
      {incorrect && <Alert severity="info">{t('keppyWorld.tryAgain')}</Alert>}
      {(challenge.kind === 'math-compare' ||
        challenge.kind === 'quick-math' ||
        challenge.kind === 'number-sequence' ||
        challenge.kind === 'number-hunt' ||
        challenge.kind === 'memory-matrix') && (
        <WorldBrainChallenge challenge={challenge} pending={pending} submit={submit} />
      )}
      {challenge.kind === 'bug-hunt' && (
        <BugChallenge challenge={challenge} pending={pending} submit={submit} />
      )}
      {challenge.kind === 'logic-circuit' && (
        <CircuitChallenge challenge={challenge} pending={pending} submit={submit} />
      )}
      {challenge.kind === 'code-islands' && (
        <IslandsChallenge challenge={challenge} pending={pending} submit={submit} />
      )}
      {challenge.kind === 'memory-grid' && (
        <MemoryChallenge challenge={challenge} pending={pending} submit={submit} />
      )}
      {challenge.kind === 'cargo' && (
        <CargoChallenge challenge={challenge} pending={pending} submit={submit} />
      )}
      {challenge.kind === 'daily-task' && (
        <Stack spacing={2}>
          <Button
            component="a"
            href={
              challenge.href.startsWith('/') && !challenge.href.startsWith('//')
                ? challenge.href
                : '/'
            }
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<IconifyIcon icon="mdi:open-in-new" />}
          >
            {t('keppyWorld.openDaily')}
          </Button>
          <Button
            variant="contained"
            disabled={pending}
            onClick={() => void submit({ action: 'verify' })}
          >
            {t('keppyWorld.verifyDaily')}
          </Button>
        </Stack>
      )}
    </Stack>
  );
};
export default QuestChallenge;
