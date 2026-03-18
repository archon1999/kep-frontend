import { Card, CardContent, Pagination, Skeleton, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { Duel } from '../../domain/index.ts';
import DuelsListCard from './DuelsListCard.tsx';

type Props = {
  title?: string;
  duels: Duel[];
  total: number;
  page: number;
  pageSize: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
  onView: (duel: Duel) => void;
};

const DuelsListSection = ({
  title,
  duels,
  total,
  page,
  pageSize,
  loading,
  onPageChange,
  onView,
}: Props) => {
  const { t } = useTranslation();
  const pageCount = Math.max(1, Math.ceil((total || 0) / pageSize));

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Typography variant="h6" fontWeight={800}>
          {title ?? t('duels.listTitle')}
          {total ? (
            <Typography component="span" variant="subtitle2" color="text.secondary" ml={1}>
              ({total})
            </Typography>
          ) : null}
        </Typography>
      </Stack>

      <Stack spacing={2}>
        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} variant="outlined">
                <CardContent>
                  <Stack spacing={1}>
                    <Skeleton width="60%" />
                    <Skeleton width="90%" />
                    <Skeleton width="40%" />
                  </Stack>
                </CardContent>
              </Card>
            ))
          : null}

        {!loading && !duels.length ? (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {t('duels.noDuels')}
              </Typography>
            </CardContent>
          </Card>
        ) : null}

        {!loading &&
          duels.map((duel) => (
            <DuelsListCard
              key={duel.id}
              duel={duel}
              onView={() => onView(duel)}
            />
          ))}
      </Stack>

      <Grid container justifyContent="center">
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_, value) => onPageChange(value)}
          color="primary"
          shape="rounded"
        />
      </Grid>
    </Stack>
  );
};

export default DuelsListSection;
