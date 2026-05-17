import { Box, Card, CardContent, Chip, LinearProgress, Stack, Switch, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { formatDateTime } from 'shared/lib/dateTime';
import { cssVarRgba } from 'shared/lib/utils.ts';

type Props = {
  ready: boolean;
  readyUntil?: string | null;
  loading?: boolean;
  onToggle: (value: boolean) => void;
};

const formatReadyUntil = (value?: string | null) => {
  if (!value) return null;

  return formatDateTime(value, 'compactDateTime', '') || null;
};

const DuelReadyStatusCard = ({ ready, readyUntil, loading, onToggle }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const formattedReadyUntil = formatReadyUntil(readyUntil);

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 4,
        border: '1px solid',
        borderColor: ready ? 'success.main' : 'divider',
        background: ready
          ? `linear-gradient(145deg, ${cssVarRgba(theme.vars.palette.success.mainChannel, 0.16)}, ${cssVarRgba(theme.vars.palette.background.paperChannel, 0.92)})`
          : `linear-gradient(145deg, ${cssVarRgba(theme.vars.palette.warning.mainChannel, 0.12)}, ${cssVarRgba(theme.vars.palette.background.paperChannel, 0.96)})`,
      }}
    >
      {loading ? <LinearProgress /> : null}
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2.5,
                  display: 'grid',
                  placeItems: 'center',
                  backgroundColor: ready
                    ? cssVarRgba(theme.vars.palette.success.mainChannel, 0.16)
                    : cssVarRgba(theme.vars.palette.warning.mainChannel, 0.16),
                }}
              >
                <IconifyIcon
                  icon={ready ? 'mdi:shield-sword' : 'mdi:shield-off-outline'}
                  sx={{
                    fontSize: 22,
                    color: ready ? 'success.main' : 'warning.main',
                  }}
                />
              </Box>
              <Stack spacing={0.5}>
                <Typography variant="h6" fontWeight={800}>
                  {t('duels.readyStatusTitle')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {ready && formattedReadyUntil
                    ? t('duels.readyUntilLabel', { time: formattedReadyUntil })
                    : ready
                      ? t('duels.notReadyDescription')
                      : t('duels.readyDescription')}
                </Typography>
              </Stack>
            </Stack>
            <Chip
              label={ready ? t('duels.ready') : t('duels.notReady')}
              color={ready ? 'success' : 'warning'}
              variant="filled"
              sx={{ textTransform: 'uppercase', fontWeight: 800 }}
            />
          </Stack>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            spacing={1.5}
          >
            <Stack spacing={0.25}>
              <Typography variant="body2" fontWeight={700}>
                {t('duels.readyAutoReset')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('duels.readyPlayersSubtitle')}
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1.25}>
              <Typography variant="body2" color={ready ? 'text.secondary' : 'text.primary'} fontWeight={700}>
                {t('duels.notReady')}
              </Typography>
              <Switch
                checked={ready}
                onChange={(event) => onToggle(event.target.checked)}
                disabled={loading}
                color="success"
              />
              <Typography variant="body2" color={ready ? 'text.primary' : 'text.secondary'} fontWeight={700}>
                {t('duels.ready')}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DuelReadyStatusCard;
