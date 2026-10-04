import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import {
  Link,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { getResourceByUsername, resources } from 'app/routes/resources';
import { TestResultRow } from 'modules/testing/domain/ports/testing.repository';
import IconifyIcon from 'shared/components/base/IconifyIcon';

interface TestResultsTableProps {
  title: string;
  results: TestResultRow[];
  questionsCount: number;
  loading: boolean;
  ranked?: boolean;
}

const TestResultsTable = ({
  title,
  results,
  questionsCount,
  loading,
  ranked = false,
}: TestResultsTableProps) => {
  const { t } = useTranslation();

  if (!loading && !results.length) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
        {t('tests.noResults')}
      </Typography>
    );
  }

  return (
    <TableContainer sx={{ borderRadius: 0 }}>
      <Table
        className="disable-edge-padding"
        size="small"
        aria-label={title}
        sx={{
          '& .MuiTableCell-head': {
            bgcolor: 'transparent',
            color: 'text.secondary',
            typography: 'caption',
            fontWeight: 500,
          },
          '& tbody tr:last-child td': { borderBottom: 0 },
        }}
      >
        <TableHead>
          <TableRow>
            {ranked ? (
              <TableCell sx={{ width: 56 }}>{t('tests.resultsColumns.rank')}</TableCell>
            ) : null}
            <TableCell>{t('tests.resultsColumns.user')}</TableCell>
            {!ranked ? (
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                {t('tests.resultsColumns.finished')}
              </TableCell>
            ) : null}
            <TableCell align="right">{t('tests.resultsColumns.score')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading
            ? Array.from({ length: 4 }, (_, index) => (
                <TableRow key={index}>
                  {ranked ? (
                    <TableCell>
                      <Skeleton width={20} />
                    </TableCell>
                  ) : null}
                  <TableCell sx={{ py: 2 }}>
                    <Skeleton width="65%" />
                  </TableCell>
                  {!ranked ? (
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      <Skeleton width="70%" />
                    </TableCell>
                  ) : null}
                  <TableCell align="right">
                    <Skeleton width={48} sx={{ ml: 'auto' }} />
                  </TableCell>
                </TableRow>
              ))
            : results.map((result, index) => (
                <TableRow key={`${result.username}-${result.finished ?? ''}-${index}`}>
                  {ranked ? (
                    <TableCell sx={{ fontVariantNumeric: 'tabular-nums' }}>{index + 1}</TableCell>
                  ) : null}
                  <TableCell sx={{ py: 2, minWidth: 0 }}>
                    <Link
                      component={RouterLink}
                      to={getResourceByUsername(resources.UserProfile, result.username)}
                      underline="hover"
                      variant="body2"
                      color="text.primary"
                      sx={{ fontWeight: 500, overflowWrap: 'anywhere' }}
                    >
                      {result.username}
                    </Link>
                    {!ranked ? (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: { xs: 'block', sm: 'none' }, mt: 0.25 }}
                      >
                        {result.finished || '—'}
                      </Typography>
                    ) : null}
                  </TableCell>
                  {!ranked ? (
                    <TableCell
                      sx={{ display: { xs: 'none', sm: 'table-cell' }, typography: 'body2' }}
                    >
                      {result.finished || '—'}
                    </TableCell>
                  ) : null}
                  <TableCell
                    align="right"
                    sx={{ whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}
                  >
                    {questionsCount > 0 && result.result === questionsCount && (
                      <IconifyIcon
                        icon="material-symbols:check-rounded"
                        fontSize={16}
                        sx={{ color: 'success.main', verticalAlign: 'middle', mr: 0.75 }}
                        aria-hidden
                      />
                    )}
                    <Typography
                      component="span"
                      variant="body2"
                      color={
                        questionsCount > 0 && result.result === questionsCount
                          ? 'success.main'
                          : 'text.primary'
                      }
                      fontWeight={600}
                    >
                      {result.result ?? '—'}
                    </Typography>
                    <Typography component="span" variant="body2" color="text.secondary">
                      {' / '}
                      {questionsCount}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TestResultsTable;
