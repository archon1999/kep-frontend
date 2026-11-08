import { type FormEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dialog, DialogActions, DialogContent, Stack, Typography } from '@mui/material';
import { saveAdminRecord, useAdminDetail } from 'modules/admin/application';
import type { AdminDetail } from 'modules/admin/domain';
import DialogHeader from 'shared/components/common/DialogHeader';
import { toast } from 'sonner';
import { getFieldErrors } from '../helpers';
import { ConsoleError, ConsoleSkeleton } from './ConsoleState';
import SchemaField from './SchemaField';

const resourceKey = 'backend.problem';

export default function ProblemRatingDialog({
  id,
  onClose,
}: {
  id: string;
  onClose: (changed?: boolean) => void;
}) {
  const { t } = useTranslation();
  const { data, error, isLoading, isValidating, mutate } = useAdminDetail(resourceKey, id);
  const [busy, setBusy] = useState(false);
  const close = () => {
    if (!busy) onClose();
  };
  return (
    <Dialog open fullWidth maxWidth="xs" aria-labelledby="problem-rating-title" onClose={close}>
      <DialogHeader
        id="problem-rating-title"
        title={t('admin.workspace.editRating')}
        onClose={close}
        closeDisabled={busy}
      />
      <ConsoleError error={error} retry={() => void mutate()} />
      {isLoading || isValidating ? (
        <ConsoleSkeleton kind="form" />
      ) : data && data.id === id && !error ? (
        <RatingForm
          key={data.revision}
          record={data}
          busy={busy}
          setBusy={setBusy}
          onClose={onClose}
          onSaved={(record) => void mutate(record, false)}
          onReload={() => void mutate()}
        />
      ) : (
        <DialogActions>
          <Button onClick={close}>{t('common.close')}</Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

function RatingForm({
  record,
  busy,
  setBusy,
  onClose,
  onSaved,
  onReload,
}: {
  record: AdminDetail;
  busy: boolean;
  setBusy: (value: boolean) => void;
  onClose: (changed?: boolean) => void;
  onSaved: (record: AdminDetail) => void;
  onReload: () => void;
}) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(record.values.problem_rating);
  const [error, setError] = useState<unknown>(null);
  const locked = useRef(false);
  const field = record.fields.find((item) => item.name === 'problem_rating');
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (locked.current || !record.canSave || !record.id || !field || field.readOnly) return;
    locked.current = true;
    setBusy(true);
    setError(null);
    try {
      const result = await saveAdminRecord(resourceKey, record.id, {
        revision: record.revision,
        values: { problem_rating: rating },
      });
      onSaved(result);
      toast.success(t('admin.workspace.ratingSaved'));
      onClose(true);
    } catch (failure) {
      setError(failure);
    } finally {
      locked.current = false;
      setBusy(false);
    }
  };
  return (
    <Stack component="form" onSubmit={submit}>
      <DialogContent>
        <Typography fontWeight={600} sx={{ mb: 0.5 }}>
          {record.label}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>
          #{record.id}
        </Typography>
        {field && (
          <SchemaField
            resourceKey={resourceKey}
            field={field}
            value={rating}
            values={{ ...record.values, problem_rating: rating }}
            error={getFieldErrors(error).problem_rating}
            disabled={busy || !record.canSave}
            onChange={setRating}
          />
        )}
        <ConsoleError error={error} retry={busy ? undefined : onReload} />
      </DialogContent>
      <DialogActions>
        <Button color="neutral" disabled={busy} onClick={() => onClose()}>
          {t('admin.actions.cancel')}
        </Button>
        <Button
          type="submit"
          variant="contained"
          loading={busy}
          disabled={
            !record.canSave || !field || field.readOnly || rating === record.values.problem_rating
          }
        >
          {t('admin.actions.save')}
        </Button>
      </DialogActions>
    </Stack>
  );
}
