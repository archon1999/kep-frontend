import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Alert, Box, Button, LinearProgress, Skeleton, Stack, Typography } from '@mui/material';
import { contentGridSx, contentHeadingSx, contentInsetSx } from 'app/theme/styles/content';
import { useUserAchievements } from 'modules/users/application/queries';
import { UserAchievement } from 'modules/users/domain/entities/user-profile.entity';
import KepIcon from 'shared/components/base/KepIcon';
import MixedText from 'shared/components/common/MixedText';
import ResponsiveTabs from 'shared/components/common/ResponsiveTabs';
import SectionHeader from 'shared/components/sections/common/SectionHeader';
import { KepIconName } from 'shared/config/icons';

type FilterKey = 'completed' | 'notCompleted' | 'all';
type AchievementTone = {
  color: 'primary' | 'secondary' | 'warning' | 'success' | 'info';
  icon: KepIconName;
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

const getAchievementProgress = (item: UserAchievement) => {
  const total = Math.max(0, Number(item.totalProgress) || 0);
  const rawCurrent = Math.max(0, Number(item.userResult?.progress) || 0);
  const current = total > 0 ? Math.min(rawCurrent, total) : rawCurrent;
  const percentage = item.userResult?.done
    ? 100
    : total > 0
      ? Math.min(100, Math.round((current / total) * 100))
      : 0;

  return { current, total, percentage };
};

const getAchievementTone = (item: UserAchievement): AchievementTone => {
  if (item.type === 2) return { color: 'warning', icon: 'streak' };
  if (item.type === 4) return { color: 'info', icon: 'challenges' };
  if (item.type === 5) return { color: 'success', icon: 'contest' };
  return { color: 'primary', icon: 'problems' };
};

const UserProfileAchievementsTab = ({ showTitle = true }: { showTitle?: boolean }) => {
  const { t } = useTranslation();
  const { username = '' } = useParams();
  const [filter, setFilter] = useState<FilterKey>('completed');
  const achievementsQuery = useUserAchievements(username);
  const filtered = filterAchievements(achievementsQuery.data ?? [], filter);
  return (
    <Box>
      {showTitle && <SectionHeader title={t('users.profile.achievements.title')} />}
      <Box
        sx={{ ...contentInsetSx, py: { xs: 1.5, md: 0 }, borderBottom: 1, borderColor: 'divider' }}
      >
        <ResponsiveTabs
          value={filter}
          onChange={(value) => setFilter(value as FilterKey)}
          items={(['completed', 'notCompleted', 'all'] as const).map((value) => ({
            value,
            label: t(`users.profile.achievements.${value}`),
          }))}
          ariaLabel={t('users.profile.achievements.title')}
        />
      </Box>
      {achievementsQuery.isLoading ? (
        <Box sx={contentInsetSx}>
          <Skeleton height={180} />
        </Box>
      ) : achievementsQuery.error ? (
        <Box sx={contentInsetSx}>
          <Alert
            severity="error"
            action={<Button onClick={() => achievementsQuery.mutate()}>{t('common.retry')}</Button>}
          >
            {t('common.loadFailed')}
          </Alert>
        </Box>
      ) : filtered.length ? (
        <Box
          sx={{
            ...contentGridSx,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'repeat(3, minmax(0, 1fr))',
            },
          }}
        >
          {filtered.map((item) => {
            const tone = getAchievementTone(item);
            const progress = getAchievementProgress(item);
            return (
              <Box
                component="article"
                key={item.id}
                sx={{ ...contentInsetSx, display: 'flex', flexDirection: 'column', gap: 2 }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <KepIcon
                    name={tone.icon}
                    fontSize={28}
                    color={item.userResult.done ? 'primary.main' : 'text.secondary'}
                  />
                  <Typography
                    variant="metric"
                    sx={{
                      fontSize: 24,
                      color: item.userResult.done ? 'primary.main' : 'text.secondary',
                    }}
                  >
                    {progress.percentage}%
                  </Typography>
                </Stack>
                <Typography component="h3" sx={{ ...contentHeadingSx, fontSize: 20 }}>
                  <MixedText>{item.title}</MixedText>
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ flex: 1, lineHeight: 1.7 }}
                >
                  {item.description}
                </Typography>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {progress.current} / {progress.total}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={progress.percentage}
                    aria-label={item.title}
                    sx={{ mt: 1, height: 3, borderRadius: 0 }}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Typography color="text.secondary" sx={contentInsetSx}>
          {t('users.profile.achievements.empty')}
        </Typography>
      )}
    </Box>
  );
};

export default UserProfileAchievementsTab;
