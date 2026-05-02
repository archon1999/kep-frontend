import { ReactNode } from 'react';
import { Button, Chip, Stack, Typography } from '@mui/material';

export type AppliedFilterItem = {
  key: string;
  label: ReactNode;
  onRemove: () => void;
};

interface AppliedFiltersProps {
  filters: AppliedFilterItem[];
  summaryLabel: ReactNode;
  clearLabel: ReactNode;
  onClear: () => void;
}

const AppliedFilters = ({ filters, summaryLabel, clearLabel, onClear }: AppliedFiltersProps) => {
  if (filters.length === 0) {
    return null;
  }

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
      <Typography variant="body2" color="text.secondary">
        {summaryLabel}
      </Typography>
      {filters.map((item) => (
        <Chip
          key={item.key}
          size="small"
          label={item.label}
          onDelete={item.onRemove}
          color="primary"
          variant="outlined"
        />
      ))}
      <Button variant="text" size="small" color="secondary" onClick={onClear}>
        {clearLabel}
      </Button>
    </Stack>
  );
};

export default AppliedFilters;
