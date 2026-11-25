import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Chip, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { savePairDecision, usePairReview } from 'modules/admin/application/integrity';
import type {
  PairReview,
  PairSummary,
  ReviewDecision,
  ReviewPerson,
} from 'modules/admin/domain/entities/integrity.types';
import { ConsoleError, ConsoleSkeleton } from 'modules/admin/ui/shared/components/ConsoleState';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import SourceComparison from './SourceComparison';

interface Props {
  contest: number;
  pair: PairSummary;
  people: ReviewPerson[];
  onManage: (p: ReviewPerson) => void;
  onSaved: () => Promise<unknown>;
}
function DecisionForm({
  data,
  contest,
  refresh,
}: {
  data: PairReview;
  contest: number;
  refresh: () => Promise<unknown>;
}) {
  const { t } = useTranslation();
  const [note, setNote] = useState(data.note);
  const [decision, setDecision] = useState<ReviewDecision>(data.decision);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  const save = async () => {
    setBusy(true);
    setError(undefined);
    try {
      await savePairDecision(contest, data.id, decision, note, data.reviewedAt);
      await refresh();
    } catch (e) {
      setError(e);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Stack spacing={1.25} sx={{ borderTop: 1, borderColor: 'divider', pt: 2 }}>
      <Typography variant="h6">{t('admin.integrity.juryDecision')}</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} gap={1}>
        <TextField
          size="small"
          select
          label={t('admin.integrity.decision')}
          value={decision}
          onChange={(e) => setDecision(e.target.value as ReviewDecision)}
          sx={{ minWidth: 150 }}
        >
          {(['pending', 'flagged', 'cleared'] as const).map((s) => (
            <MenuItem value={s} key={s}>
              {t('admin.integrity.' + s)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          size="small"
          multiline
          maxRows={4}
          fullWidth
          label={t('admin.integrity.note')}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          slotProps={{ htmlInput: { maxLength: 2000 } }}
        />
      </Stack>
      <Stack direction="row" alignItems="center" gap={1.5}>
        <Button
          variant="outlined"
          disabled={busy || (decision === data.decision && note === data.note)}
          onClick={save}
        >
          {t('admin.integrity.save')}
        </Button>
        {data.reviewer && (
          <Typography variant="caption" color="text.secondary">
            {data.reviewer}
          </Typography>
        )}
      </Stack>
      <ConsoleError error={error} retry={() => void refresh()} />
    </Stack>
  );
}
export default function EvidencePanel({ contest, pair, people, onManage, onSaved }: Props) {
  const { t } = useTranslation();
  const [item, setItem] = useState(0);
  const review = usePairReview(contest, pair.id, item);
  const first = people.find((p) => p.id === pair.first);
  const second = people.find((p) => p.id === pair.second);
  const data = review.data;
  return (
    <Stack spacing={2} minWidth={0}>
      <Box>
        <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1}>
          <IconifyIcon icon="mdi:file-compare" color="primary.main" fontSize={24} />
          <Typography variant="h5">{t('admin.integrity.evidence')}</Typography>
          <Chip
            size="small"
            label={t('admin.integrity.priority', { score: pair.score })}
            color="primary"
          />
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
          {t('admin.integrity.scoreHelp')}
        </Typography>
      </Box>
      <Stack direction="row" gap={1} flexWrap="wrap">
        {[first, second].map(
          (p) =>
            p && (
              <Button
                key={p.id}
                size="small"
                variant="outlined"
                color={p.excluded ? 'error' : 'neutral'}
                startIcon={<IconifyIcon icon="mdi:account-outline" />}
                onClick={() => onManage(p)}
                sx={{ textDecoration: p.excluded ? 'line-through' : undefined }}
              >
                {p.name}
              </Button>
            ),
        )}
      </Stack>
      <ConsoleError error={review.error} retry={() => void review.mutate()} />
      {review.isLoading && <ConsoleSkeleton />}
      {data && (
        <>
          <TextField
            select
            fullWidth
            size="small"
            label={t('admin.integrity.problem')}
            value={item}
            onChange={(e) => setItem(Number(e.target.value))}
          >
            {data.items.map((e, i) => (
              <MenuItem key={i} value={i}>
                {e.symbol} · {e.lang.toUpperCase()} · {e.score}% ·{' '}
                {t('admin.integrity.tokens', { count: e.tokens })}
              </MenuItem>
            ))}
          </TextField>
          {data.items[item].parser === 'text' && (
            <Typography variant="caption" color="warning.main">
              {t('admin.integrity.lexical')}
            </Typography>
          )}
          <SourceComparison
            key={item}
            data={data}
            names={[first?.name ?? '', second?.name ?? '']}
          />
          <DecisionForm
            key={data.reviewedAt ?? 'new'}
            data={data}
            contest={contest}
            refresh={() => Promise.all([review.mutate(), onSaved()])}
          />
        </>
      )}
    </Stack>
  );
}
