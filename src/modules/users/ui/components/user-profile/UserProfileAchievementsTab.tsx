import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import {
  Card,
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
import { useTheme } from '@mui/material/styles';
import { useUserAchievements, useUserCompetitionPrizes } from '../../../application/queries';
import {
  UserAchievement,
  UserCompetitionPrize,
} from '../../../domain/entities/user-profile.entity';
import KepIcon from 'shared/components/base/KepIcon';
import { KepIconName } from 'shared/config/icons';

type FilterKey = 'completed' | 'notCompleted' | 'all';

const filterAchievements = (achievements: UserAchievement[], filter: FilterKey) => {
  if (filter === 'completed') {
    return achievements.filter((item) => item.userResult?.done);
  }
  if (filter === 'notCompleted') {
    return achievements.filter((item) => !item.userResult?.done);
  }
  return achievements;
};

const formatPrize = (prize: UserCompetitionPrize) => {
  if (prize.prizeType === 'MONEY') {
    return prize.moneyValue ? `${prize.moneyValue} ${prize.currency}` : prize.currency;
  }
  if (prize.prizeType === 'KEPCOIN') {
    return `${prize.kepcoinValue ?? 0} Kepcoin`;
  }
  if (prize.prizeType === 'TELEGRAM_PREMIUM') {
    return `${prize.telegramPremiumPeriod ?? 0} mo Telegram`;
  }
  return prize.note || prize.prizeTitle;
};

const UserProfileAchievementsTab = () => {
  const { t } = useTranslation();
  const { username = '' } = useParams();
  const theme = useTheme();
  const [filter, setFilter] = useState<FilterKey>('completed');

  const { data: achievements, isLoading } = useUserAchievements(username);
  const { data: prizes, isLoading: isPrizesLoading } = useUserCompetitionPrizes(username);

  const filtered = useMemo(
    () => filterAchievements(achievements ?? [], filter),
    [achievements, filter],
  );

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
            >
              <Typography variant="h6" fontWeight={700}>
                {t('users.profile.achievements.title')}
              </Typography>
              <ToggleButtonGroup
                exclusive
                size="small"
                value={filter}
                onChange={(_, value) => value && setFilter(value)}
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

            {isLoading ? (
              <Grid container spacing={2}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <Grid key={index} size={{ xs: 12, md: 6, lg: 3 }}>
                    <Skeleton variant="rectangular" height={140} />
                  </Grid>
                ))}
              </Grid>
            ) : filtered.length ? (
              <Grid container spacing={2}>
                {filtered.map((item) => {
                  const progress =
                    item.totalProgress && item.userResult
                      ? Math.min(
                          100,
                          Math.round(((item.userResult.progress ?? 0) / item.totalProgress) * 100),
                        )
                      : 0;
                  const tone: { color: 'primary' | 'warning' | 'success' | 'info'; icon: KepIconName } = (() => {
                    if (item.type === 2) return { color: 'warning', icon: 'streak' as KepIconName };
                    if (item.type === 4) return { color: 'info', icon: 'challenges' as KepIconName };
                    if (item.type === 5) return { color: 'success', icon: 'contest' as KepIconName };
                    return { color: 'primary', icon: 'problems' as KepIconName };
                  })();
                  return (
                    <Grid key={item.id} size={{ xs: 12, md: 6, lg: 3 }}>
                      <Card
                        variant="outlined"
                        sx={{
                          height: '100%',
                          borderRadius: 3,
                          background: (themeParam) =>
                            `linear-gradient(135deg, ${themeParam.vars.palette[tone.color].light}12, ${themeParam.vars.palette[tone.color].main}0f)`,
                        }}
                      >
                        <CardContent>
                          <Stack direction="column" spacing={1.25}>
                            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                              <Stack direction="row" spacing={1} alignItems="center">
                                <KepIcon name={tone.icon} fontSize={22} color={`${tone.color}.main`} />
                                <Typography variant="subtitle1" fontWeight={800}>
                                  {item.title}
                                </Typography>
                              </Stack>
                              <Chip
                                size="small"
                                label={`${item.userResult?.progress ?? 0}/${item.totalProgress}`}
                                color={item.userResult?.done ? 'success' : 'default'}
                                variant="outlined"
                              />
                            </Stack>

                            <Typography variant="body2" color="text.secondary">
                              {item.description}
                            </Typography>

                            <Stack direction="row" spacing={1} alignItems="center">
                              <Chip
                                size="small"
                                color={item.userResult?.done ? 'success' : 'warning'}
                                label={
                                  item.userResult?.done
                                    ? t('users.profile.achievements.completed')
                                    : t('users.profile.achievements.notCompleted')
                                }
                              />
                              <Typography variant="body2" color="text.secondary">
                                {progress}%
                              </Typography>
                            </Stack>

                            <LinearProgress
                              variant="determinate"
                              value={progress}
                              sx={{
                                height: 8,
                                borderRadius: 999,
                                bgcolor: 'background.neutral',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: theme.vars.palette[tone.color].main,
                                },
                              }}
                            />
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('users.profile.achievements.empty')}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Stack direction="column" spacing={1.5}>
            <Typography variant="h6" fontWeight={700}>
              {t('users.profile.prizes.title')}
            </Typography>

            {isPrizesLoading ? (
              <Skeleton variant="rectangular" height={100} />
            ) : prizes?.length ? (
              <Grid container spacing={1.5}>
                {prizes.map((prize) => {
                  const prizeTone: { icon: KepIconName; color: 'primary' | 'success' | 'warning' | 'info' } =
                    prize.prizeType === 'KEPCOIN'
                      ? { icon: 'rating', color: 'warning' }
                      : prize.prizeType === 'TELEGRAM_PREMIUM'
                        ? { icon: 'challenge', color: 'info' }
                        : prize.prizeType === 'MERCH'
                          ? { icon: 'shop', color: 'primary' }
                          : { icon: 'rating', color: 'success' };

                  return (
                    <Grid key={`${prize.competitionId}-${prize.prizeTitle}`} size={{ xs: 12, md: 6, lg: 4 }}>
                      <Card
                        variant="outlined"
                        sx={{
                          height: '100%',
                          borderRadius: 3,
                          background: (themeParam) =>
                            `linear-gradient(135deg, ${themeParam.vars.palette[prizeTone.color].light}12, ${themeParam.vars.palette[prizeTone.color].main}0f)`,
                        }}
                      >
                        <CardContent>
                          <Stack direction="column" spacing={1}>
                            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                              <Stack direction="row" spacing={1} alignItems="center">
                                <KepIcon name={prizeTone.icon} fontSize={20} color={`${prizeTone.color}.main`} />
                                <Typography variant="subtitle2" fontWeight={700}>
                                  {prize.prizeTitle}
                                </Typography>
                              </Stack>
                              <Chip label={prize.competitionType} size="small" />
                            </Stack>

                            <Typography variant="body2" color="text.secondary">
                              {prize.competitionTitle}
                            </Typography>
                            <Typography variant="body2" fontWeight={700}>
                              {formatPrize(prize)}
                            </Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('users.profile.prizes.empty')}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default UserProfileAchievementsTab;
