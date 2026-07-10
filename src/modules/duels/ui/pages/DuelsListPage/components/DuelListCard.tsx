import { Button, Card, Chip, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Duel, DuelPlayer } from 'modules/duels/domain/index.ts';
import UserPopover from 'modules/users/ui/shared/components/UserPopover.tsx';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip.tsx';
import { formatCalendarDateTime } from 'shared/lib/dateTime';

type Props = {
  duel: Duel;
  onView?: () => void;
};

const formatDate = (value?: string | null) =>
  value ? formatCalendarDateTime(value, value) : '—';

const statusTone = (status: Duel['status']) => {
  if (status === -1) {
    return { color: 'info' as const, label: 'duels.status.upcoming', accent: 'info.main' };
  }
  if (status === 0) {
    return { color: 'success' as const, label: 'duels.status.running', accent: 'success.main' };
  }
  return { color: 'default' as const, label: 'duels.status.finished', accent: 'divider' };
};

const Participant = ({ player }: { player: DuelPlayer }) => {
  const content = (
    <Stack direction="row" spacing={0.75} alignItems="center" minWidth={0}>
      <ContestsRatingChip title={player.ratingTitle} imgSize={20} />
      <Typography variant="subtitle1" fontWeight={700} noWrap>
        {player.displayName || player.username}
      </Typography>
      {player.isBot ? <Chip size="small" label="BOT" color="secondary" variant="outlined" /> : null}
    </Stack>
  );

  return player.isBot ? content : <UserPopover username={player.username}>{content}</UserPopover>;
};

const DuelListCard = ({ duel, onView }: Props) => {
  const { t } = useTranslation();
  const tone = statusTone(duel.status);
  const firstScore = duel.playerFirst.balls ?? 0;
  const secondScore = duel.playerSecond?.balls ?? 0;

  return (
    <Card
      sx={(theme) => ({
        p: { xs: 1.5, sm: 2 },
        borderRadius: 2,
        border: 0,
        borderLeft: '5px solid',
        borderLeftColor: tone.accent,
        bgcolor:
          duel.status === 0
            ? alpha(theme.palette.success.main, 0.06)
            : theme.palette.background.paper,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
        },
      })}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 1.5, md: 2.5 }}
        alignItems={{ xs: 'stretch', md: 'center' }}
        justifyContent="space-between"
      >
        <Stack spacing={1} minWidth={0} flex={1}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Participant player={duel.playerFirst} />
            <Typography variant="caption" color="text.secondary" fontWeight={800}>
              VS
            </Typography>
            {duel.playerSecond ? (
              <Participant player={duel.playerSecond} />
            ) : (
              <Chip size="small" label="BYE" variant="outlined" />
            )}
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Chip size="small" label={t(tone.label)} color={tone.color} variant="outlined" />
            {duel.duelType?.title ? (
              <Chip size="small" label={duel.duelType.title} variant="soft" />
            ) : null}
            {duel.preset?.title ? (
              <Chip size="small" label={duel.preset.title} variant="outlined" />
            ) : null}
            <Stack direction="row" spacing={0.5} alignItems="center">
              <IconifyIcon icon="mdi:calendar-clock" width={16} height={16} color="text.secondary" />
              <Typography variant="caption" color="text.secondary">
                {formatDate(duel.startTime)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={0.75} alignItems="baseline" minWidth={96} justifyContent="center">
            <Typography variant="h5" fontWeight={800} color="primary.main">
              {firstScore}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={700}>
              —
            </Typography>
            <Typography variant="h5" fontWeight={800} color="secondary.main">
              {secondScore}
            </Typography>
          </Stack>
          <Button
            variant={duel.status === 0 ? 'contained' : 'outlined'}
            size="small"
            onClick={onView}
            endIcon={<IconifyIcon icon="mdi:arrow-right" width={16} height={16} />}
          >
            {t('duels.openWorkspace')}
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
};

export default DuelListCard;
