import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useBeforeUnload, useBlocker, useNavigate } from 'react-router';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { resources } from 'app/routes/resources';
import { previewAdminAction, useAdminHistory, useAdminRegistry } from 'modules/admin/application';
import { useAdminRecordEditor } from 'modules/admin/application/useAdminRecordEditor';
import type { AdminActionPreview, AdminDetail } from 'modules/admin/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import DialogHeader from 'shared/components/common/DialogHeader';
import FramedPage from 'shared/components/sections/common/FramedPage';
import ActionDialog from '../../../shared/components/ActionDialog';
import AuditList from '../../../shared/components/AuditList';
import { ConsoleError, ConsoleSkeleton } from '../../../shared/components/ConsoleState';
import PasswordDialog from '../../../shared/components/PasswordDialog';
import WorkspaceHeader from '../../../shared/components/WorkspaceHeader';
import { actionTitle, resourceTitle } from '../../../shared/helpers';
import EditorWorkspace from './EditorWorkspace';

export default function RecordEditor({
  resourceKey,
  initial,
  reload,
  metadataError,
  retryMetadata,
}: {
  resourceKey: string;
  initial: AdminDetail;
  reload: () => void;
  metadataError?: unknown;
  retryMetadata: () => void;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { data: registry = [] } = useAdminRegistry();
  const resource = registry.find((item) => item.key === resourceKey);
  const editor = useAdminRecordEditor(resourceKey, initial);
  const { record, dirty, saving, error } = editor;
  const path = resource?.path ?? `${resources.AdminManage}/${resourceKey.replace('.', '/')}`;
  const [preview, setPreview] = useState<AdminActionPreview | null>(null);
  const [actionError, setActionError] = useState<unknown>(null);
  const [preparing, setPreparing] = useState(false);
  const [actionAnchor, setActionAnchor] = useState<HTMLElement | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [leavingAfterSave, setLeavingAfterSave] = useState(false);
  const blocker = useBlocker(dirty && !saving && !leavingAfterSave);
  useBeforeUnload((event) => {
    if (dirty) {
      event.preventDefault();
      event.returnValue = '';
    }
  });
  const history = useAdminHistory(resourceKey, record.id ?? undefined, historyOpen);
  const save = async (close = false) => {
    const result = await editor.save();
    if (!result) {
      const invalid = document.querySelector<HTMLElement>('[aria-invalid="true"]');
      invalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      invalid?.focus();
      return;
    }
    setSaved(true);
    if (close) {
      setLeavingAfterSave(true);
      navigate(path);
    } else if (!initial.id && result.id) {
      setLeavingAfterSave(true);
      navigate(`${path}/${encodeURIComponent(result.id)}`, { replace: true });
    }
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    void save();
  };
  const prepareAction = async (action: string) => {
    if (!record.id) return;
    setPreparing(true);
    setActionError(null);
    try {
      setPreview(await previewAdminAction(resourceKey, action, [record.id]));
    } catch (failure) {
      setActionError(failure);
    } finally {
      setPreparing(false);
    }
  };
  const editable = record.canSave;
  return (
    <FramedPage>
      <ConsoleError error={metadataError} retry={retryMetadata} />
      <Box
        component="form"
        onSubmit={submit}
        noValidate
        aria-busy={saving}
        onKeyDown={(event) => {
          if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
            event.preventDefault();
            if (editable && !saving && (dirty || !record.id)) void save();
          }
        }}
      >
        <WorkspaceHeader
          title={
            record.id
              ? record.label
              : t('admin.console.createRecord', { name: resourceTitle(t, resource) })
          }
          subtitle={
            <Stack direction="row" alignItems="center" gap={1}>
              <span>{resourceTitle(t, resource)}</span>
              <Typography variant="caption" color={dirty ? 'warning.main' : 'text.secondary'}>
                {dirty
                  ? t('admin.console.unsaved')
                  : record.id
                    ? '#' + (record.id.startsWith('gAAAA') ? '����' : record.id)
                    : t('admin.workspace.newRecord')}
              </Typography>
            </Stack>
          }
          backTo={path}
          backLabel={t('admin.actions.backToList')}
        >
          {record.publicPath && (
            <Button
              component={Link}
              to={record.publicPath}
              target="_blank"
              rel="noopener noreferrer"
              color="neutral"
              startIcon={<IconifyIcon icon="mdi:open-in-new" />}
            >
              {t('admin.console.viewOnSite')}
            </Button>
          )}
          {record.id && (
            <Button
              color="neutral"
              onClick={(event) => setActionAnchor(event.currentTarget)}
              loading={preparing}
              endIcon={<IconifyIcon icon="mdi:dots-horizontal" />}
            >
              {t('admin.columns.actions')}
            </Button>
          )}
          {editable && (
            <Button
              type="submit"
              variant="contained"
              loading={saving}
              disabled={!dirty && Boolean(record.id)}
              startIcon={<IconifyIcon icon="mdi:content-save-outline" />}
            >
              {t('admin.actions.save')}
            </Button>
          )}
        </WorkspaceHeader>
        {saved && !dirty && (
          <Alert severity="success" sx={{ m: 2 }} onClose={() => setSaved(false)}>
            {t('admin.console.saved')}
          </Alert>
        )}
        {!editable && (
          <Alert severity="info" sx={{ m: 2 }}>
            {t('admin.console.readOnly')}
          </Alert>
        )}
        <ConsoleError error={error || actionError} />
        {Number((error as { status?: number } | null)?.status) === 409 && (
          <Button onClick={reload} sx={{ mx: 3 }}>
            {t('admin.console.reloadRecord')}
          </Button>
        )}
        <EditorWorkspace resourceKey={resourceKey} editor={editor} />
        <Stack
          direction="row"
          alignItems="center"
          gap={1.5}
          flexWrap="wrap"
          sx={{
            p: { xs: 2, md: 2.5 },
            position: 'sticky',
            bottom: 0,
            zIndex: 4,
            bgcolor: 'background.default',
            borderTop: 1,
            borderColor: 'divider',
            boxShadow: '0 -6px 20px rgb(0 0 0 / 4%)',
          }}
        >
          {record.id && record.permissions.delete && (
            <Button
              color="error"
              loading={preparing}
              disabled={saving}
              onClick={() => void prepareAction('delete_selected')}
              startIcon={<IconifyIcon icon="mdi:delete-outline" />}
            >
              {t('admin.actions.delete')}
            </Button>
          )}
          <Box sx={{ flex: 1 }} />
          {dirty && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              {t('admin.console.unsaved')}
            </Typography>
          )}
          <Button component={Link} to={path} color="neutral" disabled={saving}>
            {t('admin.actions.cancel')}
          </Button>
          {editable && (
            <>
              <Button variant="outlined" onClick={() => void save(true)} disabled={saving}>
                {t('admin.console.saveAndClose')}
              </Button>
              <Button
                type="submit"
                variant="contained"
                loading={saving}
                disabled={!dirty && Boolean(record.id)}
              >
                {t('admin.actions.save')}
              </Button>
            </>
          )}
        </Stack>
      </Box>
      <Dialog
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        fullWidth
        maxWidth="sm"
        aria-labelledby="admin-history-title"
      >
        <DialogHeader
          id="admin-history-title"
          title={t('admin.console.history')}
          onClose={() => setHistoryOpen(false)}
        />
        <DialogContent>
          <ConsoleError error={history.error} />
          {history.isLoading ? <ConsoleSkeleton /> : <AuditList entries={history.data ?? []} />}
        </DialogContent>
      </Dialog>
      <Dialog
        open={blocker.state === 'blocked'}
        onClose={() => blocker.reset?.()}
        fullWidth
        maxWidth="xs"
        aria-labelledby="admin-unsaved-title"
      >
        <DialogHeader id="admin-unsaved-title" title={t('admin.console.unsaved')} />
        <DialogContent>{t('admin.console.leaveWarning')}</DialogContent>
        <DialogActions>
          <Button onClick={() => blocker.reset?.()}>{t('admin.console.keepEditing')}</Button>
          <Button color="error" onClick={() => blocker.proceed?.()}>
            {t('admin.console.discard')}
          </Button>
        </DialogActions>
      </Dialog>
      <Menu
        anchorEl={actionAnchor}
        open={Boolean(actionAnchor)}
        onClose={() => setActionAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            setActionAnchor(null);
            setHistoryOpen(true);
          }}
        >
          <IconifyIcon icon="mdi:history" sx={{ mr: 1.5 }} />
          {t('admin.console.history')}
        </MenuItem>
        {resourceKey === 'backend.user' && editable && (
          <MenuItem
            disabled={dirty || saving}
            onClick={() => {
              setActionAnchor(null);
              setPasswordOpen(true);
            }}
          >
            <IconifyIcon icon="mdi:lock-reset" sx={{ mr: 1.5 }} />
            {t('admin.actions.changePassword')}
          </MenuItem>
        )}
        {resource && resource.editorPath !== resource.path && currentUser?.isSuperuser && (
          <MenuItem
            component={Link}
            to={`${resource.editorPath}/${encodeURIComponent(record.id ?? '')}`}
          >
            <IconifyIcon icon="mdi:tune" sx={{ mr: 1.5 }} />
            {t('admin.console.advancedTools')}
          </MenuItem>
        )}
        {(record.actions ?? [])
          .filter((action) => action.kind !== 'delete')
          .map((action) => (
            <MenuItem
              key={action.name}
              disabled={dirty || saving}
              onClick={() => {
                setActionAnchor(null);
                void prepareAction(action.name);
              }}
            >
              {actionTitle(t, action.name, action.label)}
            </MenuItem>
          ))}
      </Menu>
      <ActionDialog
        resourceKey={resourceKey}
        preview={preview}
        onClose={() => setPreview(null)}
        onComplete={() => {
          if (preview?.action.kind === 'delete') {
            setLeavingAfterSave(true);
            navigate(path);
          } else {
            reload();
            setSaved(true);
          }
        }}
      />
      {record.id && resourceKey === 'backend.user' && (
        <PasswordDialog
          id={record.id}
          open={passwordOpen}
          onClose={(changed) => {
            setPasswordOpen(false);
            if (changed) reload();
          }}
        />
      )}
    </FramedPage>
  );
}
