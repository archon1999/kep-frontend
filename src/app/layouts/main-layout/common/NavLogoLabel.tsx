import Chip from '@mui/material/Chip';
import { useNavContext } from '../NavProvider';

interface NavLogoLabelProps {
  compact?: boolean;
}

const NavLogoLabel = ({ compact = false }: NavLogoLabelProps) => {
  const { navLabel } = useNavContext();

  if (!navLabel) {
    return null;
  }

  return (
    <Chip
      label={compact ? navLabel.slice(0, 1).toUpperCase() : navLabel}
      size="small"
      variant="soft"
      color="warning"
      sx={{
        height: compact ? 22 : 24,
        minWidth: compact ? 22 : undefined,
        borderRadius: 1,
        fontWeight: 700,
        letterSpacing: 0,
      }}
    />
  );
};

export default NavLogoLabel;
