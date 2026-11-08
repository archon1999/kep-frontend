import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import { executeAdminAction } from 'modules/admin/application';
import type { AdminActionPreview } from 'modules/admin/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import DialogHeader from 'shared/components/common/DialogHeader';
import { toast } from 'sonner';
import { actionTitle, rowActionTitle } from '../helpers';
import { actionIcon } from '../helpers/actionIcon';
import { ConsoleError } from './ConsoleState';

export default function ActionDialog({
  resourceKey,
  preview,
  onClose,
  onComplete,
}: {
  resourceKey: string;
  preview: AdminActionPreview | null;
  onClose: () => void;
  onComplete: () => void;
}) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [message, setMessage] = useState('');
  const isNotification = preview?.action.kind === 'notification';
  const close = () => {
    if (!busy) {
      setError(null);
      setMessage('');
      onClose();
    }
  };
  const execute = async () => {
    if (!preview) return;
    setBusy(true);
    setError(null);
    try {
      await executeAdminAction(
        resourceKey,
        preview.token,
        isNotification ? { message } : undefined,
      );
      toast.success(t('admin.workspace.actionCompleted'));
      setMessage('');
      onComplete();
      onClose();
    } catch (failure) {
      setError(failure);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Dialog
      open={Boolean(preview)}
      onClose={close}
      maxWidth="sm"
      fullWidth
      aria-labelledby="admin-action-title"
    >
      <DialogHeader
        id="admin-action-title"
        title={
          preview
            ? (preview.count === 1 ? rowActionTitle : actionTitle)(
                t,
                preview.action.name,
                preview.action.label,
              )
            : ''
        }
        onClose={close}
        closeDisabled={busy}
      />
      <DialogContent>
        {preview && (
          <>
            <Alert severity={preview.action.dangerous ? 'warning' : 'info'} sx={{ mb: 2 }}>
              {t(
                isNotification
                  ? 'admin.workspace.notificationRecipients'
                  : preview.action.kind === 'delete'
                    ? 'admin.console.deleteImpact'
                    : 'admin.console.actionImpact',
                { count: isNotification ? preview.recipients : preview.count },
              )}
            </Alert>
            <List dense disablePadding sx={{ maxHeight: 260, overflow: 'auto' }}>
              {preview.records.map((row) => (
                <ListItem key={row.id} disableGutters>
                  <Typography variant="body2">{row.label}</Typography>
                </ListItem>
              ))}
            </List>
            {isNotification && (
              <TextField
                label={t('admin.workspace.notificationMessage')}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                multiline
                minRows={4}
                fullWidth
                required
                autoFocus
                disabled={busy}
                slotProps={{ htmlInput: { maxLength: 4000 } }}
                sx={{ mt: 2 }}
              />
            )}
            {preview.impact.length > 0 && (
              <Box sx={{ mt: 2, borderTop: 1, borderColor: 'divider', pt: 2 }}>
                {preview.impact.map((item) => (
                  <Typography key={item.name} variant="body2">
                    {item.name}: <strong>{item.count}</strong>
                  </Typography>
                ))}
              </Box>
            )}
          </>
        )}
        <ConsoleError error={error} />
      </DialogContent>
      <DialogActions>
        <Button onClick={close} disabled={busy} color="neutral">
          {t('admin.actions.cancel')}
        </Button>
        <Button
          variant="contained"
          color={preview?.action.dangerous ? 'error' : 'primary'}
          loading={busy}
          disabled={isNotification && !message.trim()}
          startIcon={preview ? <IconifyIcon icon={actionIcon(preview.action)} /> : undefined}
          onClick={execute}
        >
          {t('admin.console.confirmAction')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
