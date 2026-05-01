import { Card, CardContent, Stack, Typography } from '@mui/material';
import KepIcon from 'shared/components/base/KepIcon';

interface ProblemsUserStatisticsPageOverviewCardProps {
  icon: string;
  label: string;
  value: string;
  subtitle?: string;
}

const ProblemsUserStatisticsPageOverviewCard = ({
  icon,
  label,
  value,
  subtitle,
}: ProblemsUserStatisticsPageOverviewCardProps) => (
  <Card variant="outlined" sx={{ height: '100%' }}>
    <CardContent>
      <Stack direction="row" spacing={2} alignItems="center">
        <KepIcon name={icon as any} fontSize={28} />
        <Stack direction="column" spacing={0.5} flex={1}>
          <Typography variant="subtitle2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h5" fontWeight={800}>
            {value}
          </Typography>
          {subtitle ? (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          ) : null}
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

export default ProblemsUserStatisticsPageOverviewCard;
