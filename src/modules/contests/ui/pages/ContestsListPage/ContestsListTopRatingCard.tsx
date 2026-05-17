import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import {
  Box,
  Button,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { resources } from 'app/routes/resources';
import { useContestsRating } from 'modules/contests/application/queries';
import { ContestRatingRow } from 'modules/contests/domain/entities/contest-rating.entity';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import {
  getContestsRatingLevelByRating,
  getContestsRatingLevelByTitle,
} from 'shared/components/rating/contestsRating';

const TOP_RATING_LIMIT = 10;

const getRatingColor = (row: ContestRatingRow) =>
  getContestsRatingLevelByRating(row.rating)?.color ??
  getContestsRatingLevelByTitle(row.ratingTitle)?.color ??
  'text.primary';

const ContestsListTopRatingCard = () => {
  const { t } = useTranslation();
  const { data: ratingPage, isLoading } = useContestsRating({
    page: 1,
    pageSize: TOP_RATING_LIMIT,
    ordering: '-rating',
  });

  const rows = useMemo(() => ratingPage?.data.slice(0, TOP_RATING_LIMIT) ?? [], [ratingPage?.data]);

  const renderSkeleton = () => (
    <Stack spacing={1.25}>
      {Array.from({ length: TOP_RATING_LIMIT }).map((_, index) => (
        <Stack key={index} direction="row" spacing={1.25} alignItems="center">
          <Skeleton variant="text" width={28} />
          <Skeleton variant="text" sx={{ flex: 1 }} />
          <Skeleton variant="text" width={48} />
        </Stack>
      ))}
    </Stack>
  );

  const renderRows = () => {
    if (!rows.length) {
      return (
        <Typography variant="body2" color="text.secondary">
          {t('contests.rating.empty')}
        </Typography>
      );
    }

    return (
      <Box
        component="table"
        sx={{
          width: 1,
          borderCollapse: 'collapse',
          tableLayout: 'fixed',
          '& th': {
            pb: 1,
            color: 'text.secondary',
            fontSize: 11,
            fontWeight: 800,
            lineHeight: 1.3,
            textAlign: 'left',
            textTransform: 'uppercase',
          },
          '& td': {
            py: 1,
            verticalAlign: 'middle',
          },
        }}
      >
        <Box component="colgroup">
          <Box component="col" sx={{ width: 36 }} />
          <Box component="col" />
          <Box component="col" sx={{ width: 84 }} />
        </Box>
        <Box component="thead">
          <Box component="tr">
            <Box component="th">{t('contests.rating.columns.place')}</Box>
            <Box component="th">{t('contests.rating.columns.user')}</Box>
            <Box component="th" sx={{ textAlign: 'right !important' }}>
              {t('contests.rating.columns.rating')}
            </Box>
          </Box>
        </Box>
        <Box component="tbody">
          {rows.map((row, index) => {
            const ratingColor = getRatingColor(row);
            const place = row.rowIndex ?? index + 1;

            return (
              <Box
                component="tr"
                key={row.username}
                sx={{
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  '&:hover td': {
                    bgcolor: 'action.hover',
                  },
                  '& td:first-of-type': {
                    borderTopLeftRadius: 1,
                    borderBottomLeftRadius: 1,
                  },
                  '& td:last-of-type': {
                    borderTopRightRadius: 1,
                    borderBottomRightRadius: 1,
                  },
                }}
              >
                <Box component="td">
                  <Typography variant="body2" color="text.secondary" fontWeight={800}>
                    {place}
                  </Typography>
                </Box>
                <Box component="td" sx={{ minWidth: 0 }}>
                  <UserPopover username={row.username}>
                    <Typography
                      variant="body2"
                      fontWeight={800}
                      noWrap
                      sx={{
                        color: ratingColor,
                        display: 'block',
                      }}
                    >
                      {row.username}
                    </Typography>
                  </UserPopover>
                </Box>
                <Box component="td">
                  <Stack direction="row" spacing={0.75} alignItems="center" justifyContent="flex-end">
                    <ContestsRatingChip title={row.ratingTitle} imgSize={18} />
                    <Typography variant="body2" color="text.primary" fontWeight={800} align="right">
                      {row.rating ?? '--'}
                    </Typography>
                  </Stack>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  };

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 1,
        overflow: 'hidden',
        position: { md: 'sticky' },
        top: { md: 88 },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle1" fontWeight={900}>
              {t('contests.topRating.title')}
            </Typography>
            <Button
              component={RouterLink}
              to={resources.ContestsRating}
              size="small"
              variant="text"
              endIcon={<IconifyIcon icon="mdi:arrow-right" sx={{ fontSize: 16 }} />}
              sx={{ px: 0.5, flexShrink: 0, fontWeight: 800 }}
            >
              {t('contests.topRating.viewAll')}
            </Button>
          </Stack>

          {isLoading ? renderSkeleton() : renderRows()}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ContestsListTopRatingCard;
