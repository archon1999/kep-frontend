import { useTranslation } from 'react-i18next';
import { Chip, ChipProps } from '@mui/material';

interface HackathonPointsBadgeProps extends Omit<ChipProps, 'label'> {
  value?: number | string | null;
}

const HackathonPointsBadge = ({ value = 0, ...chipProps }: HackathonPointsBadgeProps) => {
  const { t } = useTranslation();

  return (
    <Chip
      size="small"
      variant="soft"
      {...chipProps}
      label={`${value ?? 0} ${t('hackathons.pointsUnit')}`}
      sx={[
        { fontVariantNumeric: 'tabular-nums', fontWeight: 600 },
        ...(Array.isArray(chipProps.sx) ? chipProps.sx : chipProps.sx ? [chipProps.sx] : []),
      ]}
    />
  );
};

export default HackathonPointsBadge;
