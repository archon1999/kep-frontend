import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { ContestDetail } from 'modules/contests/domain/entities/contest-detail.entity';
import {
  contestHasBalls,
  contestHasPenalties,
  getContestTypeTitle,
} from 'modules/contests/ui/shared/utils/contestType';
import KepIcon from 'shared/components/base/KepIcon';
import { KepIconName } from 'shared/config/icons';

interface ContestTypeInfoCardProps {
  contest: ContestDetail;
}

const Description = ({ html }: { html?: string | null }) =>
  html ? (
    <Typography
      component="div"
      variant="body2"
      color="text.secondary"
      dangerouslySetInnerHTML={{ __html: html }}
      sx={{ '& p': { m: 0 } }}
    />
  ) : null;

const DetailRow = ({
  icon,
  title,
  value,
}: {
  icon: KepIconName;
  title: ReactNode;
  value: ReactNode;
}) => (
  <Stack direction="row" spacing={1.25} alignItems="center">
    <KepIcon name={icon} fontSize={18} />
    <Stack direction="column" spacing={0.25} minWidth={0}>
      <Typography variant="caption" fontWeight={500}>
        {title}
      </Typography>
      <Typography variant="body2" fontWeight={700}>
        {value}
      </Typography>
    </Stack>
  </Stack>
);

const ContestTypeInfoCard = ({ contest }: ContestTypeInfoCardProps) => {
  const { t } = useTranslation();
  const hasBalls = contestHasBalls(contest.type, contest.typeInfo);
  const hasPenalties = contestHasPenalties(contest.type, contest.typeInfo);
  const typeTitle = getContestTypeTitle(contest.type, contest.typeInfo);
  const scoringLabel = hasBalls
    ? t('contests.typeInfo.scoringBalls')
    : t('contests.typeInfo.scoringAcm');
  const penaltyLabel = hasPenalties
    ? t('contests.typeInfo.penaltyEnabled')
    : t('contests.typeInfo.penaltyDisabled');

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack spacing={1.5}>
          <DetailRow icon="competition" title={t('contests.typeInfo.title')} value={typeTitle} />
          <Divider sx={{ borderStyle: 'dashed' }} />
          <DetailRow
            icon="problems"
            title={t('contests.typeInfo.scoringTitle')}
            value={scoringLabel}
          />
          <Divider sx={{ borderStyle: 'dashed' }} />
          <DetailRow
            icon="rating"
            title={t('contests.typeInfo.penaltyTitle')}
            value={penaltyLabel}
          />
          <Description html={contest.typeInfo?.description} />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ContestTypeInfoCard;
