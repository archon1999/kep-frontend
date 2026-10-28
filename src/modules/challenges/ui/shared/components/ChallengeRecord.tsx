import { useTranslation } from 'react-i18next';
import { Stack, Typography } from '@mui/material';

type ChallengeRecordProps = { wins?: number; draws?: number; losses?: number; compact?: boolean };

const ChallengeRecord = ({
  wins = 0,
  draws = 0,
  losses = 0,
  compact = false,
}: ChallengeRecordProps) => {
  const { t, i18n } = useTranslation();
  const results = [
    { key: 'win', value: wins, color: 'success.main' },
    { key: 'draw', value: draws, color: 'text.secondary' },
    { key: 'loss', value: losses, color: 'error.main' },
  ];
  return (
    <Stack direction="row" gap={compact ? 1.5 : 3} flexWrap="wrap" useFlexGap>
      {results.map(({ key, value, color }) => (
        <Stack
          key={key}
          direction={compact ? 'row' : 'column'}
          gap={0.5}
          alignItems={compact ? 'center' : 'flex-start'}
          title={t(`challenges.statisticsPage.results.${key}`)}
        >
          <Typography
            component="span"
            variant="metric"
            color={color}
            sx={{ fontSize: compact ? 16 : 22 }}
          >
            {value.toLocaleString(i18n.language)}
          </Typography>
          <Typography component="span" variant="caption" color="text.secondary">
            {t(
              compact
                ? `challenges.recordLabels.${key}`
                : `challenges.statisticsPage.results.${key}`,
            )}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};
export default ChallengeRecord;
