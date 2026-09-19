import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useParams } from 'react-router';
import { Icon } from '@iconify/react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  ButtonBase,
  Chip,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceById, resources } from 'app/routes/resources';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import { useGiveawayExperience } from '../../../application/mutations';
import { useGiveaway } from '../../../application/queries';
import { remainingSeconds } from '../../../domain/utils/roulette';
import Participants from './components/Participants';
import Roulette from './components/Roulette';
import './giveaway.css';

function GiveawayExperience({ id, username }: { id: string; username: string }) {
  const { t, i18n } = useTranslation();
  const { data, error, mutate } = useGiveaway(id, username);
  const experience = useGiveawayExperience(id, data, mutate);
  const [now, setNow] = useState(Date.now());
  useDocumentTitle('giveaways.pageTitle');
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, []);

  if (!data && error)
    return (
      <Alert
        severity="error"
        action={<Button onClick={() => void mutate()}>{t('giveaways.retry')}</Button>}
      >
        {t('giveaways.loadError')}
      </Alert>
    );
  if (!data)
    return (
      <Stack gap={3} sx={{ p: 3 }}>
        <Skeleton variant="rounded" height={160} />
        <Skeleton variant="rounded" height={420} />
      </Stack>
    );
  const playing = Boolean(experience.animation && !experience.animationFinished);
  const reveal =
    data.status === 'finished' &&
    !playing &&
    (data.animationSeen || experience.animationFinished || !data.winner);
  const seconds = remainingSeconds(data.scheduledAt, now + data.serverOffsetMs);
  const duration = [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60];
  const icon = {
    TELEGRAM_PREMIUM: 'mdi:telegram',
    MONEY: 'solar:wallet-money-bold-duotone',
    KEPCOIN: 'solar:coins-bold-duotone',
    CUSTOM: 'solar:gift-bold-duotone',
  }[data.prizeType];
  const locale = i18n.language.startsWith('uz')
    ? 'uz-UZ'
    : i18n.language.startsWith('ru')
      ? 'ru-RU'
      : 'en-US';
  const prizeDetail =
    data.prizeType === 'TELEGRAM_PREMIUM'
      ? t('giveaways.months', { count: data.premiumMonths ?? 3 })
      : data.amount
        ? `${data.amount.toLocaleString(locale)} ${data.prizeType === 'MONEY' ? t('giveaways.uzs') : 'Kepcoin'}`
        : t('giveaways.specialGift');
  const sourceLink = data.contest
    ? getResourceById(resources.Contest, data.contest)
    : data.arena
      ? getResourceById(resources.ArenaTournament, data.arena)
      : null;

  return (
    <Box className="giveaway-page" sx={{ p: { xs: 2, sm: 3, lg: 5 }, color: 'text.primary' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: 30, md: 46 },
            lineHeight: 1.15,
            fontWeight: 850,
            letterSpacing: '-0.04em',
            mb: 1.5,
          }}
        >
          {data.title}
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          gap={1.5}
          alignItems={{ sm: 'center' }}
          sx={{ mb: 4 }}
        >
          <Typography variant="body2" color="text.secondary">
            {new Date(data.scheduledAt).toLocaleString(locale, {
              dateStyle: 'long',
              timeStyle: 'short',
            })}
          </Typography>
          {sourceLink && (
            <Button component={RouterLink} to={sourceLink} size="small">
              {t('giveaways.viewCompetition')} ↗
            </Button>
          )}
        </Stack>
        {(experience.actionError || error) && (
          <Alert
            sx={{ mb: 2 }}
            severity="warning"
            action={<Button onClick={experience.retry}>{t('giveaways.retry')}</Button>}
          >
            {t('giveaways.connectionError')}
          </Alert>
        )}

        <Box className="giveaway-panel giveaway-stage" sx={{ mb: 3 }}>
          <Box className="giveaway-orb" aria-hidden="true" />
          <Box sx={{ position: 'relative', textAlign: 'center', pt: { xs: 4, md: 5 }, px: 2 }}>
            <Box className="giveaway-prize-icon">
              {data.prizeImage ? (
                <Box
                  component="img"
                  src={data.prizeImage}
                  alt={data.prizeTitle}
                  sx={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 4 }}
                />
              ) : (
                <Icon icon={icon} width={62} />
              )}
            </Box>
            <Typography component="h2" sx={{ fontSize: { xs: 24, md: 34 }, fontWeight: 800 }}>
              {data.prizeTitle}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {prizeDetail}
            </Typography>
            {!reveal && data.description && (
              <Typography
                sx={{ maxWidth: 580, mx: 'auto', mt: 2, whiteSpace: 'pre-wrap' }}
                color="text.secondary"
                variant="body2"
              >
                {data.description}
              </Typography>
            )}
          </Box>

          {!reveal && (
            <>
              <Box sx={{ textAlign: 'center', mt: 4, mb: 2 }} aria-live="polite">
                {(playing || seconds === 0) && (
                  <Typography variant="body2" color="text.secondary">
                    {t(playing ? 'giveaways.spinning' : 'giveaways.selecting')}
                  </Typography>
                )}
                {!playing && seconds > 0 && (
                  <Box className="giveaway-countdown">
                    {duration.map((value, index) => (
                      <span key={index}>
                        {index > 0 && <b>:</b>}
                        {String(value).padStart(2, '0')}
                      </span>
                    ))}
                  </Box>
                )}
              </Box>
              <Roulette
                data={experience.animation ?? data}
                playing={playing}
                onComplete={experience.finishAnimation}
              />
            </>
          )}

          {reveal && (
            <Box className="giveaway-result" aria-live="polite">
              {data.winner ? (
                <>
                  {experience.animationFinished && (
                    <Box className="giveaway-confetti" aria-hidden="true">
                      {Array.from({ length: 32 }, (_, i) => (
                        <i
                          key={i}
                          style={{
                            left: `${(i * 37) % 100}%`,
                            background: ['#a78bfa', '#fbbf24', '#34d399', '#60a5fa'][i % 4],
                            animationDelay: `${(i % 8) * 0.12}s`,
                            transform: `rotate(${i * 23}deg)`,
                          }}
                        />
                      ))}
                    </Box>
                  )}
                  <Typography className="giveaway-eyebrow" color="primary.main">
                    {t('giveaways.winner')}
                  </Typography>
                  <Avatar
                    sx={{
                      width: 76,
                      height: 76,
                      mx: 'auto',
                      my: 2,
                      bgcolor: 'primary.main',
                      fontSize: 28,
                    }}
                  >
                    {data.winner.username.slice(0, 2).toUpperCase()}
                  </Avatar>
                  <Typography
                    component="h2"
                    sx={{ fontSize: { xs: 28, md: 40 }, fontWeight: 850, overflowWrap: 'anywhere' }}
                  >
                    <UserPopover username={data.winner.username}>
                      <ButtonBase
                        sx={{
                          font: 'inherit',
                          color: 'inherit',
                          overflowWrap: 'anywhere',
                          borderRadius: 1,
                        }}
                      >
                        {data.winner.username}
                      </ButtonBase>
                    </UserPopover>
                  </Typography>
                  <Typography sx={{ mt: 1, mb: 2 }} color="text.secondary">
                    {t(
                      data.winner.username === username
                        ? 'giveaways.youWon'
                        : 'giveaways.congratulations',
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    {t(data.delivered ? 'giveaways.delivered' : 'giveaways.deliveryPending')}
                  </Typography>
                </>
              ) : (
                <>
                  <Icon icon="solar:gift-linear" width={48} />
                  <Typography variant="h5" sx={{ mt: 2 }}>
                    {t('giveaways.noWinner')}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    {t('giveaways.noWinnerDescription')}
                  </Typography>
                </>
              )}
            </Box>
          )}

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="center"
            alignItems="center"
            gap={1.5}
            sx={{ px: 2, py: 3 }}
          >
            <Chip
              variant="soft"
              icon={<Icon icon="solar:users-group-rounded-linear" />}
              label={t('giveaways.entryCount', { count: data.participants.length })}
            />
            <Chip
              color={data.isEntered ? 'success' : 'default'}
              variant="soft"
              label={t(
                data.isEntered
                  ? 'giveaways.entered'
                  : data.status === 'finished'
                    ? 'giveaways.notEntered'
                    : data.isCandidate
                      ? 'giveaways.joining'
                      : 'giveaways.spectator',
              )}
            />
          </Stack>
        </Box>
        {reveal && <Participants users={data.participants} username={username} />}
        <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} sx={{ py: 3, px: 1 }}>
          <Icon icon="solar:shield-check-linear" width={24} />
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 880 }}>
            {t('giveaways.rules')}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}

export default function GiveawayPage() {
  const { id = '' } = useParams();
  const { currentUser } = useAuth();
  if (!currentUser) return null;
  return (
    <GiveawayExperience
      key={`${id}:${currentUser.username}`}
      id={id}
      username={currentUser.username}
    />
  );
}
