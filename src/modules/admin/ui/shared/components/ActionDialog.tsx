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
  Typography,
} from '@mui/material';
import { executeAdminAction } from 'modules/admin/application';
import type { AdminActionPreview } from 'modules/admin/domain';
import DialogHeader from 'shared/components/common/DialogHeader';
import { actionTitle } from '../helpers';
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
  const close = () => {
    if (!busy) {
      setError(null);
      onClose();
    }
  };
  const execute = async () => {
    if (!preview) return;
    setBusy(true);
    setError(null);
    try {
      await executeAdminAction(resourceKey, preview.token);
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
        title={preview ? actionTitle(t, preview.action.name, preview.action.label) : ''}
        onClose={close}
        closeDisabled={busy}
      />
      <DialogContent>
        {preview && (
          <>
            <Alert severity={preview.action.dangerous ? 'warning' : 'info'} sx={{ mb: 2 }}>
              {t(
                preview.action.kind === 'delete'
                  ? 'admin.console.deleteImpact'
                  : 'admin.console.actionImpact',
                { count: preview.count },
              )}
            </Alert>
            <List dense disablePadding sx={{ maxHeight: 260, overflow: 'auto' }}>
              {preview.records.map((row) => (
                <ListItem key={row.id} disableGutters>
                  <Typography variant="body2">{row.label}</Typography>
                </ListItem>
              ))}
            </List>
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
          onClick={execute}
        >
          {t('admin.console.confirmAction')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
