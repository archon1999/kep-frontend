import {
  ReactElement,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation, useNavigate, useParams } from 'react-router';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogContent,
  Grid,
  LinearProgress,
  Link,
  Paper,
  PaperProps,
  Stack,
  SxProps,
  Theme,
  Tooltip,
  Typography,
  tabScrollButtonClasses,
  tabsClasses,
} from '@mui/material';
import { useNavContext } from 'app/layouts/main-layout/NavProvider';
import { useAuth } from 'app/providers/AuthProvider';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceByUsername, resources } from 'app/routes/resources';
import { HashLinkBehavior } from 'app/theme/components/Link';
import {
  useUserAbout,
  useUserDetails,
  useUserRatings,
  useUserSocial,
} from 'modules/users/application/queries';
import {
  UserProfileAbout,
  UserSocialLinks,
} from 'modules/users/domain/entities/user-profile.entity';
import {
  UserDetails,
  UserRatingInfo,
  UserRatings,
} from 'modules/users/domain/entities/user.entity';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepIcon from 'shared/components/base/KepIcon';
import StatusAvatar from 'shared/components/base/StatusAvatar';
import CountryFlagIcon from 'shared/components/common/CountryFlagIcon';
import ResponsiveTabs from 'shared/components/common/ResponsiveTabs';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import Streak from 'shared/components/rating/Streak';
import ScrollSpy, { useScrollSpyContext } from 'shared/components/scroll-spy';
import ScrollSpyContent from 'shared/components/scroll-spy/ScrollSpyContent';
import ScrollSpyNavItem from 'shared/components/scroll-spy/ScrollSpyNavItem';
import { KepIconName } from 'shared/config/icons';
import { formatDateTime } from 'shared/lib/dateTime';
import { getCountryLabel } from 'shared/utils/country';
import ProfileFollowButton from './components/user-profile/ProfileFollowButton';
import UserFollowersCard from './components/user-profile/UserFollowersCard';
import UserProfileAchievementsTab from './components/user-profile/UserProfileAchievementsTab';
import UserProfileActivityHistoryTab from './components/user-profile/UserProfileActivityHistoryTab';
import UserProfilePurchasesTab from './components/user-profile/UserProfilePurchasesTab';
import UserProfileRatingsTab from './components/user-profile/UserProfileRatingsTab';

type TabValue = 'about' | 'ratings' | 'activity-history' | 'purchases' | 'achievements';

const formatDate = (value?: string | Date | null) => {
  const formatted = formatDateTime(value, 'profileDate', '');
  return formatted || undefined;
};

const formatYearRange = (
  fromYear?: number | null,
  toYear?: number | null,
  presentText = 'Present',
) => {
  if (!fromYear && !toYear) return undefined;
  return `${fromYear ?? '...'} - ${toYear ?? presentText}`;
};

const normalizeTelegramHandle = (handle?: string) => handle?.replace(/^@+/, '').trim();

const hashToTabValue = (hash: string, tabs: Array<{ value: TabValue }>) => {
  const hashValue = hash.replace('#', '') as TabValue;
  return tabs.some((tab) => tab.value === hashValue) ? hashValue : undefined;
};

type OverviewRow = {
  label: string;
  value?: ReactNode;
};

