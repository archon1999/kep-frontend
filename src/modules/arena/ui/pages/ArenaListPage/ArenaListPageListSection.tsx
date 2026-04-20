import { Pagination, Skeleton, Stack } from '@mui/material';
import { Arena } from 'modules/arena/domain/entities/arena.entity.ts';
import ArenaListPageCard from './components/ArenaListPageCard.tsx';

type Props = {
  arenas: Arena[];
  isLoading: boolean;
  page: number;
  pagesCount: number;
  onPageChange: (page: number) => void;
};

const ArenaListPageListSection = ({
  arenas,
  isLoading,
  page,
  pagesCount,
  onPageChange,
}: Props) => (
  <>
    {isLoading
      ? Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} variant="rounded" height={108} />
        ))
      : arenas.map((arena) => <ArenaListPageCard key={arena.id} arena={arena} />)}

    {pagesCount > 1 ? (
      <Stack direction="column" alignItems="center">
        <Pagination
          color="warning"
          count={pagesCount}
          page={page}
          onChange={(_, value) => onPageChange(value)}
        />
      </Stack>
    ) : null}
  </>
);

export default ArenaListPageListSection;
