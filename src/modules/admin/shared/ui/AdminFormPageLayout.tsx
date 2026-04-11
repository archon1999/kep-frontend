import { ReactNode } from 'react';
import { Box, Button, Stack } from '@mui/material';
import { Link } from 'react-router';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import PageHeader from 'shared/components/sections/common/PageHeader';

interface AdminFormPageLayoutProps {
  title: string;
  listPath: string;
  isSaving?: boolean;
  isEdit?: boolean;
  onSave: () => void;
  onDelete?: () => void;
  children: ReactNode;
}

const AdminFormPageLayout = ({
  title,
  listPath,
  isSaving,
  isEdit,
  onSave,
  onDelete,
  children,
}: AdminFormPageLayoutProps) => (
  <Stack direction="column" height={1} spacing={4}>
    <PageHeader
      title={title}
      breadcrumb={[
        { label: 'Admin', url: '/admin' },
        { label: title, active: true },
      ]}
      actionComponent={
        <Stack direction="row" spacing={1}>
          <Button component={Link} to={listPath} variant="soft" color="neutral">
            Cancel
          </Button>
          {isEdit && onDelete ? (
            <Button variant="soft" color="error" onClick={onDelete} startIcon={<IconifyIcon icon="mdi:delete" />}>
              Delete
            </Button>
          ) : null}
          <Button
            variant="contained"
            onClick={onSave}
            disabled={isSaving}
            startIcon={<IconifyIcon icon="material-symbols:save-rounded" />}
          >
            Save
          </Button>
        </Stack>
      }
    />
    <Box sx={{ flex: 1, px: { xs: 3, md: 5 }, pb: 4 }}>{children}</Box>
  </Stack>
);

export default AdminFormPageLayout;
