import { useDeferredValue, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Autocomplete, Box, TextField } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { useIntegrityContests } from 'modules/admin/application/integrity';
import type { ContestOption } from 'modules/admin/domain/entities/integrity.types';
import { ConsoleError, ConsoleSkeleton } from 'modules/admin/ui/shared/components/ConsoleState';
import WorkspaceHeader from 'modules/admin/ui/shared/components/WorkspaceHeader';
import FramedPage from 'shared/components/sections/common/FramedPage';
import ReviewWorkspace from './components/ReviewWorkspace';

export default function AdminIntegrityPage() {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [selected, setSelected] = useState<ContestOption | null>(null);
  const [search, setSearch] = useState('');
  const initial = useIntegrityContests('');
  const filtered = useIntegrityContests(useDeferredValue(search));
  const contest = selected ?? initial.data?.[0] ?? null;
  if (!currentUser?.isSuperuser)
    return <Alert severity="warning">{t('admin.integrity.restricted')}</Alert>;
  return (
    <FramedPage>
      <WorkspaceHeader title={t('admin.integrity.title')} icon="mdi:file-compare">
        <Autocomplete
          size="small"
          value={contest}
          options={filtered.data ?? []}
          getOptionLabel={(o) => o.title}
          isOptionEqualToValue={(a, b) => a.id === b.id}
          filterOptions={(items) => items}
          onInputChange={(_, q, reason) => setSearch(reason === 'input' ? q : '')}
          onChange={(_, next) => {
            if (next) setSelected(next);
          }}
          disableClearable={!!contest}
          loading={filtered.isLoading}
          noOptionsText={t('admin.integrity.emptySearch')}
          sx={{ width: { xs: 235, sm: 300 }, maxWidth: '100%' }}
          renderInput={(params) => <TextField {...params} label={t('admin.integrity.contest')} />}
        />
      </WorkspaceHeader>
      <ConsoleError
        error={initial.error || filtered.error}
        retry={() => void Promise.all([initial.mutate(), filtered.mutate()])}
      />
      {contest ? (
        <ReviewWorkspace key={contest.id} contest={contest.id} />
      ) : initial.isLoading ? (
        <ConsoleSkeleton />
      ) : (
        <Box sx={{ p: 3 }}>{t('admin.integrity.emptySearch')}</Box>
      )}
    </FramedPage>
  );
}
