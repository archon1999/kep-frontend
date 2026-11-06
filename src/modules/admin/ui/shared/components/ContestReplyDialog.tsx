import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material';
import { saveAdminRecord, useAdminDetail } from 'modules/admin/application';
import type { AdminDetail } from 'modules/admin/domain';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import DialogHeader from 'shared/components/common/DialogHeader';
import { toast } from 'sonner';
import { getFieldErrors } from '../helpers';
import { ConsoleError, ConsoleSkeleton } from './ConsoleState';
import SchemaField from './SchemaField';

const resourceKey = 'contests.contestquestion';

export default function ContestReplyDialog({
  id,
  onClose,
}: {
  id: string;
  onClose: (changed?: boolean) => void;
}) {
  const { t } = useTranslation();
  const { data, error, isLoading, mutate } = useAdminDetail(resourceKey, id);
  const [busy, setBusy] = useState(false);
  const close = () => {
    if (!busy) onClose();
  };
  return (
    <Dialog open fullWidth maxWidth="md" aria-labelledby="admin-reply-title" onClose={close}>
      <DialogHeader
        id="admin-reply-title"
        title={t('admin.workspace.reply')}
        onClose={close}
        closeDisabled={busy}
      />
      <ConsoleError error={error} retry={() => void mutate()} />
      {isLoading ? (
        <ConsoleSkeleton kind="form" />
      ) : data && data.id === id && !error ? (
        <ReplyForm
          key={data.revision}
          record={data}
          onClose={onClose}
          busy={busy}
          setBusy={setBusy}
        />
      ) : (
        <DialogActions>
          <Button onClick={() => onClose()}>{t('common.close')}</Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

function ReplyForm({
  record,
  onClose,
  busy,
  setBusy,
}: {
  record: AdminDetail;
  onClose: (changed?: boolean) => void;
  busy: boolean;
  setBusy: (busy: boolean) => void;
}) {
  const { t } = useTranslation();
  const [answer, setAnswer] = useState<unknown>(record.values.answer ?? '');
  const [error, setError] = useState<unknown>(null);
  const field = record.fields.find((item) => item.name === 'answer');
  const username = record.selectedOptions.user?.[0]?.label;
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!record.id) return;
    setBusy(true);
    setError(null);
    try {
      await saveAdminRecord(resourceKey, record.id, {
        revision: record.revision,
        values: { answer, status: 2 },
      });
      toast.success(t('admin.workspace.replySent'));
      onClose(true);
    } catch (failure) {
      setError(failure);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Stack component="form" onSubmit={submit} sx={{ minHeight: 0 }}>
      <DialogContent>
        <Stack gap={2}>
          <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
            {username && (
              <UserPopover username={username}>
                <Typography variant="body2" fontWeight={600} sx={{ cursor: 'pointer' }}>
                  {username}
                </Typography>
              </UserPopover>
            )}
            <Typography variant="body2" color="text.secondary">
              {record.selectedOptions.contest?.[0]?.label}
            </Typography>
          </Stack>
          <Typography
            sx={{
              whiteSpace: 'pre-wrap',
              overflowWrap: 'anywhere',
              p: 2,
              bgcolor: 'action.hover',
              borderRadius: 1,
            }}
          >
            {String(record.values.question ?? '')}
          </Typography>
          {field && (
            <SchemaField
              resourceKey={resourceKey}
              recordId={record.id!}
              field={field}
              value={answer}
              values={{ ...record.values, answer }}
              disabled={busy || !record.canSave}
              error={getFieldErrors(error).answer}
              onChange={setAnswer}
            />
          )}
          <Alert severity="info" icon={<IconifyIcon icon="mdi:bell-check-outline" />}>
            {t('admin.workspace.replyNotification')}
          </Alert>
          <ConsoleError error={error} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()} disabled={busy} color="neutral">
          {t('admin.actions.cancel')}
        </Button>
        <Button
          type="submit"
          loading={busy}
          variant="contained"
          disabled={!record.canSave || !field}
          startIcon={<IconifyIcon icon="mdi:send-outline" />}
        >
          {t('admin.workspace.sendReply')}
        </Button>
      </DialogActions>
    </Stack>
  );
}
