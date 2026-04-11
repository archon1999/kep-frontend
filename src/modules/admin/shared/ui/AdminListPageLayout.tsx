import { ChangeEvent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, InputAdornment, Stack } from '@mui/material';
import { Link } from 'react-router';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import PageHeader from 'shared/components/sections/common/PageHeader';
import StyledTextField from 'shared/components/styled/StyledTextField';

interface AdminListPageLayoutProps {
  title: string;
  createPath: string;
  search: string;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  toolbar?: ReactNode;
  children: ReactNode;
}

const AdminListPageLayout = ({
  title,
  createPath,
  search,
  onSearchChange,
  searchPlaceholder,
  filters,
  toolbar,
  children,
}: AdminListPageLayoutProps) => {
  const { t } = useTranslation();

  return (
    <Stack direction="column" height={1} spacing={4}>
      <PageHeader
        title={title}
        breadcrumb={[
          { label: t('admin.title'), url: '/admin' },
          { label: title, active: true },
        ]}
        actionComponent={
          <Button component={Link} to={createPath} variant="contained" startIcon={<IconifyIcon icon="mdi:plus" />}>
            {t('admin.actions.create')}
          </Button>
        }
      />
      <Box sx={{ flex: 1, px: { xs: 3, md: 5 }, pb: 4 }}>
        <Stack spacing={2}>
          {toolbar ?? (
            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} alignItems={{ lg: 'center' }}>
              <StyledTextField
                id={`${title.toLowerCase().replace(/\s+/g, '-')}-search`}
                type="search"
                value={search}
                onChange={onSearchChange}
                placeholder={searchPlaceholder ?? t('admin.searchPlaceholder')}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconifyIcon icon="material-symbols:search-rounded" fontSize={20} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  minWidth: { sm: 280 },
                  maxWidth: { sm: 320 },
                }}
              />
              {filters}
            </Stack>
          )}
          {children}
        </Stack>
      </Box>
    </Stack>
  );
};

export default AdminListPageLayout;
