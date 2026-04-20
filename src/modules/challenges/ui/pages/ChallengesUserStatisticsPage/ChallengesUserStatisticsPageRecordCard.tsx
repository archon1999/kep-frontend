import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

type ChallengesUserStatisticsPageRecordCardProps = {
  title: string;
  value: string;
  subtitle?: string | null;
  href?: string;
  tone?: 'success' | 'error';
};

const ChallengesUserStatisticsPageRecordCard = ({
  title,
  value,
  subtitle,
  href,
  tone,
}: ChallengesUserStatisticsPageRecordCardProps) => (
  <Card variant="outlined" sx={{ height: '100%' }}>
    <CardContent>
      <Stack spacing={1.25}>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
        <Typography
          variant="h6"
          fontWeight={800}
          color={tone === 'success' ? 'success.main' : tone === 'error' ? 'error.main' : 'text.primary'}
        >
          {value}
        </Typography>
        {subtitle ? (
          href ? (
            <Button
              component={RouterLink}
              to={href}
              size="small"
              variant="text"
              sx={{ px: 0, justifyContent: 'flex-start' }}
            >
              {subtitle}
            </Button>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )
        ) : null}
      </Stack>
    </CardContent>
  </Card>
);

export default ChallengesUserStatisticsPageRecordCard;
