import { Link as RouterLink } from 'react-router-dom';
import { Button, Stack, Typography } from '@mui/material';
import KepIcon from 'shared/components/base/KepIcon';
import StatisticsSection from 'shared/components/statistics/StatisticsSection';
import type { KepIconName } from 'shared/config/icons';

export interface ContestsUserStatisticsPageHighlightCardProps {
  icon: KepIconName;
  label: string;
  valueLabel?: string;
  meta?: string;
  contestTitle?: string;
  contestLink?: string;
}

const ContestsUserStatisticsPageHighlightCard = ({
  icon,
  label,
  valueLabel,
  meta,
  contestTitle,
  contestLink,
}: ContestsUserStatisticsPageHighlightCardProps) => (
  <StatisticsSection>
    <Stack direction="row" spacing={2} alignItems="flex-start">
      <KepIcon name={icon} fontSize={26} className="text-primary" />
      <Stack direction="column" spacing={0.5} flex={1} minWidth={0}>
        <Typography variant="label" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="metric" fontSize={26}>
          {valueLabel ?? '--'}
        </Typography>
        {contestTitle ? (
          contestLink ? (
            <Button
              component={RouterLink}
              to={contestLink}
              size="small"
              variant="text"
              sx={{ px: 0, justifyContent: 'flex-start' }}
            >
              {contestTitle}
            </Button>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {contestTitle}
            </Typography>
          )
        ) : null}
        {meta ? (
          <Typography variant="body2" color="text.secondary">
            {meta}
          </Typography>
        ) : null}
      </Stack>
    </Stack>
  </StatisticsSection>
);

export default ContestsUserStatisticsPageHighlightCard;
