import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Button, Card, Stack, Typography } from '@mui/material';
import { resources } from 'app/routes/resources';
import { ChallengeRatingRow } from 'modules/challenges/domain';
import KepIcon from 'shared/components/base/KepIcon';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip.tsx';

type ChallengesListPageHeroCardProps = {
  userRating?: ChallengeRatingRow | null;
  onOpenQuickStart: () => void;
};

const ChallengesListPageHeroCard = ({
  userRating,
  onOpenQuickStart,
}: ChallengesListPageHeroCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        borderRadius: 4,
        p: { xs: 2.5, md: 3 },
        background: 'linear-gradient(120deg, rgba(25,118,210,0.08), rgba(0,171,85,0.12))',
        border: '1px solid',
        borderColor: 'primary.lighter',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={3}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
      >
        <Stack spacing={1.5} direction="column">
          <Stack direction="row" spacing={1} alignItems="center">
            <KepIcon name="challenges" fontSize={30} color="primary.main" />
            <Typography variant="h4" fontWeight={800}>
              {t('challenges.title')}
            </Typography>
          </Stack>
          <Typography variant="body1" color="text.secondary">
            {t('challenges.subtitle')}
          </Typography>
        </Stack>

        <Stack spacing={1.5} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button
              variant="text"
              startIcon={<KepIcon name="challenge-time" fontSize={18} />}
              onClick={onOpenQuickStart}
            >
              {t('challenges.quickStartTitle')}
            </Button>
            <Button
              variant="text"
              startIcon={<KepIcon name="ranking" fontSize={18} />}
              onClick={() => navigate(resources.ChallengesRating)}
            >
              {t('challenges.viewRating')}
            </Button>
            <Button
              variant="text"
              startIcon={<KepIcon name="statistics" fontSize={18} />}
              onClick={() => navigate(resources.ChallengesUserStatistics)}
            >
              {t('challenges.statisticsTitle')}
            </Button>
          </Stack>

          {userRating ? (
            <Stack
              direction="row"
              spacing={1}
              justifyContent="flex-end"
              alignItems="center"
              flexWrap="wrap"
              useFlexGap
            >
              <Typography variant="h3" fontWeight={800}>
                {userRating.rating}
              </Typography>
              <ChallengesRatingChip title={userRating.rankTitle} />
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Typography color="success">{userRating.wins}W</Typography>
                <Typography color="text.secondary">{userRating.draws}D</Typography>
                <Typography color="error">{userRating.losses}L</Typography>
              </Stack>
            </Stack>
          ) : null}
        </Stack>
      </Stack>
    </Card>
  );
};

export default ChallengesListPageHeroCard;
