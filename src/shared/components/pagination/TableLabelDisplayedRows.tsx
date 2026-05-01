import { Box, Typography } from '@mui/material';
import { Trans } from 'react-i18next';

interface TableLabelDisplayedRowsProps {
  from: number;
  to: number;
  count: number;
}

const TableLabelDisplayedRows = ({ from, to, count }: TableLabelDisplayedRowsProps) => {
  return (
    <Typography component="span" variant="caption" sx={{ color: 'text.secondary' }}>
      <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
        <Trans
          i18nKey="common.pagination.displayedRows"
          values={{ from, to, count }}
          components={{
            range: <Box component="span" sx={{ fontWeight: 700 }} />,
            total: <Box component="span" sx={{ fontWeight: 700 }} />,
          }}
        />
      </Box>
    </Typography>
  );
};

export default TableLabelDisplayedRows;
