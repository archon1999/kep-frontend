import { Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ContestDetail } from 'modules/contests/domain/entities/contest-detail.entity';
import {
  contestHasBalls,
  contestHasPenalties,
  getContestTypeTitle,
} from 'modules/contests/utils/contestType';

interface ContestTypeInfoCardProps {
  contest: ContestDetail;
}

const ContestTypeInfoCard = ({ contest }: ContestTypeInfoCardProps) => {
  const { t } = useTranslation();
  const hasBalls = contestHasBalls(contest.type, contest.typeInfo);
  const hasPenalties = contestHasPenalties(contest.type, contest.typeInfo);

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Typography variant="subtitle2" fontWeight={700}>
              {t('contests.typeInfo.title')}
            </Typography>
            <Chip
              label={getContestTypeTitle(contest.type, contest.typeInfo)}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              label={hasBalls ? t('contests.typeInfo.scoringBalls') : t('contests.typeInfo.scoringAcm')}
              size="small"
              color={hasBalls ? 'info' : 'success'}
              variant="soft"
            />
            <Chip
              label={
                hasPenalties
                  ? t('contests.typeInfo.penaltyEnabled')
                  : t('contests.typeInfo.penaltyDisabled')
              }
              size="small"
              color={hasPenalties ? 'warning' : 'default'}
              variant="soft"
            />
          </Stack>

          {contest.typeInfo?.description ? (
            <Typography
              component="div"
              variant="body2"
              color="text.secondary"
              dangerouslySetInnerHTML={{ __html: contest.typeInfo.description }}
              sx={{ '& p': { m: 0 } }}
            />
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ContestTypeInfoCard;
