import { ChangeEvent, ReactNode } from 'react';
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
  children: ReactNode;
}

const AdminListPageLayout = ({
  title,
  createPath,
  search,
  onSearchChange,
  children,
}: AdminListPageLayoutProps) => (
  <Stack direction="column" height={1} spacing={4}>
    <PageHeader
      title={title}
      breadcrumb={[
        { label: 'Admin', url: '/admin' },
        { label: title, active: true },
      ]}
      actionComponent={
        <Button component={Link} to={createPath} variant="contained" startIcon={<IconifyIcon icon="mdi:plus" />}>
          Create
        </Button>
      }
    />
    <Box sx={{ flex: 1, px: { xs: 3, md: 5 }, pb: 4 }}>
      <Stack spacing={2}>
        <StyledTextField
          id={`${title.toLowerCase().replace(/\s+/g, '-')}-search`}
          type="search"
          value={search}
          onChange={onSearchChange}
          placeholder={`Search ${title.toLowerCase()}`}
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
            maxWidth: { sm: 320 },
          }}
        />
        {children}
      </Stack>
    </Box>
  </Stack>
);

export default AdminListPageLayout;
