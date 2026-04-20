import { Card, CardContent, Stack, Typography } from '@mui/material';

type ChallengesUserStatisticsPageOverviewCardProps = {
  label: string;
  value: string;
  subtitle?: string;
  tone?: 'success' | 'error' | 'primary';
};

const ChallengesUserStatisticsPageOverviewCard = ({
  label,
  value,
  subtitle,
  tone,
}: ChallengesUserStatisticsPageOverviewCardProps) => (
  <Card variant="outlined" sx={{ height: '100%' }}>
    <CardContent>
      <Stack spacing={0.75}>
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
        <Typography
          variant="h4"
          fontWeight={900}
          color={
            tone === 'success'
              ? 'success.main'
              : tone === 'error'
                ? 'error.main'
                : tone === 'primary'
                  ? 'primary.main'
                  : 'text.primary'
          }
        >
          {value}
        </Typography>
        {subtitle ? (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        ) : null}
      </Stack>
    </CardContent>
  </Card>
);

export default ChallengesUserStatisticsPageOverviewCard;
