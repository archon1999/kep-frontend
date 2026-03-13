import { Card, CardContent, Chip, LinearProgress, Stack, Switch, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

type Props = {
  ready: boolean;
  loading?: boolean;
  onToggle: (value: boolean) => void;
};

const DuelReadyStatusCard = ({ ready, loading, onToggle }: Props) => {
  const { t } = useTranslation();

  return (
    <Card>
      {loading ? <LinearProgress /> : null}
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} flexWrap="wrap">
          <Stack spacing={0.5}>
            <Typography variant="h6" fontWeight={800}>
              {t('duels.readyStatusTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {ready ? t('duels.notReadyDescription') : t('duels.readyDescription')}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Chip
              label={ready ? t('duels.ready') : t('duels.notReady')}
              color={ready ? 'success' : 'warning'}
              variant="filled"
              sx={{ textTransform: 'uppercase', fontWeight: 700 }}
            />
            <Switch
              checked={ready}
              onChange={(event) => onToggle(event.target.checked)}
              disabled={loading}
              color="primary"
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DuelReadyStatusCard;
