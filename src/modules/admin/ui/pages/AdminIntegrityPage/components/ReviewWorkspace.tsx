import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Chip,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import {
  isScanning,
  startIntegrityRun,
  useContestReview,
} from 'modules/admin/application/integrity';
import type { ReviewPerson } from 'modules/admin/domain/entities/integrity.types';
import { ConsoleError, ConsoleSkeleton } from 'modules/admin/ui/shared/components/ConsoleState';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import EvidencePanel from './EvidencePanel';
import ParticipantActions from './ParticipantActions';
import ReviewQueue from './ReviewQueue';
import ReviewRecords from './ReviewRecords';

export default function ReviewWorkspace({ contest }: { contest: number }) {
  const { t, i18n } = useTranslation();
  const [runId, setRunId] = useState<number>();
  const review = useContestReview(contest, runId);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<unknown>();
  const [pairId, setPairId] = useState<number>();
  const evidencePanel = useRef<HTMLDivElement>(null);
  const stacked = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [personId, setPersonId] = useState<number>();
  const [manage, setManage] = useState<ReviewPerson | null>(null);
  const data = review.data;
  const run = data?.run;
  const scanning = isScanning(data?.runs[0]?.status);
  const progress = run?.progress;
  const person = data?.people.find((p) => p.id === personId);
  const pairs =
    data?.pairs.filter((p) => !person || p.first === person.id || p.second === person.id) ?? [];
  const pair = pairs.find((p) => p.id === pairId) ?? pairs[0];
  const start = async () => {
    setPending(true);
    setError(undefined);
    try {
      const next = await startIntegrityRun(contest);
      setRunId(next.id);
      setPairId(undefined);
      setPersonId(undefined);
      await review.mutate();
    } catch (e) {
      setError(e);
    } finally {
      setPending(false);
    }
  };
  if (!data)
    return (
      <>
        <ConsoleError error={review.error} retry={() => void review.mutate()} />
        {review.isLoading && <ConsoleSkeleton />}
      </>
    );
  const stats = [
    ['attempts', progress?.attempts ?? '—', 'mdi:code-braces'],
    ['contestants', data.people.length, 'mdi:account-group-outline'],
    ['pairs', data.pairs.length, 'mdi:vector-link'],
    [
      'reviewed',
      data.pairs.filter((p) => p.decision !== 'pending').length,
      'mdi:clipboard-check-outline',
    ],
  ] as const;
  return (
    <Box sx={{ minWidth: 0 }}>
      <Stack
        direction="row"
        useFlexGap
        flexWrap="wrap"
        alignItems="center"
        gap={1.5}
        sx={{
          p: { xs: 2, md: 3 },
          background: 'linear-gradient(110deg, var(--kep-surface, transparent), transparent)',
        }}
      >
        <Box sx={{ flex: '1 1 200px' }}>
          <Typography variant="h5">{data.contest.title}</Typography>
          {run && (
            <Chip
              size="small"
              sx={{ mt: 1 }}
              label={t('admin.integrity.' + run.status)}
              color={
                run.status === 'complete'
                  ? 'success'
                  : run.status === 'failed'
                    ? 'error'
                    : run.status === 'partial'
                      ? 'warning'
                      : 'info'
              }
            />
          )}
        </Box>
        {run && (
          <TextField
            select
            size="small"
            label={t('admin.integrity.runHistory')}
            value={run.id}
            onChange={(e) => {
              setRunId(Number(e.target.value));
              setPairId(undefined);
            }}
          >
            {data.runs.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                #{r.id} · {new Date(r.created).toLocaleString(i18n.language)}
              </MenuItem>
            ))}
          </TextField>
        )}
        <Button
          variant="contained"
          onClick={start}
          disabled={pending || scanning}
          startIcon={<IconifyIcon icon="mdi:play-outline" />}
        >
          {t('admin.integrity.start')}
        </Button>
      </Stack>
      <ConsoleError error={error || review.error} retry={() => void review.mutate()} />
      {isScanning(run?.status) && (
        <Box sx={{ px: 2, pb: 2 }} aria-live="polite">
          <LinearProgress
            variant={progress?.groups ? 'determinate' : 'indeterminate'}
            value={(100 * (progress?.done ?? 0)) / (progress?.groups || 1)}
          />
          <Typography variant="caption">
            {t('admin.integrity.progress', {
              done: progress?.done ?? 0,
              total: progress?.groups ?? '…',
            })}{' '}
            {progress?.current}
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2,1fr)', md: 'repeat(4,1fr)' },
          borderBlock: '1px solid',
          borderColor: 'divider',
        }}
      >
        {stats.map(([key, value, icon]) => (
          <Box key={key} sx={{ p: { xs: 1.5, md: 2 }, borderInlineEnd: 1, borderColor: 'divider' }}>
            <Stack direction="row" alignItems="center" gap={1} color="text.secondary">
              <IconifyIcon icon={icon} />
              <Typography variant="body2">{t('admin.integrity.' + key)}</Typography>
            </Stack>
            <Typography variant="h4" sx={{ mt: 0.5, fontVariantNumeric: 'tabular-nums' }}>
              {value}
            </Typography>
          </Box>
        ))}
      </Box>
      {!run && (
        <Alert severity="info" sx={{ m: 2 }}>
          {t('admin.integrity.firstRun')}
        </Alert>
      )}
      {run?.status === 'failed' && (
        <Alert severity="error" sx={{ m: 2 }}>
          {t('admin.integrity.runFailed')}
        </Alert>
      )}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0,1fr)', lg: 'minmax(250px,0.8fr) minmax(0,2fr)' },
          alignItems: 'start',
        }}
      >
        <ReviewQueue
          data={data}
          pairs={pairs}
          selectedPair={pair?.id}
          person={person}
          onPair={(id) => {
            setPairId(id);
            if (stacked) evidencePanel.current?.scrollIntoView({ block: 'start' });
          }}
          onPerson={(p) => {
            setPersonId(p?.id);
            setPairId(undefined);
          }}
          onManage={setManage}
        />
        <Box ref={evidencePanel} sx={{ p: { xs: 2, md: 2.5 }, minWidth: 0, scrollMarginTop: 80 }}>
          {pair ? (
            <EvidencePanel
              key={pair.id}
              contest={contest}
              pair={pair}
              people={data.people}
              onManage={setManage}
              onSaved={() => review.mutate()}
            />
          ) : (
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={1.2}
              sx={{ py: 6, color: 'text.secondary' }}
            >
              <IconifyIcon icon="mdi:file-search-outline" fontSize={32} />
              <Typography>{t('admin.integrity.noEvidence')}</Typography>
            </Stack>
          )}
        </Box>
      </Box>
      <ReviewRecords data={data} />
      {manage && (
        <ParticipantActions
          key={manage.id}
          contest={contest}
          person={data.people.find((p) => p.id === manage.id) ?? manage}
          history={data.history}
          onClose={() => setManage(null)}
          onSaved={() => review.mutate()}
        />
      )}
    </Box>
  );
}
