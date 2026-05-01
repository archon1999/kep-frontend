import { Breadcrumbs, Link as MUILink, SxProps, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { kebabCase } from 'shared/lib/utils';

export interface PageBreadcrumbItem {
  label: string;
  url?: string;
  active?: boolean;
}

interface PageBreadcrumbProps {
  items: PageBreadcrumbItem[];
  sx?: SxProps;
}

const PageBreadcrumb = ({ items, sx }: PageBreadcrumbProps) => {
  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ ...sx }}>
      {items.map(({ label, url, active }) => (
        <Typography
          key={kebabCase(label)}
          variant="body2"
          aria-current={active ? 'page' : undefined}
          component={active ? 'span' : MUILink}
          {...(!active && {
            component: RouterLink,
            to: url,
            underline: 'hover',
          })}
          sx={{
            color: active ? 'text.primary' : 'primary.main',
            fontWeight: 'medium',
          }}
        >
          {label}
        </Typography>
      ))}
    </Breadcrumbs>
  );
};

export default PageBreadcrumb;
