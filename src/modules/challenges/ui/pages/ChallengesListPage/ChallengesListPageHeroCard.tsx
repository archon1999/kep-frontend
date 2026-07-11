import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { resources } from 'app/routes/resources';
import { ChallengeRatingRow } from 'modules/challenges/domain';
import KepIcon from 'shared/components/base/KepIcon';
import Logo from 'shared/components/common/Logo';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip.tsx';
import { cssVarRgba } from 'shared/lib/utils';

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
      sx={(theme) => ({
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3,
        bgcolor: 'background.paper',
        background: `linear-gradient(135deg, ${cssVarRgba(theme.vars.palette.primary.lightChannel, 0.08)}, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.06)})`,
      })}
    >
      <CardContent sx={{ position: 'relative', zIndex: 1, p: { xs: 2, sm: 3, md: 4 } }}>
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
      </CardContent>

      <Box
        sx={{
          position: 'absolute',
          display: { xs: 'none', sm: 'block' },
          right: { sm: -48, md: 24 },
          bottom: { sm: -48, md: 8 },
          opacity: 0.08,
          pointerEvents: 'none',
        }}
      >
        <Logo sx={{ width: { sm: 220, md: 280 }, height: { sm: 220, md: 280 } }} />
      </Box>
    </Card>
  );
};

export default ChallengesListPageHeroCard;
