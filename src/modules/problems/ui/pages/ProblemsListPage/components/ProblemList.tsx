import { useTranslation } from 'react-i18next';
import { Skeleton, Stack } from '@mui/material';
import { ProblemsListParams } from 'modules/problems/domain/contracts/problems.repository.ts';
import { ProblemListItem } from 'modules/problems/domain/entities/problem.entity.ts';
import EmptyState from 'shared/components/common/EmptyState';
import { RouteListPagination } from 'shared/components/sections/common/FramedListPage';
import ProblemListCard from './ProblemListCard.tsx';
import { ProblemListCardSkeleton } from './ProblemListRow';

interface ProblemsListProps {
  problems: ProblemListItem[];
  isLoading: boolean;
  filter: ProblemsListParams;
  total: number;
  onPageChange: (page: number) => void;
}

const ProblemList = ({ problems, isLoading, filter, total, onPageChange }: ProblemsListProps) => {
  const { t } = useTranslation();

  return (
    <>
      {isLoading ? (
        <Stack direction="column" spacing={0} role="status" aria-label={t('common.loading')}>
          {Array.from({ length: Math.min(filter.pageSize ?? 20, 100) }).map((_, idx) => (
            <ProblemListCardSkeleton key={idx} />
          ))}
        </Stack>
      ) : problems.length === 0 ? (
        <EmptyState
          title={t('problems.emptyTitle')}
          description={t('problems.emptySubtitle')}
          kind="search"
        />
      ) : (
        <Stack direction="column" spacing={0}>
          {problems.map((problem) => (
            <ProblemListCard key={problem.id} problem={problem} />
          ))}
        </Stack>
      )}

      {isLoading && !problems.length ? (
        <Stack direction="row" justifyContent="center" gap={0.5} sx={{ py: 3, px: 1 }}>
          {Array.from({ length: 7 }, (_, index) => (
            <Skeleton key={index} variant="rectangular" width={32} height={40} />
          ))}
        </Stack>
      ) : (
        problems.length > 0 && (
          <RouteListPagination
            count={Math.ceil(total / (filter.pageSize ?? 20))}
            page={filter.page ?? 1}
            onChange={onPageChange}
            disabled={isLoading}
          />
        )
      )}
    </>
  );
};

export default ProblemList;
