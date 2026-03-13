import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, Box, Button, Chip, Paper, Skeleton, Stack, Tab, Tabs, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { resources } from 'app/routes/resources';
import { useUsersList } from 'modules/users/application/queries';
import { UsersListItem } from 'modules/users/domain/entities/user.entity';
import UserPopover from 'modules/users/ui/components/UserPopover';
import CountryFlagIcon from 'shared/components/common/CountryFlagIcon';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import Streak from 'shared/components/rating/Streak';
import { responsivePagePaddingSx } from 'shared/lib/styles';

const TAB_SWITCH_INTERVAL = 5000;

const tabConfigs = [
  {
    value: 'contests',
    labelKey: 'homePage.topUsers.tabs.contests',
    ordering: '-contests_rating__rating',
    renderValue: (user: UsersListItem, emptyLabel: string) => (
      <Stack direction="row" spacing={1} alignItems="center">
        <ContestsRatingChip title={user.contestsRating?.title} imgSize={26} />
        <Typography variant="subtitle1" fontWeight={700} noWrap>
          {user.contestsRating?.value ?? emptyLabel}
        </Typography>
      </Stack>
    ),
  },
  {
    value: 'skills',
    labelKey: 'homePage.topUsers.tabs.skills',
    ordering: '-skills_rating',
    renderValue: (user: UsersListItem, emptyLabel: string) => (
      <Chip
        size="small"
        label={user.skillsRating?.value ?? emptyLabel}
        variant="soft"
        color="primary"
        sx={{ fontWeight: 700 }}
      />
    ),
  },
  {
    value: 'activity',
    labelKey: 'homePage.topUsers.tabs.activity',
    ordering: '-activity_rating',
    renderValue: (user: UsersListItem, emptyLabel: string) => (
      <Chip
        size="small"
        label={user.activityRating?.value ?? emptyLabel}
        variant="soft"
        color="info"
        sx={{ fontWeight: 700 }}
      />
    ),
  },
  {
    value: 'challenges',
    labelKey: 'homePage.topUsers.tabs.challenges',
    ordering: '-challenges_rating__rating',
    renderValue: (user: UsersListItem, emptyLabel: string) => (
      <Stack direction="row" spacing={1} alignItems="center">
        <ChallengesRatingChip title={user.challengesRating?.title} />
        <Typography variant="subtitle1" fontWeight={700} noWrap>
          {user.challengesRating?.value ?? emptyLabel}
        </Typography>
      </Stack>
    ),
  },
  {
    value: 'streak',
    labelKey: 'homePage.topUsers.tabs.streak',
    ordering: '-streak',
    renderValue: (user: UsersListItem, emptyLabel: string) => (
      <Streak streak={user.streak} maxStreak={user.maxStreak} fallback={emptyLabel} />
    ),
  },
  {
    value: 'kepcoin',
    labelKey: 'homePage.topUsers.tabs.kepcoin',
    ordering: '-kepcoin',
    renderValue: (user: UsersListItem) => (
      <KepcoinValue value={user.kepcoin ?? 0} fontWeight={700} iconSize={22} />
    ),
  },
] as const;

type TabValue = (typeof tabConfigs)[number]['value'];

