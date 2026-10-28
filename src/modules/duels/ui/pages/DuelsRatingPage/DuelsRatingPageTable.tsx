import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
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
import { useBreakpoints } from 'app/providers/BreakpointsProvider';
import { getRankColor } from 'app/theme/colors/medals';
import { useDuelsRatingPage } from 'modules/duels/application/hooks/useDuelsRatingPage';
import DuelParticipant from 'modules/duels/ui/shared/components/DuelParticipant';
import DuelRecord from 'modules/duels/ui/shared/components/DuelRecord';
import { mapDuelsRatingPageTableRows } from 'modules/duels/ui/shared/helpers/duels-rating';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import {
  ListFeedback,
  RouteListPagination,
} from 'shared/components/sections/common/FramedListPage';
import { mergePinnedRows } from 'shared/lib/pinnedRows';

const DuelsRatingPageTable = () => {
  const {
    currentUser,
    paginationModel,
    onPaginationModelChange,
    ratingPage,
    isLoading,
    rowCount,
    error,
    retry,
  } = useDuelsRatingPage();
  const { t, i18n } = useTranslation();
  const { down } = useBreakpoints();
  const compact = down('md');
  const rows = useMemo(
    () =>
      mapDuelsRatingPageTableRows(
        mergePinnedRows(ratingPage?.data ?? [], ratingPage?.pinnedRows, (row) => row.user.username),
      ),
    [ratingPage?.data, ratingPage?.pinnedRows],
  );
  return (
    <Box className="kep-duels-rating">
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table aria-label={t('duels.ratingTitle')} sx={{ minWidth: compact ? 320 : 680 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ width: compact ? 44 : 80, px: 1 }}>
                {t('duels.table.place')}
              </TableCell>
              <TableCell>{t('duels.table.username')}</TableCell>
              {!compact && <TableCell>{t('duels.table.contestsRating')}</TableCell>}
              {!compact && <TableCell align="center">{t('duels.table.duels')}</TableCell>}
              <TableCell sx={{ width: compact ? 132 : 200 }}>{t('duels.table.record')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: paginationModel.pageSize }, (_, i) => (
                  <TableRow key={i} sx={{ height: 88 }}>
                    <TableCell sx={{ px: 1 }}>
                      <Skeleton width={24} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width="80%" height={42} />
                    </TableCell>
                    {!compact && (
                      <TableCell>
                        <Skeleton width={100} />
                      </TableCell>
                    )}
                    {!compact && (
                      <TableCell>
                        <Skeleton width={40} />
                      </TableCell>
                    )}
                    <TableCell>
                      <Skeleton width="90%" height={compact ? 42 : 24} />
                    </TableCell>
                  </TableRow>
                ))
              : !error &&
                rows.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{
                      height: 88,
                      bgcolor:
                        row.username === currentUser?.username ? 'action.selected' : undefined,
                    }}
                  >
                    <TableCell align="center" sx={{ px: 1 }}>
                      <Typography
                        variant="metric"
                        color={getRankColor(row.rowIndex)}
                        sx={{ fontSize: 20 }}
                      >
                        {String(row.rowIndex).padStart(2, '0')}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ minWidth: compact ? 128 : 200, py: 1.5 }}>
                      <DuelParticipant
                        compact={compact}
                        player={{
                          username: row.username,
                          avatar: row.avatar,
                          contestsRating: compact ? row.contestsRating : undefined,
                          contestsRatingTitle: compact ? row.contestsRatingTitle : undefined,
                        }}
                      />
                    </TableCell>
                    {!compact && (
                      <TableCell>
                        <Stack direction="row" gap={1} alignItems="center">
                          <ContestsRatingChip title={row.contestsRatingTitle} imgSize={24} />
                          <Typography variant="metric" sx={{ fontSize: 19 }}>
                            {row.contestsRating?.toLocaleString(i18n.language) ?? '—'}
                          </Typography>
                        </Stack>
                      </TableCell>
                    )}
                    {!compact && (
                      <TableCell align="center">
                        <Typography variant="metric" sx={{ fontSize: 20 }}>
                          {row.duels.toLocaleString(i18n.language)}
                        </Typography>
                      </TableCell>
                    )}
                    <TableCell sx={{ pr: { xs: 1, sm: 2 }, pl: 1 }}>
                      <Stack gap={0.75}>
                        <DuelRecord wins={row.wins} losses={row.losses} draws={row.draws} />
                        {compact && (
                          <Typography variant="caption" color="text.secondary">
                            {row.duels.toLocaleString(i18n.language)} {t('duels.table.duels')}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      {!isLoading && (
        <ListFeedback
          loading={false}
          error={error}
          empty={!rows.length}
          emptyTitle={t('common.dataGrid.noRows.duelsRating')}
          emptyMessage=""
          errorMessage={t('duels.error')}
          kind="competitions"
          onRetry={() => void retry()}
        />
      )}
      <Box sx={{ borderBottom: '1px solid var(--kep-line)' }}>
        <RouteListPagination
          page={paginationModel.page + 1}
          count={Math.ceil(rowCount / paginationModel.pageSize)}
          disabled={isLoading}
          onChange={(page) => onPaginationModelChange({ ...paginationModel, page: page - 1 })}
        />
      </Box>
    </Box>
  );
};
export default DuelsRatingPageTable;
