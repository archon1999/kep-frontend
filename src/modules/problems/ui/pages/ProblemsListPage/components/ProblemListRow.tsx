import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router';
import { Box, Card, Skeleton, Stack, Typography } from '@mui/material';

interface ProblemListRowProps {
  href?: string;
  title: ReactNode;
  status: ReactNode;
  counts: ReactNode;
  difficulty: ReactNode;
  rating: ReactNode;
  loading?: boolean;
}
const ProblemListRow = ({
  href,
  title,
  status,
  counts,
  difficulty,
  rating,
  loading,
}: ProblemListRowProps) => {
  return (
    <Card
      className="kep-problem-list-row"
      variant="section"
      {...(href ? { component: RouterLink, to: href } : {})}
      aria-busy={loading || undefined}
      sx={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        px: 'var(--kep-content-inset)',
        py: 2.5,
        '&:hover, &:focus-visible': {
          bgcolor: 'action.hover',
          '& h2': { color: 'primary.main' },
        },
      }}
    >
      <Box
        sx={{
          display: { xs: 'grid', sm: 'flex' },
          position: 'relative',
          gridTemplateColumns: { xs: 'minmax(0, 1fr) auto' },
          gridTemplateRows: { xs: 'auto auto' },
          columnGap: { xs: 1, sm: 1.5 },
          rowGap: { xs: 0.5, sm: 1.5 },
          alignItems: { xs: 'center', sm: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <Stack
          direction="row"
          spacing={1.25}
          alignItems={{ xs: 'center', sm: 'flex-start' }}
          minWidth={0}
          sx={{ gridColumn: { xs: 1, sm: 'auto' }, gridRow: { xs: 1, sm: 'auto' }, flex: 1 }}
        >
          <Box
            sx={{
              position: { xs: 'absolute', sm: 'static' },
              left: { xs: 0, sm: 'auto' },
              top: { xs: '50%', sm: 'auto' },
              transform: { xs: 'translateY(-50%)', sm: 'none' },
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {status}
          </Box>

          <Stack
            direction="column"
            spacing={0.5}
            minWidth={0}
            flex={1}
            sx={{ pl: { xs: 4, sm: 0 } }}
          >
            <Typography
              component="h2"
              variant="subtitle1"
              fontWeight={600}
              color="text.primary"
              title={typeof title === 'string' ? title : undefined}
              sx={{
                lineHeight: 1.25,
                overflowWrap: 'anywhere',
                height: { xs: '2.5em', sm: 'auto' },
                display: '-webkit-box',
                WebkitLineClamp: { xs: 2, sm: 'unset' },
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {title}
            </Typography>
            <Box sx={{ display: { xs: 'none', sm: 'block' }, minHeight: 24 }}>{counts}</Box>
          </Stack>
        </Stack>

        <Box
          sx={{
            display: { xs: 'flex', sm: 'none' },
            alignItems: 'center',
            gridColumn: { xs: 2, sm: 'auto' },
            gridRow: { xs: 1, sm: 'auto' },
            justifySelf: 'end',
            alignSelf: 'start',
          }}
        >
          {difficulty}
        </Box>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="flex-end"
          flexShrink={0}
          sx={{ display: { xs: 'none', sm: 'flex' } }}
        >
          {difficulty}
          {rating}
        </Stack>

        <Box
          sx={{
            display: { xs: 'flex', sm: 'none' },
            alignItems: 'center',
            gridColumn: 1,
            gridRow: 2,
            pl: 4,
            minWidth: 0,
            minHeight: 24,
            mt: -0.25,
          }}
        >
          {counts}
        </Box>

        <Box
          sx={{
            display: { xs: 'flex', sm: 'none' },
            alignItems: 'center',
            minHeight: 24,
            gridColumn: { xs: 2, sm: 'auto' },
            gridRow: { xs: 2, sm: 'auto' },
            justifySelf: 'end',
            alignSelf: 'end',
          }}
        >
          {rating}
        </Box>
      </Box>
    </Card>
  );
};

export const ProblemListCardSkeleton = () => (
  <ProblemListRow
    loading
    status={<Skeleton variant="circular" width={20} height={20} />}
    title={
      <Box component="span" sx={{ display: 'block' }}>
        <Skeleton width="72%" height="1.25em" />
        <Skeleton width="45%" height="1.25em" sx={{ display: { xs: 'block', sm: 'none' } }} />
      </Box>
    }
    counts={
      <Stack direction="row" alignItems="center" gap={1} sx={{ height: 24 }}>
        <Skeleton variant="rectangular" width={18} height={18} />
        <Skeleton width={24} height={21} />
        <Box sx={{ height: 18, width: '1px', bgcolor: 'divider' }} />
        <Skeleton variant="rectangular" width={18} height={18} />
        <Skeleton width={24} height={21} />
      </Stack>
    }
    difficulty={<Skeleton variant="rectangular" width={76} height={24} />}
    rating={<Skeleton variant="rectangular" width={54} height={24} />}
  />
);
export default ProblemListRow;
