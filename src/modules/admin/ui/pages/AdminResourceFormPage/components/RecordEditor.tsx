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
  Tab,
  Tabs,
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
import PageHeader from 'shared/components/sections/common/PageHeader';
import ActionDialog from '../../../shared/components/ActionDialog';
import AuditList from '../../../shared/components/AuditList';
import ConsoleCell from '../../../shared/components/ConsoleCell';
import { ConsoleError, ConsoleSkeleton } from '../../../shared/components/ConsoleState';
import InlineEditor from '../../../shared/components/InlineEditor';
import PasswordDialog from '../../../shared/components/PasswordDialog';
import PublicationChecks from '../../../shared/components/PublicationChecks';
import SchemaField from '../../../shared/components/SchemaField';
import {
  actionTitle,
  errorData,
  fieldTitle,
  getFieldErrors,
  resourceTitle,
} from '../../../shared/helpers';

export default function RecordEditor({
  resourceKey,
  initial,
  reload,
}: {
  resourceKey: string;
  initial: AdminDetail;
  reload: () => void;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { data: registry = [] } = useAdminRegistry();
  const resource = registry.find((item) => item.key === resourceKey);
  const editor = useAdminRecordEditor(resourceKey, initial);
  const { record, values, dirty, saving, error } = editor;
  const path = resource?.path ?? `${resources.AdminManage}/${resourceKey.replace('.', '/')}`;
  const [language, setLanguage] = useState('uz');
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
  const fieldErrors = getFieldErrors(error);
  const translated = record.fields.some((field) => /_(uz|ru|en)$/.test(field.name));
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
      <Box component="form" onSubmit={submit} noValidate aria-busy={saving}>
        <PageHeader
          title={
            record.id
              ? record.label
              : t('admin.console.createRecord', { name: resourceTitle(t, resource) })
          }
          subtitle={record.id ? resourceTitle(t, resource) : undefined}
          backTo={path}
          backLabel={resourceTitle(t, resource)}
          actionComponent={
            <Stack direction="row" gap={1} flexWrap="wrap">
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
              {record.id && (record.actions ?? []).some((action) => action.kind !== 'delete') && (
                <Button
                  variant="outlined"
                  onClick={(event) => setActionAnchor(event.currentTarget)}
                  loading={preparing}
                  disabled={dirty || saving}
                  endIcon={<IconifyIcon icon="mdi:chevron-down" />}
                >
                  {t('admin.columns.actions')}
                </Button>
              )}
              {record.id && resourceKey === 'backend.user' && editable && (
                <Button
                  variant="outlined"
                  onClick={() => setPasswordOpen(true)}
                  disabled={dirty || saving}
                  startIcon={<IconifyIcon icon="mdi:lock-reset" />}
                >
                  {t('admin.actions.changePassword')}
                </Button>
              )}
              {record.id &&
                resource &&
                resource.editorPath !== resource.path &&
                currentUser?.isSuperuser && (
                  <Button
                    component={Link}
                    to={`${resource.editorPath}/${encodeURIComponent(record.id)}`}
                    color="neutral"
                    startIcon={<IconifyIcon icon="mdi:tune" />}
                  >
                    {t('admin.console.advancedTools')}
                  </Button>
                )}
              {record.id && (
                <Button
                  variant="outlined"
                  onClick={() => setHistoryOpen(true)}
                  startIcon={<IconifyIcon icon="mdi:history" />}
                >
                  {t('admin.console.history')}
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
            </Stack>
          }
        />
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
        {Object.keys(fieldErrors).some((name) => /_(uz|ru|en)$/.test(name)) && (
          <Alert severity="error" sx={{ mx: 3 }}>
            {t('admin.console.checkLanguages')}
          </Alert>
        )}
        {translated && (
          <Tabs
            value={language}
            onChange={(_, value) => setLanguage(value)}
            aria-label={t('admin.console.contentLanguage')}
            variant="scrollable"
            sx={{ px: { xs: 2, md: 3 }, borderBottom: 1, borderColor: 'divider' }}
          >
            {['uz', 'ru', 'en'].map((lang) => (
              <Tab
                key={lang}
                value={lang}
                label={
                  <Stack direction="row" gap={1}>
                    {t(`admin.console.languages.${lang}`)}
                    {Object.keys(fieldErrors).some((name) => name.endsWith('_' + lang)) && (
                      <IconifyIcon icon="mdi:alert-circle" sx={{ color: 'error.main' }} />
                    )}
                  </Stack>
                }
              />
            ))}
          </Tabs>
        )}
        <PublicationChecks checks={record.checks ?? []} />
        {record.sections.map((section, index) => {
          const fields = section.fields
            .map((name) => record.fields.find((field) => field.name === name))
            .filter(
              (field) =>
                field && (!/_(uz|ru|en)$/.test(field.name) || field.name.endsWith('_' + language)),
            );
          if (!fields.length) return null;
          return (
            <Box
              component="section"
              key={index}
              sx={{ p: { xs: 2, md: 3 }, borderBottom: 1, borderColor: 'divider' }}
            >
              {section.title && (
                <Typography component="h2" variant="h6" mb={2}>
                  {t(
                    `admin.console.sectionsNames.${section.title.toLowerCase().replace(/ /g, '_')}`,
                    { defaultValue: section.title },
                  )}
                </Typography>
              )}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                  gap: { xs: 2.5, md: 3 },
                }}
              >
                {fields.map(
                  (field) =>
                    field && (
                      <Box
                        key={field.name}
                        sx={{
                          minWidth: 0,
                          gridColumn: [
                            'richText',
                            'textarea',
                            'json',
                            'relations',
                            'file',
                            'image',
                          ].includes(field.kind)
                            ? '1 / -1'
                            : undefined,
                        }}
                      >
                        <SchemaField
                          resourceKey={resourceKey}
                          recordId={record.id ?? undefined}
                          field={field}
                          value={values[field.name]}
                          values={values}
                          selected={record.selectedOptions[field.name]}
                          error={fieldErrors[field.name]}
                          disabled={saving || !editable}
                          onChange={(value) => editor.setField(field.name, value)}
                          onUpload={(file) => editor.setFile(field.name, file)}
                        />
                      </Box>
                    ),
                )}
              </Box>
            </Box>
          );
        })}
        {Object.keys(record.readonly).length > 0 && (
          <Box
            component="section"
            sx={{ p: { xs: 2, md: 3 }, borderBottom: 1, borderColor: 'divider' }}
          >
            <Typography component="h2" variant="h6" mb={2}>
              {t('admin.console.recordInfo')}
            </Typography>
            <Box
              component="dl"
              sx={{
                m: 0,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                gap: 2,
              }}
            >
              {Object.entries(record.readonly).map(([name, cell]) => (
                <Box key={name}>
                  <Typography component="dt" variant="caption" color="text.secondary">
                    {fieldTitle(t, { name, label: name.replace(/_/g, ' ') })}
                  </Typography>
                  <Box component="dd" sx={{ m: 0, mt: 0.5 }}>
                    <ConsoleCell cell={cell} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
        {record.inlines.map((section) => (
          <InlineEditor
            key={section.prefix + record.revision}
            resourceKey={resourceKey}
            recordId={record.id ?? undefined}
            section={section}
            changes={editor.inlines[section.prefix] ?? {}}
            disabled={saving || !editable}
            errors={
              (errorData(error).inlines as Record<string, unknown> | undefined)?.[section.prefix]
            }
            onChange={(row) => editor.setInline(section.prefix, row)}
            onUpload={editor.setFile}
          />
        ))}
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
        {(record.actions ?? [])
          .filter((action) => action.kind !== 'delete')
          .map((action) => (
            <MenuItem
              key={action.name}
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
