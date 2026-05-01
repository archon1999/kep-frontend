import { Badge, Box, Button, ButtonProps } from '@mui/material';
import IconifyIcon from '../base/IconifyIcon';

export type FilterButtonProps = ButtonProps & {
  label: string;
  badgeContent?: number;
};

const FilterButton = ({ label, badgeContent, sx, ...buttonProps }: FilterButtonProps) => {
  const badgeInvisible = badgeContent === undefined || badgeContent === 0;

  return (
    <Badge
      color="secondary"
      badgeContent={badgeContent}
      invisible={badgeInvisible}
      overlap="rectangular"
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{
        flexShrink: 0,
        '& .MuiBadge-badge': {
          top: 8,
          right: 8,
        },
      }}
    >
      <Button
        variant="soft"
        color="neutral"
        startIcon={<IconifyIcon icon="mdi:filter-variant" sx={{ fontSize: 20 }} />}
        sx={Array.isArray(sx) ? sx : [sx].filter(Boolean)}
        {...buttonProps}
      >
        <Box component="span">{label}</Box>
      </Button>
    </Badge>
  );
};

export default FilterButton;
