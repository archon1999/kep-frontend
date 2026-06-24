import { Badge, Box, Button, ButtonProps, SxProps, Theme } from '@mui/material';
import IconifyIcon from '../base/IconifyIcon';

export type FilterButtonProps = ButtonProps & {
  label: string;
  badgeContent?: number;
  containerSx?: SxProps<Theme>;
};

const FilterButton = ({
  label,
  badgeContent,
  containerSx,
  sx,
  ...buttonProps
}: FilterButtonProps) => {
  const badgeInvisible = badgeContent === undefined || badgeContent === 0;

  return (
    <Badge
      color="secondary"
      badgeContent={badgeContent}
      invisible={badgeInvisible}
      overlap="rectangular"
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={[
        {
          display: 'inline-flex',
          flexShrink: 0,
          '& .MuiBadge-badge': {
            top: 8,
            right: 8,
          },
        },
        ...(Array.isArray(containerSx) ? containerSx : [containerSx].filter(Boolean)),
      ]}
    >
      <Button
        variant="soft"
        color="neutral"
        startIcon={<IconifyIcon icon="mdi:filter-variant" sx={{ fontSize: 20 }} />}
        sx={[
          {
            minWidth: 0,
          },
          ...(Array.isArray(sx) ? sx : [sx].filter(Boolean)),
        ]}
        {...buttonProps}
      >
        <Box component="span">{label}</Box>
      </Button>
    </Badge>
  );
};

export default FilterButton;
