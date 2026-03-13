import { Badge, Box, Button, ButtonProps } from '@mui/material';
import IconifyIcon from '../base/IconifyIcon';

export type FilterButtonProps = ButtonProps & {
  label: string;
  badgeContent?: number;
};

const FilterButton = ({ label, badgeContent, sx, ...buttonProps }: FilterButtonProps) => {
  const badgeInvisible = badgeContent === undefined || badgeContent === 0;

  return (
    <Button
      variant="soft"
      color="neutral"
      startIcon={<IconifyIcon icon="mdi:filter-variant" sx={{ fontSize: 20 }} />}
      sx={[{ flexShrink: 0 }, ...(Array.isArray(sx) ? sx : [sx].filter(Boolean))]}
      {...buttonProps}
    >
      {badgeInvisible ? (
        <Box component="span">{label}</Box>
      ) : (
        <Badge color="secondary" badgeContent={badgeContent} invisible={badgeInvisible} overlap="circular">
          <Box sx={{ top: -5, right: -14 }} component="span">{label}</Box>
        </Badge>
      )}
    </Button>
  );
};

export default FilterButton;
