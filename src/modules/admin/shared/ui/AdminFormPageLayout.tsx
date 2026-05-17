import { FormEvent, ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  Paper,
  Stack,
  Typography,
  drawerClasses,
} from '@mui/material';
import { useNavContext } from 'app/layouts/main-layout/NavProvider';
import { useBreakpoints } from 'app/providers/BreakpointsProvider';
import { Link } from 'react-router';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import SimpleBar from 'shared/components/base/SimpleBar';
import BackToListButton, { BackToListButtonProvider } from './BackToListButton';

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

interface AdminFormAsideProps {
  title?: string;
  listPath: string;
  isSaving?: boolean;
  isEdit?: boolean;
  onDelete?: () => void;
  handleClose?: () => void;
  children?: ReactNode;
}

const formId = 'adminFormPageForm';

const AdminFormAside = ({
  title,
  listPath,
  isSaving,
  isEdit,
  onDelete,
  handleClose,
  children,
}: AdminFormAsideProps) => {
  const { t } = useTranslation();
  const { topbarHeight } = useNavContext();

  return (
    <Paper
      background={1}
      sx={(theme) => ({
        position: 'sticky',
        top: { xs: 0, md: topbarHeight.md },
        width: { md: 336, lg: 404 },
        height: { xs: 1, md: theme.mixins.contentHeight(topbarHeight).md },
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      })}
    >
      <SimpleBar sx={{ flex: 1, maxHeight: 1, overflowY: 'auto' }}>
        <Stack direction="column" divider={<Divider flexItem orientation="horizontal" />}>
          <Box sx={{ p: { xs: 3, md: 5 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
              {title ? <Typography variant="h6">{title}</Typography> : <span />}
              {handleClose ? (
                <Button shape="circle" variant="soft" color="neutral" onClick={handleClose}>
                  <IconifyIcon icon="material-symbols:close-rounded" sx={{ fontSize: 20 }} />
                </Button>
              ) : null}
            </Stack>

            <Stack direction="column" spacing={3}>
              {children}
            </Stack>
          </Box>
        </Stack>
      </SimpleBar>

      <Stack
        direction="row"
        sx={{
          p: { xs: 3, lg: 5 },
          gap: 1,
          flexWrap: 'wrap',
          position: 'sticky',
          bottom: 0,
          bgcolor: 'background.elevation1',
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Button component={Link} to={listPath} variant="soft" color="neutral" sx={{ flexGrow: 1 }}>
          {t('admin.actions.cancel')}
        </Button>
        <Button
          form={formId}
          type="submit"
          variant="contained"
          disabled={isSaving}
          sx={{ flexGrow: 1 }}
          startIcon={<IconifyIcon icon="material-symbols:save-rounded" />}
        >
          {t('admin.actions.save')}
        </Button>
        {isEdit && onDelete ? (
          <Button
            variant="soft"
            color="error"
            onClick={onDelete}
            sx={{ flexGrow: 1 }}
            startIcon={<IconifyIcon icon="mdi:delete" />}
          >
            {t('admin.actions.delete')}
          </Button>
        ) : null}
      </Stack>
    </Paper>
  );
};

const AdminFormPageLayout = ({
  title,
  listPath,
  isSaving,
  isEdit,
  onSave,
  onDelete,
  sidebarTitle,
  sidebar,
  children,
}: AdminFormPageLayoutProps) => {
  const { t } = useTranslation();
  const { up } = useBreakpoints();
  const [isAsideOpen, setIsAsideOpen] = useState(false);
  const upMd = up('md');

  useEffect(() => {
    const scrollMainToTop = () => {
      const main = document.querySelector('main');
      if (main) {
        main.scrollTop = 0;
      }
    };

    const frame = window.requestAnimationFrame(scrollMainToTop);
    const timeouts = [0, 150, 500, 1000].map((timeout) => window.setTimeout(scrollMainToTop, timeout));

    return () => {
      window.cancelAnimationFrame(frame);
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, [title]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave();
  };

  return (
    <BackToListButtonProvider listPath={listPath}>
      <Stack
        component="form"
        id={formId}
        direction="row"
        onSubmit={handleSubmit}
        sx={{
          alignItems: 'stretch',
          minHeight: 1,
          '& .MuiInputBase-root:not(.MuiInputBase-multiline)': {
            minHeight: 48,
          },
          '& .MuiFormControlLabel-root': {
            mx: 0,
            gap: 1,
            minHeight: 40,
            alignItems: 'center',
          },
          '& .MuiFormControlLabel-root .MuiSwitch-root, & .MuiFormControlLabel-root .MuiRadio-root, & .MuiFormControlLabel-root .MuiCheckbox-root': {
            ml: 0,
          },
        }}
      >
        <Paper sx={{ p: { xs: 3, md: 5 }, flex: 1, minWidth: 0 }}>
          <Box sx={{ mb: 3 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ sm: 'center' }}
              justifyContent="space-between"
              gap={2}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  overflowWrap: 'anywhere',
                }}
              >
                {title}
              </Typography>
              <BackToListButton />
            </Stack>
          </Box>

          <Container maxWidth={false} sx={{ px: { xs: 0 } }}>
            <Stack direction="column" sx={{ rowGap: 4, mb: 4 }}>
              {children}
            </Stack>
          </Container>
        </Paper>

        {upMd ? (
          <AdminFormAside
            title={sidebarTitle}
            listPath={listPath}
            isSaving={isSaving}
            isEdit={isEdit}
            onDelete={onDelete}
          >
            {sidebar}
          </AdminFormAside>
        ) : (
          <Drawer
            anchor="right"
            variant="temporary"
            open={isAsideOpen}
            onClose={() => setIsAsideOpen(false)}
            sx={{
              [`& .${drawerClasses.paper}`]: { width: 1, maxWidth: 404 },
            }}
          >
            <AdminFormAside
              title={sidebarTitle}
              listPath={listPath}
              isSaving={isSaving}
              isEdit={isEdit}
              onDelete={onDelete}
              handleClose={() => setIsAsideOpen(false)}
            >
              {sidebar}
            </AdminFormAside>
          </Drawer>
        )}
      </Stack>

      {!upMd && (
        <Box sx={{ position: 'sticky', zIndex: 999, width: 1, bottom: 0 }}>
          <Paper
            component={Stack}
            direction="row"
            sx={(theme) => ({
              px: { xs: 3, md: 5 },
              bgcolor: 'background.menu',
              height: theme.mixins.footer.sm,
            })}
          >
            <Stack direction="row" flex={1} gap={1} alignItems="center" justifyContent="space-between">
              <Stack direction="row" gap={0.5} alignItems="center">
                <IconifyIcon
                  icon="material-symbols:info-outline-rounded"
                  color="info.main"
                  fontSize={18}
                />
                <Typography variant="subtitle2" color="info.main" fontWeight={400}>
                  {sidebarTitle}
                </Typography>
              </Stack>

              <Button
                type="button"
                variant="soft"
                color="neutral"
                onClick={() => setIsAsideOpen(true)}
                endIcon={<IconifyIcon icon="material-symbols:chevron-right-rounded" />}
              >
                {t('admin.actions.edit')}
              </Button>
            </Stack>
          </Paper>
        </Box>
      )}
    </BackToListButtonProvider>
  );
};

export default AdminFormPageLayout;
