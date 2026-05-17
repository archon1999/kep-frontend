import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useParams } from 'react-router';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Skeleton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { getResourceById, resources } from 'app/routes/resources';
import { useUserAchievements, useUserCompetitionPrizes } from 'modules/users/application/queries';
import {
  UserAchievement,
  UserCompetitionPrize,
  UserCompetitionPrizeCurrency,
} from 'modules/users/domain/entities/user-profile.entity';
import kepcoinImage from 'shared/assets/images/icons/kepcoin.png';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepIcon from 'shared/components/base/KepIcon';
import { KepIconName } from 'shared/config/icons';
import { formatLocalizedNumber } from 'shared/lib/numberFormat';

type FilterKey = 'completed' | 'notCompleted' | 'all';
type ToneColor = 'primary' | 'secondary' | 'warning' | 'success' | 'info';

type AchievementTone = {
  color: ToneColor;
  icon: KepIconName;
};

type PrizePresentation = {
  color: ToneColor;
  icon: string;
  label: string;
  value: string;
  image?: string;
};

const filterAchievements = (achievements: UserAchievement[], filter: FilterKey) => {
  if (filter === 'completed') {
    return achievements.filter((item) => item.userResult?.done);
  }
  if (filter === 'notCompleted') {
    return achievements.filter((item) => !item.userResult?.done);
  }
  return achievements;
};

const formatNumber = (value: number | null | undefined) => {
  if (value === null || value === undefined) return '';

  return formatLocalizedNumber(value, {
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }, 'en-US');
};

const formatMoney = (value: number | null, currency: UserCompetitionPrizeCurrency) => {
  const amount = formatNumber(value);

  if (currency === 'SUM') return amount ? `${amount} so'm` : "so'm";
  if (currency === 'DOLLAR') return amount ? `$${amount}` : '$';
  if (currency === 'TON') return amount ? `${amount} TON` : 'TON';

  return amount || currency;
};

const isTelegramStarsPrize = (prize: UserCompetitionPrize) =>
  prize.prizeType === 'TELEGRAM_STARS' ||
  /telegram\s+stars?|stars?/i.test(`${prize.prizeTitle} ${prize.note}`);

const getAchievementProgress = (item: UserAchievement) => {
  if (item.userResult?.done) return 100;
  if (!item.totalProgress || !item.userResult) return 0;

  return Math.min(100, Math.round(((item.userResult.progress ?? 0) / item.totalProgress) * 100));
};

const getAchievementTone = (item: UserAchievement): AchievementTone => {
  if (item.type === 2) return { color: 'warning', icon: 'streak' };
  if (item.type === 4) return { color: 'info', icon: 'challenges' };
  if (item.type === 5) return { color: 'success', icon: 'contest' };
  return { color: 'primary', icon: 'problems' };
};

const getMoneyPresentation = (
  value: number | null,
  currency: UserCompetitionPrizeCurrency,
): PrizePresentation => {
  if (currency === 'SUM') {
    return {
      color: 'success',
      icon: 'mdi:cash-multiple',
      label: "So'm",
      value: formatMoney(value, currency),
    };
  }

  if (currency === 'DOLLAR') {
    return {
      color: 'success',
      icon: 'mdi:currency-usd-circle-outline',
      label: 'Dollar',
      value: formatMoney(value, currency),
    };
  }

  if (currency === 'TON') {
    return {
      color: 'info',
      icon: 'mdi:diamond-stone',
      label: 'TON',
      value: formatMoney(value, currency),
    };
  }

  return {
    color: 'success',
    icon: 'mdi:cash',
    label: currency,
    value: formatMoney(value, currency),
  };
};

const getPrizePresentation = (prize: UserCompetitionPrize): PrizePresentation => {
  if (isTelegramStarsPrize(prize)) {
    const value = formatNumber(prize.telegramStarsValue);

    return {
      color: 'warning',
      icon: 'mdi:star-four-points-circle-outline',
      label: 'Telegram Stars',
      value: value ? `${value} Stars` : prize.note || prize.prizeTitle,
    };
  }

  if (prize.prizeType === 'MONEY') {
    return getMoneyPresentation(prize.moneyValue, prize.currency);
  }

  if (prize.prizeType === 'KEPCOIN') {
    const value = formatNumber(prize.kepcoinValue);

    return {
      color: 'warning',
      icon: 'mdi:hexagon-multiple-outline',
      image: kepcoinImage,
      label: 'Kepcoin',
      value: value ? `${value} Kepcoin` : 'Kepcoin',
    };
  }

  if (prize.prizeType === 'TELEGRAM_PREMIUM') {
    const period = formatNumber(prize.telegramPremiumPeriod);

    return {
      color: 'info',
      icon: 'mdi:telegram',
      label: 'Telegram Premium',
      value: period ? `${period} mo Premium` : 'Telegram Premium',
    };
  }

  if (prize.prizeType === 'MERCH') {
    return {
      color: 'primary',
      icon: 'mdi:tshirt-crew-outline',
      label: 'Merch',
      value: prize.note || prize.prizeTitle,
    };
  }

  return {
    color: 'secondary',
    icon: 'mdi:gift-outline',
    label: 'Prize',
    value: prize.note || prize.prizeTitle,
  };
};

