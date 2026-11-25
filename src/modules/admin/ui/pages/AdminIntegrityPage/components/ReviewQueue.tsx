import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Chip,
  IconButton,
  ListItemButton,
  Pagination,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import type {
  ContestReview,
  PairSummary,
  ReviewPerson,
} from 'modules/admin/domain/entities/integrity.types';
import IconifyIcon from 'shared/components/base/IconifyIcon';

interface Props {
  data: ContestReview;
  pairs: PairSummary[];
  selectedPair?: number;
  person?: ReviewPerson;
  onPair: (id: number) => void;
  onPerson: (p?: ReviewPerson) => void;
  onManage: (p: ReviewPerson) => void;
}
export default function ReviewQueue({
  data,
  pairs,
  selectedPair,
  person,
  onPair,
  onPerson,
  onManage,
}: Props) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'pairs' | 'people'>('pairs');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const names = new Map(data.people.map((p) => [p.id, p.name]));
  const q = search.trim().toLocaleLowerCase();
  const filteredPairs = pairs.filter((p) =>
    [names.get(p.first), names.get(p.second)].some((n) => n?.toLocaleLowerCase().includes(q)),
  );
  const people = data.people.filter(
    (p) =>
      p.name.toLocaleLowerCase().includes(q) ||
      p.accounts.some((a) => a.name.toLocaleLowerCase().includes(q)),
  );
  const total = tab === 'pairs' ? filteredPairs.length : people.length;
  const pages = Math.max(1, Math.ceil(total / 8));
  const shown = Math.min(page, pages);
  const offset = (shown - 1) * 8;
  return (
    <Box
      sx={{
        minWidth: 0,
        borderInlineEnd: { lg: 1 },
        borderBottom: 1,
        borderColor: 'divider',
        p: 2,
      }}
    >
      <Tabs
        value={tab}
        onChange={(_, v) => {
          setTab(v);
          setPage(1);
          setSearch('');
        }}
        variant="fullWidth"
      >
        <Tab value="pairs" label={t('admin.integrity.pairs')} />
        <Tab value="people" label={t('admin.integrity.contestants')} />
      </Tabs>
      <TextField
        fullWidth
        size="small"
        label={t('admin.integrity.search')}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        sx={{ my: 1.5 }}
      />
      {person && tab === 'pairs' && (
        <Chip
          size="small"
          label={person.name}
          onDelete={() => {
            onPerson();
            setPage(1);
          }}
          sx={{ mb: 1 }}
        />
      )}
      {tab === 'pairs'
        ? filteredPairs.slice(offset, offset + 8).map((p) => (
            <ListItemButton
              key={p.id}
              selected={selectedPair === p.id}
              onClick={() => onPair(p.id)}
              sx={{ gap: 1, px: 1, py: 1.15, borderBottom: 1, borderColor: 'divider' }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" sx={{ overflowWrap: 'anywhere' }}>
                  {names.get(p.first)} · {names.get(p.second)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('admin.integrity.problemCount', { count: p.problems })} ·{' '}
                  {t('admin.integrity.' + p.decision)}
                </Typography>
              </Box>
              <Typography variant="subtitle2" color="primary.main">
                {p.score}/100
              </Typography>
            </ListItemButton>
          ))
        : people.slice(offset, offset + 8).map((p) => (
            <Stack
              key={p.id}
              direction="row"
              alignItems="center"
              sx={{ borderBottom: 1, borderColor: 'divider', gap: 0.5 }}
            >
              <Button
                color="neutral"
                onClick={() => {
                  onPerson(p);
                  setTab('pairs');
                  setSearch('');
                  setPage(1);
                }}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  justifyContent: 'flex-start',
                  textAlign: 'start',
                  py: 1,
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      textDecoration: p.excluded ? 'line-through' : undefined,
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {p.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('admin.integrity.pairCount', { count: p.pairs })} · {p.score}/100
                  </Typography>
                </Box>
              </Button>
              <Tooltip title={t('admin.integrity.actions')}>
                <IconButton
                  aria-label={t('admin.integrity.actions') + ' · ' + p.name}
                  onClick={() => onManage(p)}
                >
                  <IconifyIcon icon="mdi:account-cog-outline" />
                </IconButton>
              </Tooltip>
            </Stack>
          ))}
      {!total && (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
          {t('admin.integrity.emptySearch')}
        </Typography>
      )}
      {pages > 1 && (
        <Pagination
          size="small"
          sx={{ mt: 2 }}
          page={shown}
          count={pages}
          siblingCount={0}
          onChange={(_, v) => setPage(v)}
        />
      )}
    </Box>
  );
}