const TopUsersSection = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabValue>('contests');

  const tabOrder = useMemo(() => tabConfigs.map((tab) => tab.value), []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        const currentIndex = tabOrder.indexOf(prev);
        const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % tabOrder.length : 0;

        return tabOrder[nextIndex];
      });
    }, TAB_SWITCH_INTERVAL);

    return () => clearInterval(interval);
  }, [tabOrder]);

  const contestsParams = useMemo(
    () => ({ page: 1, pageSize: 3, ordering: tabConfigs[0].ordering }),
    [],
  );
  const skillsParams = useMemo(
    () => ({ page: 1, pageSize: 3, ordering: tabConfigs[1].ordering }),
    [],
  );
  const activityParams = useMemo(
    () => ({ page: 1, pageSize: 3, ordering: tabConfigs[2].ordering }),
    [],
  );
  const challengesParams = useMemo(
    () => ({ page: 1, pageSize: 3, ordering: tabConfigs[3].ordering }),
    [],
  );
  const streakParams = useMemo(
    () => ({ page: 1, pageSize: 3, ordering: tabConfigs[4].ordering }),
    [],
  );
  const kepcoinParams = useMemo(
    () => ({ page: 1, pageSize: 3, ordering: tabConfigs[5].ordering }),
    [],
  );

  const contestsQuery = useUsersList(contestsParams);
  const skillsQuery = useUsersList(skillsParams);
  const activityQuery = useUsersList(activityParams);
  const challengesQuery = useUsersList(challengesParams);
  const streakQuery = useUsersList(streakParams);
  const kepcoinQuery = useUsersList(kepcoinParams);

  const tabQueries: Record<TabValue, typeof contestsQuery> = {
    contests: contestsQuery,
    skills: skillsQuery,
    activity: activityQuery,
    challenges: challengesQuery,
    streak: streakQuery,
    kepcoin: kepcoinQuery,
  };

  const activeConfig = tabConfigs.find((tab) => tab.value === activeTab) ?? tabConfigs[0];
  const { data: usersData, isLoading } = tabQueries[activeConfig.value];
  const users = useMemo(() => usersData?.data ?? [], [usersData?.data]);
  const showSkeleton = isLoading && !usersData?.data;
  const emptyLabel = t('users.emptyValue');

  const stripeByRank: Record<number, string> = {
    0: '#FACC15',
    1: '#94A3B8',
    2: '#F97316',
  };

  const renderUserCard = (user: UsersListItem, index: number) => {
    const name = [user.firstName, user.lastName].filter(Boolean).join(' ');
    const countryCode = user.country?.toUpperCase();
    const stripeColor = stripeByRank[index] ?? '#CBD5E1';

    return (
      <Box
        key={user.username}
        sx={{
          position: 'relative',
          borderRadius: 3,
          p: 2.25,
          pl: 3.25,
          bgcolor: 'background.elevation1',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 16,
            bottom: 16,
            width: 4,
            borderRadius: 999,
            bgcolor: stripeColor,
          },
        }}
      >
        <Stack direction="column" spacing={1.5}>
          <Typography variant="h4" fontWeight={8}>
            {index + 1}
          </Typography>

          <Stack direction="row" spacing={1.75} alignItems="center">
            <UserPopover
              username={user.username}
              countryCode={countryCode}
              fullName={name}
              avatar={user.avatar}
              streak={user.streak}
            >
              <Stack direction="row" spacing={1.75} alignItems="center" sx={{ cursor: 'pointer' }}>
                <Avatar src={user.avatar} alt={user.username} sx={{ width: 52, height: 52 }} />
                <Stack direction="column" spacing={0.5} minWidth={0}>
                  <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
                    <Typography variant="subtitle1" fontWeight={700} noWrap>
                      {user.username}
                    </Typography>
                    {countryCode && <CountryFlagIcon code={countryCode} size={18} />}
                  </Stack>
                  {name && (
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {name}
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </UserPopover>
          </Stack>

          <Box
            sx={{
              mt: 0.75,
              minHeight: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            {activeConfig.renderValue(user, emptyLabel)}
          </Box>
        </Stack>
      </Box>
    );
  };

  return (
    <Paper sx={{ height: '100%', width: 1 }}>
      <Stack
        direction="column"
        spacing={3}
        sx={{
          ...responsivePagePaddingSx,
          position: 'relative',
          height: 1,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={1.5}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {t('homePage.topUsers.title')}
            </Typography>
          </Box>
        </Stack>

        <Tabs
          value={activeTab}
          onChange={(_, value: TabValue) => setActiveTab(value)}
          variant="scrollable"
          allowScrollButtonsMobile
          aria-label="top-users-tabs"
        >
          {tabConfigs.map((tab) => (
            <Tab key={tab.value} label={t(tab.labelKey)} value={tab.value} />
          ))}
        </Tabs>

        {showSkeleton && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
              gap: 2,
            }}
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} variant="rounded" height={150} />
            ))}
          </Box>
        )}

        {!showSkeleton && users.length > 0 && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' },
              gap: 2,
            }}
          >
            {users.map((user, index) => renderUserCard(user, index))}
          </Box>
        )}

        {!showSkeleton && users.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            {emptyLabel}
          </Typography>
        )}
        <Button
          variant="text"
          color="primary"
          component={RouterLink}
          to={resources.Users}
        >
          {t('homePage.topUsers.viewAll')}
        </Button>
      </Stack>
    </Paper>
  );
};

export default TopUsersSection;
