import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Box } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import { contentGridSx } from 'app/theme/styles/content';
import { useDuelsList } from 'modules/duels/application/queries';
import { Duel } from 'modules/duels/domain';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import { ListFeedback, ListPagination } from 'shared/components/sections/common/FramedListPage';
import SectionHeader from 'shared/components/sections/common/SectionHeader';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { numberParam } from 'shared/lib/queryParams';
import DuelListCard, { DuelListCardSkeleton } from './DuelListCard';

type Props = {
  scope?: 'recent' | 'my';
  title?: string;
  description?: string;
  actionSlot?: ReactNode;
  duels?: Duel[];
  total?: number;
  page?: number;
  pageSize?: number;
  loading?: boolean;
  onPageChange?: (page: number) => void;
};
const duelGridSx = {
  ...contentGridSx,
  gridTemplateColumns: { xs: '1fr', lg: 'repeat(2,minmax(0,1fr))' },
};
const DuelListSection = ({
  scope = 'recent',
  title,
  description,
  actionSlot,
  duels,
  total,
  page,
  pageSize = 10,
  loading,
  onPageChange,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state, setField } = useRouteQueryState<{ page: number }>({
    defaults: { page: 1 },
    schema: {
      page: { ...numberParam({ min: 1 }), param: scope === 'my' ? 'myPage' : 'recentPage' },
    },
    historyByKey: { page: 'push' },
  });
  const resolvedPage = page ?? state.page;
  const shouldFetch = duels === undefined || total === undefined || loading === undefined;
  const {
    data: fetchedPage,
    error,
    isLoading,
    mutate,
  } = useDuelsList(shouldFetch ? { my: scope === 'my', page: resolvedPage, pageSize } : undefined);
  const items = duels ?? fetchedPage?.data ?? [];
  const count = total ?? fetchedPage?.total ?? 0;
  const busy = loading ?? (isLoading && !fetchedPage);
  return (
    <Box component="section" className="kep-duel-list-section" sx={{ minWidth: 0 }}>
      <SectionHeader
        title={title ?? t(scope === 'my' ? 'duels.myDuelsSection' : 'duels.recentDuelsSection')}
        description={description}
        action={actionSlot ?? <PatternArtwork kind="battles" sx={{ width: 100, opacity: 0.4 }} />}
      />
      <ListFeedback
        loading={busy}
        error={error}
        empty={!items.length}
        emptyTitle={t('duels.noDuels')}
        emptyMessage=""
        errorMessage={t('duels.error')}
        kind="battles"
        onRetry={() => void mutate()}
        loadingContent={
          <Box sx={duelGridSx}>
            {Array.from({ length: pageSize }, (_, i) => (
              <DuelListCardSkeleton key={i} />
            ))}
          </Box>
        }
      />
      {!busy && !error && items.length > 0 && (
        <Box sx={duelGridSx}>
          {items.map((duel) => (
            <DuelListCard
              key={duel.id}
              duel={duel}
              onView={() => navigate(getResourceById(resources.Duel, duel.id))}
            />
          ))}
        </Box>
      )}
      <Box sx={{ borderBottom: '1px solid var(--kep-line)' }}>
        <ListPagination
          page={resolvedPage}
          count={Math.ceil(count / pageSize)}
          disabled={busy}
          onChange={(value) => (onPageChange ? onPageChange(value) : setField('page', value))}
        />
      </Box>
    </Box>
  );
};
export default DuelListSection;
