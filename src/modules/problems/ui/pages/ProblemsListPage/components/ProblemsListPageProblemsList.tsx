import { Box, Skeleton, Stack, TablePagination, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomTablePaginationAction from 'shared/components/pagination/CustomTablePaginationAction.tsx';
import { ProblemListItem } from 'modules/problems/domain/entities/problem.entity.ts';
import { ProblemsListParams } from 'modules/problems/domain/ports/problems.repository.ts';
import ProblemsListPageProblemListCard from './ProblemsListPageProblemListCard.tsx';

interface ProblemsListPageProblemsListProps {
  problems: ProblemListItem[];
  isLoading: boolean;
  filter: ProblemsListParams;
  total: number;
  onPageChange: (event: unknown, page: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProblemsListPageProblemsList = ({
  problems,
  isLoading,
  filter,
  total,
  onPageChange,
  onRowsPerPageChange,
}: ProblemsListPageProblemsListProps) => {
  const { t } = useTranslation();

  return (
    <>
      {isLoading ? (
        <Stack direction="column" spacing={1.5}>
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton key={idx} variant="rounded" height={104} />
          ))}
        </Stack>
      ) : problems.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            {t('problems.emptyTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t('problems.emptySubtitle')}
          </Typography>
        </Box>
      ) : (
        <Stack direction="column" spacing={1.25}>
          {problems.map((problem) => (
            <ProblemsListPageProblemListCard key={problem.id} problem={problem} />
          ))}
        </Stack>
      )}

      {problems.length > 0 && (
        <TablePagination
          component="div"
          count={total}
          page={(filter.page ?? 1) - 1}
          onPageChange={onPageChange}
          rowsPerPage={filter.pageSize ?? 20}
          rowsPerPageOptions={[10, 20, 50]}
          onRowsPerPageChange={onRowsPerPageChange}
          ActionsComponent={CustomTablePaginationAction}
        />
      )}
    </>
  );
};

export default ProblemsListPageProblemsList;
