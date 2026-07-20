import { JSX, PropsWithChildren } from 'react';
import { Paper, Stack, SxProps, Typography } from '@mui/material';
import { useBreakpoints } from 'app/providers/BreakpointsProvider';
import { coreSurfacePaperClassName } from 'app/theme/styles/surfaceTreatments';
import PageBreadcrumb, { PageBreadcrumbItem } from './PageBreadcrumb';

interface PageHeaderProps {
  title: string;
  breadcrumb?: PageBreadcrumbItem[];
  actionComponent?: JSX.Element;
  sx?: SxProps;
  paperSx?: SxProps;
}

const PageHeader = ({
  title,
  breadcrumb,
  actionComponent,
  sx,
  paperSx,
}: PropsWithChildren<PageHeaderProps>) => {
  const { down } = useBreakpoints();
  const downLg = down('lg');

  return (
    <Paper
      className={coreSurfacePaperClassName}
      sx={[
        { px: { xs: 3, md: 5 }, py: 3 },
        ...(Array.isArray(paperSx) ? paperSx : [paperSx]),
      ]}
    >
      <Stack
        sx={{
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { sm: 'flex-end' },
          justifyContent: 'space-between',
          ...sx,
        }}
      >
        <div>
          {breadcrumb?.length ? <PageBreadcrumb items={breadcrumb} sx={{ mb: 1 }} /> : null}
          <Typography
            component="h1"
            variant="h4"
            sx={[{ fontWeight: 500 }, downLg && { fontSize: 'h5.fontSize' }]}
          >
            {title}
          </Typography>
        </div>

        {actionComponent}
      </Stack>
    </Paper>
  );
};

export default PageHeader;
