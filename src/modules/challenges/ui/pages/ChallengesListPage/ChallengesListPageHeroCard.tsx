import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Box, Button, Stack, Typography } from '@mui/material';
import { resources } from 'app/routes/resources';
import { ChallengeRatingRow } from 'modules/challenges/domain';
import ChallengeRecord from 'modules/challenges/ui/shared/components/ChallengeRecord';
import KepIcon from 'shared/components/base/KepIcon';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip';
import PageHeader from 'shared/components/sections/common/PageHeader';

type ChallengesListPageHeroCardProps = {
  userRating?: ChallengeRatingRow | null;
  onOpenQuickStart: () => void;
};
const ChallengesListPageHeroCard = ({
  userRating,
  onOpenQuickStart,
}: ChallengesListPageHeroCardProps) => {
  const { t, i18n } = useTranslation();
  return (
    <>
      <PageHeader
        variant="detail"
        title={t('challenges.title')}
        subtitle={t('challenges.subtitle')}
        actionComponent={
          <Stack direction="row" gap={1} flexWrap="wrap" useFlexGap>
            <Button
              variant="outlined"
              component={RouterLink}
              to={resources.ChallengesRating}
              startIcon={<KepIcon name="ranking" fontSize={18} />}
            >
              {t('challenges.viewRating')}
            </Button>
            <Button
              variant="contained"
              onClick={onOpenQuickStart}
              startIcon={<KepIcon name="challenge" fontSize={18} />}
            >
              {t('challenges.quickStartTitle')}
            </Button>
          </Stack>
        }
      />
      {userRating && (
        <Box
          sx={{
            px: 'var(--kep-content-inset)',
            py: 2,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: { xs: 2, md: 4 },
          }}
        >
          <Stack gap={0.25}>
            <Typography variant="caption" color="text.secondary">
              {t('challenges.myRating')}
            </Typography>
            <Stack direction="row" gap={1} alignItems="center">
              <Typography variant="metric" sx={{ fontSize: 26 }}>
                {userRating.rating.toLocaleString(i18n.language, { maximumFractionDigits: 1 })}
              </Typography>
              <ChallengesRatingChip title={userRating.rankTitle} />
            </Stack>
          </Stack>
          <ChallengeRecord
            wins={userRating.wins}
            draws={userRating.draws}
            losses={userRating.losses}
          />
          <Button
            component={RouterLink}
            to={resources.ChallengesUserStatistics}
            variant="text"
            endIcon={<KepIcon name="statistics" fontSize={18} />}
            sx={{ ml: { sm: 'auto' }, px: 0 }}
          >
            {t('challenges.statisticsTitle')}
          </Button>
        </Box>
      )}
    </>
  );
};
export default ChallengesListPageHeroCard;
