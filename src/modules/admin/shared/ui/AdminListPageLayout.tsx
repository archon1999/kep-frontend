import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Box, Button, Stack } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import {
  DEFAULT_FILTER_DRAWER_WIDTH,
  FilterDrawerLayout,
} from 'shared/components/common/FilterDrawer';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';
import AdminFiltersToolbar from './AdminFiltersToolbar';

interface AdminListPageLayoutProps {
  title: string;
  createPath: string;
  createLabel?: string;
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  toolbar?: ReactNode;
  filterDrawer?: ReactNode;
  filterDrawerOpen?: boolean;
  filterAnchorEl?: HTMLElement | null;
  filterDrawerWidth?: number;
  children: ReactNode;
}

const AdminListPageLayout = ({
  title,
  createPath,
  createLabel,
  search,
  onSearchChange,
  searchPlaceholder,
  filters,
  toolbar,
  filterDrawer,
  filterDrawerOpen = false,
  filterAnchorEl,
  filterDrawerWidth = DEFAULT_FILTER_DRAWER_WIDTH,
  children,
}: AdminListPageLayoutProps) => {
  const { t } = useTranslation();
  const resolvedToolbar = toolbar ?? (
    <AdminFiltersToolbar
      id={`${title.toLowerCase().replace(/\s+/g, '-')}-toolbar`}
      search={search}
      onSearchChange={onSearchChange}
      searchPlaceholder={searchPlaceholder ?? t('admin.searchPlaceholder')}
      filters={filters}
    />
  );

  const content = (
    <Stack direction="column" spacing={0}>
      <PageHeader
        title={title}
        actionComponent={
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1.25}
            alignItems={{ md: 'flex-start' }}
            sx={{ width: { xs: 1, sm: 'auto' } }}
          >
            {resolvedToolbar}
            <Button
              component={Link}
              to={createPath}
              variant="contained"
              startIcon={<IconifyIcon icon="mdi:plus" />}
              sx={{ flexShrink: 0 }}
            >
              {createLabel ?? t('admin.actions.create')}
            </Button>
          </Stack>
        }
      />
      <Box sx={{ flex: 1, minWidth: 0, '& .MuiDataGrid-root': { border: 0, borderRadius: 0 } }}>
        <Stack spacing={2}>{children}</Stack>
      </Box>
    </Stack>
  );

  if (!filterDrawer) {
    return <FramedPage>{content}</FramedPage>;
  }

  return (
    <FilterDrawerLayout
      anchorEl={filterAnchorEl}
      open={filterDrawerOpen}
      drawerWidth={filterDrawerWidth}
      drawer={filterDrawer}
    >
      {content}
    </FilterDrawerLayout>
  );
};

export default AdminListPageLayout;
