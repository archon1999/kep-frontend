import { ChangeEvent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Stack } from '@mui/material';
import { Link } from 'react-router';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import {
  DEFAULT_FILTER_DRAWER_WIDTH,
  FilterDrawerLayout,
} from 'shared/components/common/FilterDrawer';
import PageHeader from 'shared/components/sections/common/PageHeader';
import AdminFiltersToolbar from './AdminFiltersToolbar';

interface AdminListPageLayoutProps {
  title: string;
  createPath: string;
  createLabel?: string;
  search: string;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  toolbar?: ReactNode;
  filterDrawer?: ReactNode;
  filterDrawerOpen?: boolean;
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
    <Stack direction="column" height={1} spacing={4}>
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
      <Box sx={{ flex: 1, px: { xs: 3, md: 5 }, pb: 4 }}>
        <Stack spacing={2}>
          {children}
        </Stack>
      </Box>
    </Stack>
  );

  if (!filterDrawer) {
    return content;
  }

  return (
    <FilterDrawerLayout
      open={filterDrawerOpen}
      drawerWidth={filterDrawerWidth}
      drawer={filterDrawer}
    >
      {content}
    </FilterDrawerLayout>
  );
};

export default AdminListPageLayout;
