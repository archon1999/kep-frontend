import { useTranslation } from 'react-i18next';
import { Stack, Tooltip, Typography } from '@mui/material';

const DuelRecord = ({
  wins = 0,
  losses = 0,
  draws = 0,
}: {
  wins?: number;
  losses?: number;
  draws?: number;
}) => {
  const { t, i18n } = useTranslation();
  return (
    <Stack direction="row" gap={1.5} alignItems="center">
      {[
        { label: 'W', key: 'wins', value: wins, color: 'success.main' },
        { label: 'L', key: 'losses', value: losses, color: 'error.main' },
        { label: 'D', key: 'draws', value: draws, color: 'text.secondary' },
      ].map(({ label, key, value, color }) => (
        <Tooltip key={key} title={t(`duels.table.${key}`)}>
          <Typography
            component="span"
            variant="metric"
            color={color}
            sx={{ fontSize: 15, whiteSpace: 'nowrap' }}
          >
            {label} {value.toLocaleString(i18n.language)}
          </Typography>
        </Tooltip>
      ))}
    </Stack>
  );
};

export default DuelRecord;
