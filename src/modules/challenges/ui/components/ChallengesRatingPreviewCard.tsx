import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Button, Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { resources } from 'app/routes/resources';
import UserPopover from 'modules/users/ui/components/UserPopover.tsx';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip.tsx';
import { ChallengeRatingRow } from '../../domain';
import { PageResult } from '../../domain/ports/challenges.repository.ts';

type ChallengesRatingPreviewCardProps = {
  ratingPreview?: PageResult<ChallengeRatingRow>;
  isLoading: boolean;
};

const ChallengesRatingPreviewCard = ({
  ratingPreview,
  isLoading,
}: ChallengesRatingPreviewCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent sx={{ height: '100%' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Stack spacing={0.25}>
            <Typography variant="h6">{t('challenges.ratingPreview')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('challenges.ratingPreviewSubtitle')}
            </Typography>
          </Stack>
          <Button variant="text" onClick={() => navigate(resources.ChallengesRating)}>
            {t('challenges.openRating')}
          </Button>
        </Stack>

        <Stack spacing={1.5} direction="column">
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} variant="rectangular" height={52} sx={{ borderRadius: 2 }} />
              ))
            : (ratingPreview?.data ?? []).map((row, index) => (
                <Card background={0}>
                  <Stack paddingX={2} paddingY={1} direction="row">
                    <Stack width={1} direction="row" spacing={1.25} alignItems="center">
                      <Typography variant="body2" fontWeight={600}>
                        #{index + 1}
                      </Typography>
                      <Stack
                        width={1}
                        spacing={1}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Stack spacing={0.5} direction="column">
                          <Box>
                            <ChallengesRatingChip title={row.rankTitle} size="small" />
                          </Box>

                          <UserPopover username={row.username}>
                            <Typography variant="subtitle2">{row.username}</Typography>
                          </UserPopover>
                        </Stack>

                        <ChallengesRatingChip size="medium" title={row.rankTitle} rating={row.rating} />
                      </Stack>
                    </Stack>
                  </Stack>
                </Card>
              ))}
          {!isLoading && !ratingPreview?.data?.length && (
            <Typography variant="body2" color="text.secondary">
              {t('challenges.noRating')}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ChallengesRatingPreviewCard;
