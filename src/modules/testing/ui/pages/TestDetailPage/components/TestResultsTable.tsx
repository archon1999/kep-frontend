import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { TestResultRow } from 'modules/testing/domain/contracts/testing.repository';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import EmptyState from 'shared/components/common/EmptyState';

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
    return <EmptyState compact kind="competitions" title={t('tests.noResults')} />;
  }

  return (
    <TableContainer sx={{ borderRadius: 0 }}>
      <Table
        size="small"
        aria-label={title}
        sx={{
          '& .MuiTableCell-root': { px: { xs: 2, md: 3 } },
          '& tbody tr': { height: 68 },
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
                    <TableCell>
                      <Typography
                        variant="metric"
                        color={
                          index === 0
                            ? 'warning.main'
                            : index === 2
                              ? 'warning.dark'
                              : 'text.secondary'
                        }
                        sx={{ fontSize: 20 }}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </Typography>
                    </TableCell>
                  ) : null}
                  <TableCell sx={{ py: 2, minWidth: 0 }}>
                    <UserPopover username={result.username}>
                      <Stack direction="row" gap={1} alignItems="center" sx={{ minWidth: 0 }}>
                        <Avatar alt="" sx={{ width: 28, height: 28, fontSize: 12 }}>
                          {result.username[0]}
                        </Avatar>
                        <Typography
                          variant="body2"
                          color="text.primary"
                          sx={{ fontWeight: 500, overflowWrap: 'anywhere' }}
                        >
                          {result.username}
                        </Typography>
                      </Stack>
                    </UserPopover>
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
                      variant="metric"
                      color={
                        questionsCount > 0 && result.result === questionsCount
                          ? 'success.main'
                          : 'text.primary'
                      }
                      sx={{ fontSize: 22 }}
                    >
                      {result.result ?? '—'}
                    </Typography>
                    <Typography
                      component="span"
                      variant="metric"
                      color="text.secondary"
                      sx={{ fontSize: 14 }}
                    >
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
