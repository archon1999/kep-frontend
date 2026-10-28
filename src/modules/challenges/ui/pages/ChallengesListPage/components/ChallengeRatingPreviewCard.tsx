import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Box, Button, Skeleton, Stack, Typography } from '@mui/material';
import { resources } from 'app/routes/resources';
import { getRankColor } from 'app/theme/colors/medals';
import { ChallengeRatingRow } from 'modules/challenges/domain';
import { PageResult } from 'modules/challenges/domain/contracts/challenges.repository';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepIcon from 'shared/components/base/KepIcon';
import EmptyState from 'shared/components/common/EmptyState';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip';

type RatingPreviewCardProps = {
  ratingPreview?: PageResult<ChallengeRatingRow>;
  isLoading: boolean;
};
const ChallengeRatingPreviewCard = ({ ratingPreview, isLoading }: RatingPreviewCardProps) => {
  const { t, i18n } = useTranslation();
  return (
    <Box
      component="section"
      sx={{ p: { xs: 2.5, md: 3 }, borderBottom: 1, borderColor: 'divider' }}
    >
      <Stack direction="row" gap={1} alignItems="center" sx={{ mb: 2 }}>
        <KepIcon name="ranking" color="primary.main" fontSize={20} />
        <Typography component="h2" variant="subtitle1" fontWeight={700}>
          {t('challenges.ratingPreview')}
        </Typography>
      </Stack>
      {isLoading
        ? Array.from({ length: 5 }, (_, index) => <Skeleton key={index} height={56} />)
        : (ratingPreview?.data ?? []).map((row, index) => (
            <Box
              key={row.username}
              sx={{
                display: 'grid',
                gridTemplateColumns: '28px minmax(0, 1fr) auto',
                alignItems: 'center',
                gap: 1,
                py: 1.25,
                borderBottom: 1,
                borderColor: 'divider',
              }}
            >
              <Typography variant="metric" sx={{ fontSize: 17, color: getRankColor(index + 1) }}>
                {String(index + 1).padStart(2, '0')}
              </Typography>
              <UserPopover username={row.username}>
                <Typography variant="body2" fontWeight={600} sx={{ overflowWrap: 'anywhere' }}>
                  {row.username}
                </Typography>
              </UserPopover>
              <Stack direction="row" gap={0.5} alignItems="center">
                <ChallengesRatingChip title={row.rankTitle} size="small" />
                <Typography variant="metric" sx={{ fontSize: 17 }}>
                  {row.rating.toLocaleString(i18n.language, { maximumFractionDigits: 1 })}
                </Typography>
              </Stack>
            </Box>
          ))}
      {!isLoading && !ratingPreview?.data?.length && (
        <EmptyState compact title={t('challenges.noRating')} />
      )}
      <Button
        fullWidth
        component={RouterLink}
        to={resources.ChallengesRating}
        variant="text"
        sx={{ mt: 2 }}
        endIcon={<IconifyIcon icon="solar:arrow-right-linear" fontSize={16} />}
      >
        {t('challenges.openRating')}
      </Button>
    </Box>
  );
};
export default ChallengeRatingPreviewCard;