const PersonalProfileSection = ({
  about,
  social,
  username,
}: {
  about?: UserProfileAbout;
  social?: UserSocialLinks;
  username: string;
}) => {
  const { t, i18n } = useTranslation();
  const generalInfo = about?.generalInfo;
  const profileInfo = about?.profileInfo;
  const workExperiences = about?.workExperiences ?? [];
  const educations = about?.educations ?? [];
  const skills = about?.skills ?? [];
  const technologies = about?.technologies ?? [];
  const bio = profileInfo?.bio || '';
  const telegramHandle = normalizeTelegramHandle(social?.telegram);
  const countryLabel = getCountryLabel(profileInfo?.country, i18n.language);
  const locationText = [countryLabel, profileInfo?.region].filter(Boolean).join(', ');
  const codeforcesHandle = social?.codeforcesHandle?.trim();

  const overviewRows: OverviewRow[] = [
    {
      label: t('users.profile.personal.fullName'),
      value: [generalInfo?.firstName, generalInfo?.lastName].filter(Boolean).join(' '),
    },
    {
      label: t('users.profile.personal.lives'),
      value: locationText ? (
        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ minWidth: 0 }}>
          <CountryFlagIcon code={profileInfo?.country} size={20} />
          <Typography
            component="span"
            sx={{ fontSize: 18, lineHeight: 1.35, fontWeight: 700, overflowWrap: 'anywhere' }}
          >
            {locationText}
          </Typography>
        </Stack>
      ) : undefined,
    },
    {
      label: t('users.profile.personal.wasBorn'),
      value: formatDate(profileInfo?.dateOfBirth),
    },
    {
      label: t('users.profile.personal.email'),
      value: profileInfo?.email,
    },
    {
      label: t('users.profile.personal.website'),
      value: profileInfo?.website,
    },
    {
      label: t('users.profile.personal.joined'),
      value: formatDate(profileInfo?.dateJoined),
    },
    {
      label: t('users.profile.personal.telegram'),
      value: telegramHandle ? (
        <Link
          href={`https://t.me/${telegramHandle}`}
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ fontSize: 18, lineHeight: 1.35, fontWeight: 700, overflowWrap: 'anywhere' }}
        >
          {telegramHandle}
        </Link>
      ) : undefined,
    },
    {
      label: t('users.profile.personal.codeforces'),
      value: codeforcesHandle ? (
        <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
          <Link
            href={`https://codeforces.com/profile/${codeforcesHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{ fontSize: 18, lineHeight: 1.35, fontWeight: 700, overflowWrap: 'anywhere' }}
          >
            {codeforcesHandle}
          </Link>
          {social?.codeforcesBadge ? (
            <Box
              component="img"
              src={social.codeforcesBadge}
              alt={codeforcesHandle}
              sx={{ height: 20, maxWidth: 120, objectFit: 'contain' }}
            />
          ) : null}
        </Stack>
      ) : undefined,
    },
  ].filter((row) => Boolean(row.value));

  return (
    <Grid container columns={24} spacing={{ xs: 2, md: 5 }}>
      <Grid size={{ xs: 24, md: 15 }}>
        <Stack direction="column" gap={4} sx={{ py: 3 }}>
          {bio ? (
            <Stack direction="column" gap={1.5}>
              <Typography variant="h6">{t('users.profile.about')}</Typography>
              <Typography
                dangerouslySetInnerHTML={{ __html: bio }}
                color="text.secondary"
                sx={{ fontSize: 18, lineHeight: 1.4 }}
              />
            </Stack>
          ) : null}

          {skills.length ? (
            <Stack direction="column" gap={1.5}>
              <Typography sx={{ fontSize: 20, lineHeight: 1.25, fontWeight: 700 }}>
                {t('users.profile.skills')}
              </Typography>
              <Stack direction="row" gap={1} flexWrap="wrap" useFlexGap>
                {skills.map((skill) => (
                  <Paper
                    key={`${skill.slug ?? skill.name}-${skill.level}`}
                    background={1}
                    sx={{
                      p: 1.25,
                      borderRadius: 2,
                      outline: 0,
                      minWidth: { xs: '100%', sm: 180 },
                      flex: { xs: '1 1 100%', sm: '0 1 220px' },
                    }}
                  >
                    <Stack direction="column" gap={0.75}>
                      <Typography variant="body2" fontWeight={700} noWrap>
                        {skill.name}
                      </Typography>
                      <Tooltip title={`${Math.min(100, Math.max(0, skill.level))}%`} arrow>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(100, Math.max(0, skill.level))}
                          sx={{ height: 6, borderRadius: 1 }}
                        />
                      </Tooltip>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Stack>
          ) : null}

          {technologies.length ? (
            <Stack direction="column" gap={1.5}>
              <Typography sx={{ fontSize: 20, lineHeight: 1.25, fontWeight: 700 }}>
                {t('users.profile.technologies')}
              </Typography>
              <Stack direction="row" gap={1} flexWrap="wrap" useFlexGap>
                {technologies.map((technology) => (
                  <Chip
                    key={`${technology.text}-${technology.devIconClass}`}
                    icon={
                      technology.devIconClass ? (
                        <Box
                          component="i"
                          className={technology.devIconClass}
                          sx={{ fontSize: 16 }}
                        />
                      ) : undefined
                    }
                    label={technology.text}
                    size="small"
                    sx={{
                      bgcolor: technology.badgeColor || 'background.elevation2',
                      border: 0,
                      color: 'common.white',
                      '& .MuiChip-icon': { color: 'inherit' },
                    }}
                  />
                ))}
              </Stack>
            </Stack>
          ) : null}

          <TimelineList
            title={t('users.profile.workExperience')}
            emptyText={t('users.emptyValue')}
            items={workExperiences.map((work) => ({
              title: work.company,
              subtitle: work.jobTitle,
              period: formatYearRange(
                work.fromYear,
                work.toYear,
                t('users.profile.timeline.present'),
              ),
              fallbackIcon: 'project',
            }))}
          />

          <TimelineList
            title={t('users.profile.education')}
            emptyText={t('users.emptyValue')}
            items={educations.map((education) => ({
              title: education.organization,
              subtitle: education.degree,
              period: formatYearRange(
                education.fromYear,
                education.toYear,
                t('users.profile.timeline.present'),
              ),
              fallbackIcon: 'learn',
            }))}
          />
        </Stack>
      </Grid>

      <Grid size={{ xs: 24, md: 9 }}>
        <Stack direction="column" gap={2}>
          <Paper
            background={1}
            sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, outline: 0, height: '100%' }}
          >
            <Stack direction="column" gap={3}>
              {overviewRows.length ? (
                overviewRows.map((row) => (
                  <Stack key={row.label} direction="column" gap={0.75}>
                    <Typography
                      color="text.secondary"
                      sx={{ fontSize: 15, lineHeight: 1.35, fontWeight: 400 }}
                    >
                      {row.label}
                    </Typography>
                    {typeof row.value === 'string' || typeof row.value === 'number' ? (
                      <Typography
                        sx={{
                          fontSize: 16,
                          lineHeight: 1.35,
                          fontWeight: 600,
                          overflowWrap: 'anywhere',
                        }}
                      >
                        {row.value}
                      </Typography>
                    ) : (
                      row.value
                    )}
                  </Stack>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('users.emptyValue')}
                </Typography>
              )}
            </Stack>
          </Paper>
          <UserFollowersCard username={username} />
        </Stack>
      </Grid>
    </Grid>
  );
};

const TimelineList = ({
  title,
  emptyText,
  items,
}: {
  title: string;
  emptyText: string;
  items: Array<{ title?: string; subtitle?: string; period?: string; fallbackIcon: KepIconName }>;
}) => (
  <Stack direction="column" gap={2.5}>
    <Typography sx={{ fontSize: 20, lineHeight: 1.25, fontWeight: 700 }}>{title}</Typography>

    {items.length ? (
      items.map((item, index) => (
        <Stack key={`${item.title}-${index}`} direction="row" gap={2.5} alignItems="flex-start">
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: 'background.elevation2',
              color: 'text.secondary',
              flexShrink: 0,
            }}
          >
            <KepIcon name={item.fallbackIcon} fontSize={26} />
          </Avatar>
          <Stack direction="column" gap={0.5}>
            <Typography sx={{ fontSize: 15, lineHeight: 1.35, fontWeight: 700 }}>
              {item.title}
            </Typography>
            {item.subtitle ? (
              <Typography color="text.secondary" sx={{ fontSize: 14, lineHeight: 1.35 }}>
                {item.subtitle}
              </Typography>
            ) : null}
            {item.period ? (
              <Typography
                color="text.secondary"
                sx={{ fontSize: 14, lineHeight: 1.35, fontWeight: 700 }}
              >
                {item.period}
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      ))
    ) : (
      <Typography variant="body2" color="text.secondary">
        {emptyText}
      </Typography>
    )}
  </Stack>
);

const ratingConfig: Array<{ key: keyof UserRatings; labelKey: string; icon: KepIconName }> = [
  { key: 'skillsRating', labelKey: 'users.columns.skills', icon: 'rating' },
  { key: 'activityRating', labelKey: 'users.columns.activity', icon: 'todo' },
  { key: 'contestsRating', labelKey: 'users.columns.contests', icon: 'contests' },
  { key: 'challengesRating', labelKey: 'users.columns.challenges', icon: 'challenges' },
];

const getRatingValue = (
  ratings?: UserRatings,
  key?: keyof UserRatings,
): UserRatingInfo | undefined => {
  if (!ratings || !key) return undefined;
  return ratings[key];
};

const CompactRatingsGrid = ({
  ratings,
  isLoading,
}: {
  ratings?: UserRatings;
  isLoading?: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: 1,
      }}
    >
      {ratingConfig.map(({ key, labelKey, icon }) => {
        const stat = getRatingValue(ratings, key);
        const titleChip =
          key === 'contestsRating' ? (
            <ContestsRatingChip title={stat?.title} imgSize={16} />
          ) : key === 'challengesRating' ? (
            <ChallengesRatingChip title={stat?.title} />
          ) : null;

        return (
          <Paper
            key={key}
            background={2}
            sx={{ p: 1.25, borderRadius: 2, outline: 0, minWidth: 0 }}
          >
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ minWidth: 0 }}>
              <KepIcon name={icon} fontSize={16} color="primary.main" />
              <Typography variant="caption" color="text.secondary" noWrap>
                {t(labelKey)}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
              flexWrap="wrap"
              useFlexGap
              sx={{ mt: 0.5 }}
            >
              {titleChip}
              <Typography variant="subtitle1" fontWeight={800}>
                {isLoading ? '...' : (stat?.value ?? t('users.emptyValue'))}
              </Typography>
              {stat?.rank !== undefined ? (
                <Typography variant="caption" color="text.secondary">
                  #{stat.rank}
                </Typography>
              ) : null}
            </Stack>
          </Paper>
        );
      })}
    </Box>
  );
};

interface ProfileSummaryProps extends PaperProps {
  username: string;
  userDetails?: UserDetails;
  userRatings?: UserRatings;
  isRatingsLoading?: boolean;
}

const ProfileSummary = ({
  username,
  userDetails,
  userRatings,
  isRatingsLoading,
  sx,
  ...rest
}: ProfileSummaryProps) => {
  const { t } = useTranslation();
  const displayName = [userDetails?.firstName, userDetails?.lastName].filter(Boolean).join(' ');
  const name = displayName || userDetails?.username || username;
  const statusTooltip = userDetails?.isOnline
    ? t('homePage.userActivity.onlineNow')
    : userDetails?.lastSeen
      ? `${t('users.columns.lastSeen')}: ${userDetails.lastSeen}`
      : t('users.columns.lastSeen');

  return (
    <Paper
      background={1}
      {...rest}
      sx={{ outline: 0, p: { xs: 2, sm: 3 }, borderRadius: 4, ...sx }}
    >
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        gap={3}
        sx={{
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', lg: 'center' },
        }}
      >
        <Stack
          gap={2}
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'center' },
            minWidth: 0,
            flex: 1,
          }}
        >
          <Tooltip title={statusTooltip} arrow>
            <Box component="span" sx={{ display: 'inline-flex', flexShrink: 0 }}>
              <StatusAvatar
                status={userDetails?.isOnline ? 'online' : 'offline'}
                src={userDetails?.avatar}
                alt={username}
                sx={{ width: 80, height: 80 }}
              >
                {username.slice(0, 1).toUpperCase()}
              </StatusAvatar>
            </Box>
          </Tooltip>
          <Stack
            direction="column"
            gap={0.5}
            sx={{
              minWidth: 0,
              flex: { sm: 1 },
              width: { xs: '100%', sm: 'auto' },
              alignItems: { xs: 'center', sm: 'flex-start' },
            }}
          >
            <Stack
              direction="row"
              gap={1.5}
              sx={{
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: { xs: 'center', sm: 'flex-start' },
              }}
            >
              <Typography variant="h5" sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
                {name}
              </Typography>
              <ProfileFollowButton
                username={username}
                isFollowing={Boolean(userDetails?.isFollowing)}
              />
            </Stack>
            <Stack
              gap={2}
              sx={{
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: { xs: 'center', sm: 'flex-start' },
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 400, color: 'text.secondary', textWrap: 'nowrap' }}
              >
                {userDetails?.username || username}
              </Typography>
              {userDetails?.streak ? (
                <Streak
                  streak={userDetails.streak}
                  maxStreak={userDetails.maxStreak}
                  iconSize={18}
                  textVariant="subtitle2"
                  fontWeight={400}
                  color="text.secondary"
                  spacing={0.5}
                />
              ) : null}
            </Stack>
          </Stack>
        </Stack>
        <Box sx={{ width: { xs: 1, lg: 360 }, flexShrink: 0 }}>
          <CompactRatingsGrid ratings={userRatings} isLoading={isRatingsLoading} />
        </Box>
      </Stack>
    </Paper>
  );
};

interface PanelWrapperProps {
  title: string;
  children: ReactElement;
  editTo?: string;
  sx?: SxProps<Theme>;
}

const PanelWrapper = ({ title, children, editTo, sx }: PanelWrapperProps) => (
  <Stack direction="column" gap={3} sx={{ ...sx }}>
    <Paper background={2} sx={{ px: 2, py: 1, borderRadius: 2, outline: 0 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        {editTo ? (
          <Button
            component={RouterLink}
            to={editTo}
            shape="square"
            variant="text"
            color="neutral"
            size="small"
          >
            <IconifyIcon icon="material-symbols:edit-outline" sx={{ fontSize: 22 }} />
          </Button>
        ) : null}
      </Stack>
    </Paper>

    {children}
  </Stack>
);

const ProfileTabsInner = ({
  about,
  social,
  isOwner,
  username,
}: {
  about?: UserProfileAbout;
  social?: UserSocialLinks;
  isOwner: boolean;
  username: string;
}) => {
  const { t } = useTranslation();
  const tabsRef = useRef<HTMLDivElement>(null);
  const { topbarHeight } = useNavContext();
  const { activeElemId } = useScrollSpyContext();
  const location = useLocation();
  const navigate = useNavigate();

  const tabData = useMemo(
    () =>
      [
        {
          value: 'about' as const,
          label: t('users.profile.personal.sectionTitle', { defaultValue: 'Personal' }),
          panel: <PersonalProfileSection about={about} social={social} username={username} />,
          editTo: isOwner ? resources.SettingsInformation : undefined,
        },
        {
          value: 'ratings' as const,
          label: t('users.profile.tabs.ratings'),
          panel: <UserProfileRatingsTab />,
        },
        {
          value: 'activity-history' as const,
          label: t('users.profile.tabs.activityHistory'),
          panel: <UserProfileActivityHistoryTab showTitle={false} />,
        },
        {
          value: 'achievements' as const,
          label: t('users.profile.tabs.achievements'),
          panel: <UserProfileAchievementsTab showTitle={false} />,
        },
        isOwner
          ? {
              value: 'purchases' as const,
              label: t('users.profile.tabs.purchases'),
              panel: <UserProfilePurchasesTab />,
            }
          : null,
      ].filter(Boolean) as Array<{
        value: TabValue;
        label: string;
        panel: ReactElement;
        editTo?: string;
      }>,
    [about, isOwner, social, t],
  );

  const [activeTab, setActiveTab] = useState<TabValue>(
    () => hashToTabValue(location.hash, tabData) || 'about',
  );

  const handleTabChange = (newValue: TabValue) => {
    setActiveTab(newValue);
    const nextHash = `#${newValue}`;
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, '', `${location.pathname}${location.search}${nextHash}`);
    }
    window.requestAnimationFrame(() => {
      document.getElementById(newValue)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  useEffect(() => {
    const hashTab = hashToTabValue(location.hash, tabData);

    if (!hashTab) {
      if (location.hash === '#purchases' && !isOwner) {
        navigate(getResourceByUsername(resources.UserProfile, username), { replace: true });
      }
      return;
    }

    setActiveTab(hashTab);
    window.requestAnimationFrame(() => {
      document.getElementById(hashTab)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [isOwner, location.hash, navigate, tabData, username]);

  useEffect(() => {
    if (
      activeElemId &&
      activeTab !== activeElemId &&
      tabData.some((item) => item.value === activeElemId)
    ) {
      const nextTab = activeElemId as TabValue;
      setActiveTab(nextTab);
      const nextHash = `#${nextTab}`;
      if (window.location.hash !== nextHash) {
        window.history.replaceState(null, '', `${location.pathname}${location.search}${nextHash}`);
      }
    }
  }, [activeElemId, activeTab, location.pathname, location.search, tabData]);

  return (
    <Paper sx={{ outline: 0, bgcolor: 'transparent', boxShadow: 'none' }}>
      <Box
        ref={tabsRef}
        sx={{
          position: 'sticky',
          zIndex: 10,
          mb: 3,
          top: topbarHeight,
          bgcolor: 'background.paper',
        }}
      >
        <ScrollSpyNavItem>
          <ResponsiveTabs
            value={activeTab}
            onChange={handleTabChange}
            ariaLabel="profile tabs"
            items={tabData.map(({ value, label }) => ({
              value,
              label,
              tabProps: {
                LinkComponent: HashLinkBehavior,
                href: `#${value}`,
              },
            }))}
            tabsProps={{
              variant: 'standard',
              scrollButtons: true,
              allowScrollButtonsMobile: true,
              centered: true,
              sx: {
                py: 1,
                [`& .${tabsClasses.list}`]: { gap: 0, justifyContent: 'flex-start' },
                [`& .${tabScrollButtonClasses.disabled}`]: { opacity: '0.3 !important' },
              },
            }}
          />
        </ScrollSpyNavItem>
      </Box>

      <Stack direction="column" spacing={5} sx={{ mb: 7 }}>
        {tabData.map(({ value, label, panel, editTo }) => (
          <ScrollSpyContent
            key={value}
            id={value}
            sx={(theme) => ({
              scrollMarginTop: theme.mixins.topOffset(topbarHeight, 75, true),
            })}
          >
            <PanelWrapper title={label} editTo={editTo}>
              {panel}
            </PanelWrapper>
          </ScrollSpyContent>
        ))}
      </Stack>
    </Paper>
  );
};

const ProfileTabsSection = ({
  about,
  social,
  isOwner,
  username,
}: {
  about?: UserProfileAbout;
  social?: UserSocialLinks;
  isOwner: boolean;
  username: string;
}) => (
  <ScrollSpy offset={500}>
    <ProfileTabsInner about={about} social={social} isOwner={isOwner} username={username} />
  </ScrollSpy>
);

const UserProfilePage = () => {
  const { username = '' } = useParams();
  const { currentUser } = useAuth();
  const { data: userDetails } = useUserDetails(username);
  const { data: userRatings, isLoading: isRatingsLoading } = useUserRatings(username);
  const { data: about } = useUserAbout(username);
  const { data: social } = useUserSocial(username);
  const [isCoverPreviewOpen, setIsCoverPreviewOpen] = useState(false);
  const isOwner = currentUser?.username === username;

  useDocumentTitle(
    userDetails?.username || username ? 'pageTitles.userProfile' : undefined,
    userDetails?.username || username
      ? {
          username: userDetails?.username ?? username ?? '',
        }
      : undefined,
  );

  return (
    <Paper sx={{ height: 1, p: { xs: 2, md: 5 } }}>
      <Container maxWidth="md" disableGutters>
        <Box
          component="figure"
          onClick={() => userDetails?.coverPhoto && setIsCoverPreviewOpen(true)}
          sx={{ m: 0, position: 'relative', height: 200, borderRadius: 6, overflow: 'hidden' }}
        >
          {userDetails?.coverPhoto ? (
            <Box
              component="img"
              src={userDetails.coverPhoto}
              alt={userDetails.username || username}
              sx={{ height: 1, width: 1, objectFit: 'cover', cursor: 'zoom-in' }}
            />
          ) : (
            <Box sx={{ height: 1, width: 1, bgcolor: 'background.elevation2' }} />
          )}
          {isOwner ? (
            <Button
              component={RouterLink}
              to={resources.Settings}
              shape="square"
              variant="soft"
              color="neutral"
              onClick={(event) => event.stopPropagation()}
              sx={({ spacing }) => ({ position: 'absolute', top: spacing(3), right: spacing(3) })}
            >
              <IconifyIcon icon="material-symbols:edit-outline" sx={{ fontSize: 18 }} />
            </Button>
          ) : null}
        </Box>

        <Box sx={{ px: { xs: 1, sm: 4, md: 5 }, mt: -2.25, position: 'relative', zIndex: 1 }}>
          <ProfileSummary
            username={username}
            userDetails={userDetails}
            userRatings={userRatings}
            isRatingsLoading={isRatingsLoading}
            sx={{ mb: 2 }}
          />
          <ProfileTabsSection about={about} social={social} isOwner={isOwner} username={username} />
        </Box>
      </Container>

      <Dialog
        open={isCoverPreviewOpen}
        onClose={() => setIsCoverPreviewOpen(false)}
        maxWidth="lg"
        slotProps={{
          paper: {
            sx: {
              width: 'fit-content',
              maxWidth: 'calc(100vw - 32px)',
              bgcolor: 'transparent',
              boxShadow: 'none',
            },
          },
        }}
      >
        <DialogContent sx={{ p: 0, bgcolor: 'transparent', overflow: 'hidden' }}>
          {userDetails?.coverPhoto ? (
            <Box
              component="img"
              src={userDetails.coverPhoto}
              alt={userDetails.username || username}
              sx={{
                display: 'block',
                maxWidth: 'calc(100vw - 32px)',
                maxHeight: '85vh',
                width: 'auto',
                height: 'auto',
                borderRadius: 2,
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default UserProfilePage;
