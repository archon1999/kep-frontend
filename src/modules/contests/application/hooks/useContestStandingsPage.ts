import { useEffect, useMemo, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from 'app/providers/AuthProvider';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import {
  useContest,
  useContestFilters,
  useContestProblems,
  useContestStandings,
} from 'modules/contests/application/queries';
import { ContestStatus } from 'modules/contests/domain/entities/contest-status';
import usePaginatedRouteState from 'shared/hooks/usePaginatedRouteState';
import { mergePinnedRows } from 'shared/lib/pinnedRows';
import { booleanFlagParam, stringParam } from 'shared/lib/queryParams';
import {
  contestantMatchesUsername,
  getStandingsRowId,
  normalizeUsername,
} from '../../domain/utils/standings';

const decodeRouteParam = (value?: string) => {
  if (!value) {
    return undefined;
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export const useContestStandingsPage = () => {
  const { id, username: participantParam } = useParams<{ id: string; username?: string }>();
  const contestId = id ? Number(id) : undefined;
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const participantUsername = useMemo(() => decodeRouteParam(participantParam), [participantParam]);
  const normalizedParticipantUsername = normalizeUsername(participantUsername);

  const refreshInterval = 30000;

  const {
    data: contest,
    isLoading: isContestLoading,
    error: contestError,
  } = useContest(contestId, {
    refreshInterval,
  });
  const canLoadContestProblems = Boolean(
    contest && contest.statusCode !== ContestStatus.NotStarted,
  );
  const { data: contestProblems = [] } = useContestProblems(
    contestId,
    {
      refreshInterval,
    },
    canLoadContestProblems,
  );
  const { data: contestFilters = [] } = useContestFilters(contestId);
  useDocumentTitle(
    contest?.title ? 'pageTitles.contestStandings' : undefined,
    contest?.title
      ? {
          contestTitle: contest.title,
        }
      : undefined,
  );

  const {
    state,
    patchFilters: onFiltersChange,
    resetFilters: onClearFilters,
    paginationModel,
    onPaginationModelChange,
    pageParams,
    setPage,
  } = usePaginatedRouteState({
    defaults: {
      selectedFilter: '',
      followingOnly: false,
      officialOnly: true,
    },
    schema: {
      selectedFilter: {
        ...stringParam(),
        param: 'filter',
      },
      followingOnly: {
        ...booleanFlagParam(),
        param: 'following',
      },
      officialOnly: {
        ...booleanFlagParam(),
        serialize: (value) => (value ? '1' : '0'),
        param: 'official',
      },
    },
  });
  const selectedFilter = state.selectedFilter;
  const followingOnly = state.followingOnly;
  const officialOnly = state.officialOnly;
  const activeFiltersCount = useMemo(
    () => Number(Boolean(selectedFilter)) + Number(followingOnly) + Number(!officialOnly),
    [followingOnly, officialOnly, selectedFilter],
  );
  const shouldAutoLocateParticipant =
    Boolean(participantUsername) && !searchParams.has('page') && !searchParams.has('pageSize');

  const {
    data: standings,
    isLoading,
    error: sectionError,
  } = useContestStandings(
    contestId,
    {
      page: shouldAutoLocateParticipant ? undefined : pageParams.page,
      pageSize: shouldAutoLocateParticipant ? undefined : pageParams.pageSize,
      filter: selectedFilter || null,
      following: followingOnly,
      official: officialOnly,
      participant: participantUsername,
      pinCurrentUser: Boolean(currentUser?.username),
    },
    refreshInterval,
  );

  const contestants = useMemo(
    () =>
      mergePinnedRows(standings?.data ?? [], standings?.pinnedRows, (row) =>
        getStandingsRowId(row),
      ),
    [standings?.data, standings?.pinnedRows],
  );
  const participantTarget = useMemo(() => {
    if (!normalizedParticipantUsername) {
      return null;
    }

    const rowIndex = contestants.findIndex((contestant) =>
      contestantMatchesUsername(contestant, normalizedParticipantUsername),
    );
    if (rowIndex < 0) {
      return null;
    }

    return {
      rowId: getStandingsRowId(contestants[rowIndex]),
      rowIndex,
    };
  }, [contestants, normalizedParticipantUsername]);

  const rowCountRef = useRef(0);
  const total = useMemo(() => {
    if (standings?.total !== undefined) {
      rowCountRef.current = standings.total;
    }

    return rowCountRef.current;
  }, [standings?.total]);

  useEffect(() => {
    if (searchParams.has('page') || !standings?.page || standings.page === pageParams.page) {
      return;
    }

    setPage(standings.page);
  }, [pageParams.page, searchParams, setPage, standings?.page]);

  return {
    contestId,
    contest,
    isContestLoading,
    error: contestError || sectionError,
    contestProblems,
    contestFilters,
    selectedFilter,
    followingOnly,
    officialOnly,
    activeFiltersCount,
    participantUsername,
    participantTarget,
    standingsPage: standings?.page,
    contestants,
    total,
    isLoading,
    paginationModel,
    onPaginationModelChange,
    currentUsername: currentUser?.username,
    onFiltersChange,
    onClearFilters,
  };
};
export type ContestStandingsPageModel = ReturnType<typeof useContestStandingsPage>;
