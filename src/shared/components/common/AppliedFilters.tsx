import { ReactNode } from 'react';
import { Button, Chip, Stack } from '@mui/material';

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
    <Stack
      direction="row"
      spacing={1}
      flexWrap="wrap"
      useFlexGap
      alignItems="center"
      role="group"
      sx={{ minWidth: 0, maxWidth: '100%' }}
      aria-label={typeof summaryLabel === 'string' ? summaryLabel : undefined}
    >
      {filters.map((item) => (
        <Chip
          key={item.key}
          size="small"
          label={item.label}
          onDelete={item.onRemove}
          color="primary"
          variant="outlined"
          sx={{
            maxWidth: '100%',
            height: 'auto',
            minHeight: 30,
            '& .MuiChip-label': {
              whiteSpace: 'normal',
              overflowWrap: 'anywhere',
              py: 0.5,
              lineHeight: 1.5,
            },
            '& .MuiChip-deleteIcon': { flexShrink: 0, fontSize: 18 },
          }}
        />
      ))}
      <Button variant="text" size="small" color="secondary" onClick={onClear}>
        {clearLabel}
      </Button>
    </Stack>
  );
};

export default AppliedFilters;
