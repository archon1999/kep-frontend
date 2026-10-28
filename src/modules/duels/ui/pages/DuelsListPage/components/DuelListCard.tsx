import { useTranslation } from 'react-i18next';
import { Box, Button, Skeleton, Stack, Typography } from '@mui/material';
import { contentInsetSx, interactiveContentSx } from 'app/theme/styles/content';
import { Duel } from 'modules/duels/domain';
import DuelParticipant from 'modules/duels/ui/shared/components/DuelParticipant';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import MixedText from 'shared/components/common/MixedText';
import { formatCalendarDateTime } from 'shared/lib/dateTime';

type Props = { duel?: Duel; onView?: () => void; loading?: boolean };
const DuelListCard = ({ duel, onView, loading = false }: Props) => {
  const { t } = useTranslation();
  const status = duel?.status ?? 1;
  const first = duel?.playerFirst.balls ?? 0,
    second = duel?.playerSecond?.balls ?? 0;
  const scoreColor = (score: number, other: number) =>
    !duel?.playerSecond || first === second || status === -1
      ? 'text.primary'
      : score > other
        ? 'success.main'
        : 'error.main';
  const statusKey =
    status === 0
      ? 'duels.status.running'
      : status === -1
        ? 'duels.status.upcoming'
        : 'duels.status.finished';
  return (
    <Box
      component="article"
      className="kep-duel-list-row"
      aria-busy={loading}
      sx={{
        ...contentInsetSx,
        ...interactiveContentSx,
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
        height: '100%',
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        sx={{ minHeight: 20 }}
      >
        {loading ? (
          <Skeleton width={96} height={20} />
        ) : (
          <Typography variant="label" color="text.secondary">
            {t('duels.duelNumber', { id: duel?.id })}
          </Typography>
        )}
        {loading ? (
          <Skeleton width={72} height={20} />
        ) : (
          <Stack
            direction="row"
            gap={0.75}
            alignItems="center"
            sx={{
              color:
                status === 0 ? 'success.main' : status === -1 ? 'primary.main' : 'text.secondary',
            }}
          >
            <IconifyIcon
              icon={
                status === 1
                  ? 'mdi:check-circle-outline'
                  : status === 0
                    ? 'mdi:circle-small'
                    : 'mdi:clock-outline'
              }
              sx={{ fontSize: 15 }}
            />
            <Typography variant="caption">{t(statusKey)}</Typography>
          </Stack>
        )}
      </Stack>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) auto minmax(0,1fr)',
          gap: { xs: 1, sm: 2 },
          alignItems: 'center',
          minHeight: 60,
        }}
      >
        {loading ? (
          <Skeleton width="85%" height={48} />
        ) : (
          duel && <DuelParticipant player={duel.playerFirst} hideAvatarOnMobile />
        )}
        <Stack gap={0.5} alignItems="center" sx={{ minWidth: { xs: 82, sm: 112 } }}>
          <Stack direction="row" gap={0.75} alignItems="baseline">
            {loading ? (
              <Skeleton width={90} height={36} />
            ) : (
              <>
                <Typography
                  variant="metric"
                  color={scoreColor(first, second)}
                  sx={{ fontSize: { xs: 25, sm: 30 } }}
                >
                  {status === -1 ? '—' : first}
                </Typography>
                <Typography component="span" color="text.disabled" sx={{ fontSize: 16 }}>
                  :
                </Typography>
                <Typography
                  variant="metric"
                  color={scoreColor(second, first)}
                  sx={{ fontSize: { xs: 25, sm: 30 } }}
                >
                  {status === -1 ? '—' : second}
                </Typography>
              </>
            )}
          </Stack>
          <Typography
            variant="label"
            color="text.secondary"
            sx={{ fontSize: 10, letterSpacing: '.08em' }}
          >
            {t('duels.points')}
          </Typography>
        </Stack>
        <Box sx={{ display: 'flex', minWidth: 0, justifyContent: 'flex-end' }}>
          {loading ? (
            <Skeleton width="85%" height={48} />
          ) : duel?.playerSecond ? (
            <DuelParticipant player={duel.playerSecond} align="end" hideAvatarOnMobile />
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('duels.noOpponent')}
            </Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ minHeight: 42 }}>
        {loading ? (
          <>
            <Skeleton width="70%" height={22} />
            <Skeleton width="45%" height={18} />
          </>
        ) : (
          <>
            <Typography
              component="h3"
              sx={{
                fontFamily: 'var(--kep-display-font)',
                fontSize: 18,
                lineHeight: 1.35,
                fontWeight: 500,
                overflowWrap: 'anywhere',
              }}
            >
              <MixedText>{duel?.preset?.title ?? t('duels.title')}</MixedText>
            </Typography>
            {duel?.duelType?.title && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mt: 0.5 }}
              >
                {duel.duelType.title}
              </Typography>
            )}
          </>
        )}
      </Box>
      <Stack
        direction="row"
        gap={1.5}
        alignItems="center"
        justifyContent="space-between"
        sx={{ mt: 'auto', pt: 2, borderTop: '1px solid var(--kep-line)' }}
      >
        {loading ? (
          <Skeleton width={145} height={20} />
        ) : (
          <Stack
            direction="row"
            gap={0.75}
            alignItems="center"
            sx={{ minWidth: 0, color: 'text.secondary' }}
          >
            <IconifyIcon icon="mdi:calendar-outline" sx={{ fontSize: 16, flexShrink: 0 }} />
            <Typography variant="caption" sx={{ fontVariantNumeric: 'tabular-nums' }}>
              {duel?.startTime ? formatCalendarDateTime(duel.startTime, duel.startTime) : '—'}
            </Typography>
          </Stack>
        )}
        <Button
          variant={status === 0 ? 'contained' : 'outlined'}
          size="small"
          disabled={loading}
          onClick={onView}
          endIcon={<IconifyIcon icon="mdi:arrow-right" />}
          sx={{ flexShrink: 0 }}
        >
          {t('duels.viewDuel')}
        </Button>
      </Stack>
    </Box>
  );
};
export const DuelListCardSkeleton = () => <DuelListCard loading />;
export default DuelListCard;
