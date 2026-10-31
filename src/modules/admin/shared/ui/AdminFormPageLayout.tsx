import { FormEvent, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Box, Button, DialogActions, Drawer, Stack, Typography } from '@mui/material';
import WorkspaceHeader from 'modules/admin/ui/shared/components/WorkspaceHeader';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import DialogHeader from 'shared/components/common/DialogHeader';
import FramedPage from 'shared/components/sections/common/FramedPage';
import { BackToListButtonProvider } from './BackToListButton';

interface AdminFormPageLayoutProps {
  title: string;
  listPath: string;
  isSaving?: boolean;
  isEdit?: boolean;
  onSave: () => void;
  onDelete?: () => void;
  sidebarTitle?: string;
  sidebar?: ReactNode;
  children: ReactNode;
}
const formId = 'adminFormPageForm';
export default function AdminFormPageLayout({
  title,
  listPath,
  isSaving,
  isEdit,
  onSave,
  onDelete,
  sidebarTitle,
  sidebar,
  children,
}: AdminFormPageLayoutProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSave();
  };
  return (
    <FramedPage>
      <BackToListButtonProvider listPath={listPath}>
        <Box component="form" id={formId} onSubmit={submit} aria-busy={isSaving}>
          <WorkspaceHeader
            title={title}
            backTo={listPath}
            backLabel={t('admin.actions.backToList')}
            children={
              <Button
                type="submit"
                variant="contained"
                loading={isSaving}
                startIcon={<IconifyIcon icon="mdi:content-save-outline" />}
              >
                {t('admin.actions.save')}
              </Button>
            }
          />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) 300px' },
              alignItems: 'start',
            }}
          >
            <Stack
              spacing={3}
              sx={{
                minWidth: 0,
                p: { xs: 2, md: 3 },
                '& .MuiInputBase-root:not(.MuiInputBase-multiline)': { minHeight: 48 },
              }}
            >
              {children}
            </Stack>
            {sidebar && (
              <Box
                component="aside"
                sx={{
                  p: 3,
                  minWidth: 0,
                  display: { xs: 'none', lg: 'block' },
                  borderLeft: 1,
                  borderColor: 'divider',
                }}
              >
                {sidebarTitle && (
                  <Typography component="h2" variant="h6" mb={2}>
                    {sidebarTitle}
                  </Typography>
                )}
                <Stack spacing={2.5}>{sidebar}</Stack>
              </Box>
            )}
          </Box>
          <Stack
            direction="row"
            gap={1.5}
            alignItems="center"
            flexWrap="wrap"
            sx={{
              position: 'sticky',
              bottom: 0,
              zIndex: 4,
              p: 2,
              bgcolor: 'background.default',
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            {isEdit && onDelete && (
              <Button color="error" onClick={onDelete} disabled={isSaving}>
                {t('admin.actions.delete')}
              </Button>
            )}
            {sidebar && (
              <Button
                sx={{ display: { lg: 'none' } }}
                variant="outlined"
                onClick={() => setOpen(true)}
                startIcon={<IconifyIcon icon="mdi:tune" />}
              >
                {sidebarTitle || t('admin.console.recordInfo')}
              </Button>
            )}
            <Box sx={{ flex: 1 }} />
            <Button component={Link} to={listPath} color="neutral" disabled={isSaving}>
              {t('admin.actions.cancel')}
            </Button>
            <Button type="submit" variant="contained" loading={isSaving}>
              {t('admin.actions.save')}
            </Button>
          </Stack>
        </Box>
        <Drawer
          anchor="right"
          open={open}
          onClose={() => setOpen(false)}
          slotProps={{
            paper: {
              sx: { width: 'min(420px, 100vw)' },
              role: 'dialog',
              'aria-modal': true,
              'aria-label': sidebarTitle || title,
            },
          }}
        >
          <DialogHeader
            id="admin-settings-title"
            title={sidebarTitle || t('admin.console.recordInfo')}
            onClose={() => setOpen(false)}
          />
          <Stack spacing={2.5} sx={{ p: 3, flex: 1, overflow: 'auto' }}>
            {sidebar}
          </Stack>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>{t('common.close')}</Button>
            <Button type="submit" form={formId} variant="contained" loading={isSaving}>
              {t('admin.actions.save')}
            </Button>
          </DialogActions>
        </Drawer>
      </BackToListButtonProvider>
    </FramedPage>
  );
}