const getPrizeRoute = (prize: UserCompetitionPrize) => {
  if (prize.competitionType === 'CONTEST') {
    return getResourceById(resources.ContestStandings, prize.competitionId);
  }

  if (prize.competitionType === 'ARENA') {
    return getResourceById(resources.ArenaTournament, prize.competitionId);
  }

  return getResourceById(resources.Tournament, prize.competitionId);
};

const AchievementBadgeCard = ({ item }: { item: UserAchievement }) => {
  const tone = getAchievementTone(item);
  const progress = getAchievementProgress(item);
  const isDone = Boolean(item.userResult?.done);

  return (
    <Card
      variant="outlined"
      sx={(theme) => ({
        height: '100%',
        borderRadius: 3,
        borderColor: alpha(theme.palette[tone.color].main, 0.24),
        opacity: isDone ? 1 : 0.68,
        bgcolor: isDone
          ? alpha(theme.palette.success.main, 0.08)
          : alpha(theme.palette.background.paper, 0.72),
      })}
    >
      <CardContent sx={{ height: '100%', p: 2.25, '&:last-child': { pb: 2.25 } }}>
        <Stack direction="column" spacing={1.5} alignItems="center" textAlign="center">
          <Box
            sx={(theme) => ({
              width: 70,
              height: 70,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              bgcolor: alpha(theme.palette[tone.color].main, 0.14),
              boxShadow: `inset 0 0 0 8px ${alpha(theme.palette[tone.color].main, 0.08)}`,
            })}
          >
            <KepIcon name={tone.icon} fontSize={34} color={`${tone.color}.main`} />
          </Box>

          <Stack direction="column" spacing={0.5} sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={0.75} alignItems="center" justifyContent="center">
              <Chip size="small" variant="outlined" label={`${progress}%`} />
            </Stack>
            <Typography variant="subtitle1" fontWeight={900} sx={{ overflowWrap: 'anywhere' }}>
              {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
              {item.description}
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={progress}
            color={tone.color}
            sx={{ width: 1, height: 7, borderRadius: 1 }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

const PrizeVisual = ({ presentation }: { presentation: PrizePresentation }) => (
  <Box
    sx={(theme) => ({
      width: 64,
      height: 64,
      borderRadius: 1,
      display: 'grid',
      placeItems: 'center',
      bgcolor: alpha(theme.palette[presentation.color].main, 0.12),
      border: '1px solid',
      borderColor: alpha(theme.palette[presentation.color].main, 0.22),
    })}
  >
    {presentation.image ? (
      <Box
        component="img"
        src={presentation.image}
        alt={presentation.label}
        sx={{ width: 40, height: 40, objectFit: 'contain' }}
      />
    ) : (
      <IconifyIcon icon={presentation.icon} fontSize={34} color={`${presentation.color}.main`} />
    )}
  </Box>
);

const PrizeSpotlightCard = ({ prize, index }: { prize: UserCompetitionPrize; index: number }) => {
  const presentation = getPrizePresentation(prize);
  const prizeRoute = getPrizeRoute(prize);

  return (
    <Card
      variant="outlined"
      sx={(theme) => ({
        height: '100%',
        borderRadius: 1,
        borderColor: alpha(theme.palette[presentation.color].main, 0.28),
        background: `linear-gradient(135deg, ${alpha(
          theme.palette[presentation.color].main,
          0.12,
        )}, ${alpha(theme.palette.background.paper, 0.72)})`,
        transition: theme.transitions.create(['border-color', 'box-shadow', 'transform'], {
          duration: theme.transitions.duration.shorter,
        }),
        '&:hover': {
          borderColor: alpha(theme.palette[presentation.color].main, 0.54),
          boxShadow: `0 10px 24px ${alpha(theme.palette[presentation.color].main, 0.16)}`,
          transform: 'translateY(-2px)',
        },
      })}
    >
      <CardActionArea
        component={RouterLink}
        to={prizeRoute}
        sx={{ height: '100%', alignItems: 'stretch' }}
      >
        <CardContent sx={{ width: 1, height: '100%', p: 2, '&:last-child': { pb: 2 } }}>
          <Stack
            direction="column"
            spacing={1.25}
            alignItems="center"
            textAlign="center"
            height="100%"
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="space-between"
              width="100%"
            >
              <Chip
                size="small"
                color={presentation.color}
                variant="outlined"
                label={presentation.label}
              />
              <Chip size="small" variant="outlined" label={`#${index + 1}`} />
            </Stack>

            <PrizeVisual presentation={presentation} />

            <Stack direction="column" spacing={0.5} sx={{ minWidth: 0 }}>
              <Typography variant="h6" fontWeight={900} sx={{ overflowWrap: 'anywhere' }}>
                {presentation.value}
              </Typography>
              <Typography variant="subtitle2" fontWeight={800} sx={{ overflowWrap: 'anywhere' }}>
                {prize.prizeTitle}
              </Typography>
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ overflowWrap: 'anywhere', mt: 'auto' }}
            >
              {prize.competitionTitle}
            </Typography>

            <Chip size="small" label={prize.competitionType} />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

interface UserProfileAchievementsTabProps {
  showTitle?: boolean;
}

const UserProfileAchievementsTab = ({ showTitle = true }: UserProfileAchievementsTabProps) => {
  const { t } = useTranslation();
  const { username = '' } = useParams();
  const [filter, setFilter] = useState<FilterKey>('completed');

  const { data: achievements, isLoading } = useUserAchievements(username);
  const { data: prizes, isLoading: isPrizesLoading } = useUserCompetitionPrizes(username);

  const filtered = useMemo(
    () => filterAchievements(achievements ?? [], filter),
    [achievements, filter],
  );

  const renderAchievements = () => {
    if (isLoading) {
      return (
        <Grid container spacing={1.5}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Skeleton variant="rectangular" height={190} />
            </Grid>
          ))}
        </Grid>
      );
    }

    if (!filtered.length) {
      return (
        <Typography variant="body2" color="text.secondary">
          {t('users.profile.achievements.empty')}
        </Typography>
      );
    }

    return (
      <Grid container spacing={1.5}>
        {filtered.map((item) => (
          <Grid key={item.id} size={{ xs: 12, sm: 6, lg: 4 }}>
            <AchievementBadgeCard item={item} />
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderPrizes = () => {
    if (isPrizesLoading) {
      return (
        <Grid container spacing={1.5}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Skeleton variant="rectangular" height={220} />
            </Grid>
          ))}
        </Grid>
      );
    }

    if (!prizes?.length) {
      return (
        <Typography variant="body2" color="text.secondary">
          {t('users.profile.prizes.empty')}
        </Typography>
      );
    }

    return (
      <Grid container spacing={1.5}>
        {prizes.map((prize, index) => (
          <Grid key={`${prize.competitionId}-${prize.prizeTitle}`} size={{ xs: 12, sm: 6, lg: 4 }}>
            <PrizeSpotlightCard prize={prize} index={index} />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Stack direction="column" spacing={2}>
      <Card variant="outlined">
        <CardContent>
          <Stack direction="column" spacing={2}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              useFlexGap
            >
              {showTitle ? (
                <Typography variant="h6" fontWeight={800}>
                  {t('users.profile.achievements.title')}
                </Typography>
              ) : null}
              <ToggleButtonGroup
                exclusive
                size="small"
                value={filter}
                onChange={(_, value: FilterKey | null) => value && setFilter(value)}
              >
                <ToggleButton value="completed">
                  {t('users.profile.achievements.completed')}
                </ToggleButton>
                <ToggleButton value="notCompleted">
                  {t('users.profile.achievements.notCompleted')}
                </ToggleButton>
                <ToggleButton value="all">{t('users.profile.achievements.all')}</ToggleButton>
              </ToggleButtonGroup>
            </Stack>

            {renderAchievements()}
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Stack direction="column" spacing={1.5}>
            <Typography variant="h6" fontWeight={800}>
              {t('users.profile.prizes.title')}
            </Typography>

            {renderPrizes()}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default UserProfileAchievementsTab;
