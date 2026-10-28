import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  Stack,
  Typography,
} from '@mui/material';
import { getResourceById, getResourceByUsername, resources } from 'app/routes/resources';
import sitemap, { MenuItem } from 'app/routes/sitemap';
import type { TFunction } from 'i18next';
import { useBlogPosts } from 'modules/blog/application/queries';
import { useContestsList } from 'modules/contests/application/queries';
import { useProblemsList } from 'modules/problems/application/queries';
import { useUsersList } from 'modules/users/application/queries';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import DebouncedTextField from 'shared/components/common/DebouncedTextField';
import EmptyState from 'shared/components/common/EmptyState';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import { RecentPage, clearRecentPages, getRecentPages } from 'shared/lib/recent-pages';
import SearchTextField from './SearchTextField';

type SearchItem = {
  path: string;
  label: string;
  secondary?: string;
  icon?: string;
  avatar?: string;
  username?: string;
};

const buildResources = (items: MenuItem[], t: TFunction): (SearchItem & { searchText: string })[] =>
  items.flatMap((item) => {
    const label = item.key ? t(item.key) : item.name;
    return [
      ...(item.path
        ? [
            {
              path: item.path,
              label,
              icon: item.icon,
              searchText: `${label} ${item.name}`.toLowerCase(),
            },
          ]
        : []),
      ...(item.items?.length ? buildResources(item.items, t) : []),
    ];
  });

const SearchResult = ({ handleClose }: { handleClose: () => void }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentPages, setRecentPages] = useState<RecentPage[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const query = searchQuery.trim();
  const canSearch = query.length >= 2;
  const hasTyped = query.length > 0;
  const resourcesList = useMemo(() => buildResources(sitemap, t), [t]);
  const sections = canSearch
    ? resourcesList.filter((item) => item.searchText.includes(query.toLowerCase())).slice(0, 5)
    : [];

  const users = useUsersList(canSearch ? { search: query, page: 1, pageSize: 5 } : null);
  const problems = useProblemsList(canSearch ? { search: query, page: 1, pageSize: 5 } : null);
  const contests = useContestsList(canSearch ? { title: query, page: 1, pageSize: 5 } : null);
  const blogs = useBlogPosts(canSearch ? { title: query, page: 1, pageSize: 5 } : null);

  useEffect(() => {
    setRecentPages(getRecentPages());
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const groups: { key: string; items: SearchItem[] }[] = [
    { key: 'resources', items: sections },
    {
      key: 'users',
      items: users.isLoading
        ? []
        : (users.data?.data ?? []).map((user) => ({
            path: getResourceByUsername(resources.UserProfile, user.username),
            username: user.username,
            label: [user.firstName, user.lastName].filter(Boolean).join(' ') || `@${user.username}`,
            secondary: user.firstName || user.lastName ? `@${user.username}` : undefined,
            avatar: user.avatar,
            icon: 'mdi:account-outline',
          })),
    },
    {
      key: 'problems',
      items: problems.isLoading
        ? []
        : (problems.data?.data ?? []).map((problem) => ({
            path: getResourceById(resources.Problem, problem.id),
            label: `${problem.id}. ${problem.title}`,
            icon: 'mdi:code-tags',
          })),
    },
    {
      key: 'contests',
      items: contests.isLoading
        ? []
        : (contests.data?.data ?? []).map((contest) => ({
            path: getResourceById(resources.Contest, contest.id),
            label: contest.title,
            secondary: [
              contest.typeInfo?.title ?? contest.type,
              contest.categoryTitle.replace(/([a-z])([A-Z])/g, '$1 $2'),
            ]
              .filter(Boolean)
              .join(' · '),
            icon: 'mdi:trophy-outline',
          })),
    },
    {
      key: 'blogs',
      items: blogs.isLoading
        ? []
        : (blogs.data?.data ?? []).map((post) => ({
            path: getResourceById(resources.BlogPost, post.id),
            label: post.title,
            secondary: post.author?.username,
            icon: 'mdi:book-open-page-variant-outline',
          })),
    },
  ];
  const queries = [users, problems, contests, blogs];
  const isLoading = canSearch && queries.some((result) => result.isLoading || result.isValidating);
  const failedQueries = queries.filter((result) => result.error);
  const hasError = canSearch && failedQueries.length > 0;
  const visibleGroups = groups.filter((group) => group.items.length > 0);
  const clearSearch = () => {
    setSearchQuery('');
    inputRef.current?.focus({ preventScroll: true });
  };

  return (
    <>
      <Stack direction="row" alignItems="center" gap={2} sx={{ px: 3, py: 1.5, flexShrink: 0 }}>
        <Typography component="h2" variant="h6" sx={{ flex: 1 }}>
          {t('common.searchPlaceholder')}
        </Typography>
        <PatternArtwork
          kind="search"
          sx={{ width: 96, '& .kep-pattern-signal': { animation: 'none', opacity: 1 } }}
        />
        <IconButton onClick={handleClose} aria-label={t('common.close')}>
          <IconifyIcon icon="mdi:close" />
        </IconButton>
      </Stack>
      <DebouncedTextField
        textFieldComponent={SearchTextField}
        fullWidth
        value={searchQuery}
        onValueChange={setSearchQuery}
        inputRef={inputRef}
        sx={{ flexShrink: 0 }}
        slotProps={{
          htmlInput: { 'aria-label': t('common.searchPlaceholder') },
          input: {
            endAdornment: hasTyped ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={clearSearch} aria-label={t('search.clearQuery')}>
                  <IconifyIcon icon="mdi:backspace-outline" />
                </IconButton>
              </InputAdornment>
            ) : undefined,
          },
        }}
      />
      <Box
        sx={{
          maxHeight: 'min(600px, 60dvh)',
          minHeight: 0,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
        }}
      >
        {!hasTyped ? (
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ px: 3, py: 1 }}
            >
              <Typography component="h3" variant="label" color="text.secondary">
                {t('search.recent')}
              </Typography>
              {recentPages.length > 0 && (
                <Button
                  size="small"
                  onClick={() => {
                    clearRecentPages();
                    setRecentPages([]);
                  }}
                >
                  {t('search.clearHistory')}
                </Button>
              )}
            </Stack>
            {recentPages.length ? (
              <SearchItems
                items={recentPages.map((page) => ({
                  path: page.path,
                  label: page.title,
                  icon: 'mdi:history',
                }))}
                onNavigate={handleClose}
              />
            ) : (
              <Typography sx={{ px: 3, pb: 3 }} variant="body2" color="text.secondary">
                {t('search.recentEmpty')}
              </Typography>
            )}
          </Box>
        ) : !canSearch ? (
          <Typography role="status" sx={{ p: 3 }} variant="body2" color="text.secondary">
            {t('search.minCharsHint')}
          </Typography>
        ) : (
          <>
            {isLoading && (
              <Stack
                role="status"
                direction="row"
                alignItems="center"
                gap={1.5}
                sx={{ px: 3, py: 2 }}
              >
                <CircularProgress size={16} aria-hidden="true" />
                <Typography variant="body2" color="text.secondary">
                  {t('search.loading')}
                </Typography>
              </Stack>
            )}
            {hasError && (
              <Alert
                severity="warning"
                sx={{ m: 2 }}
                action={
                  <Button
                    size="small"
                    disabled={isLoading}
                    onClick={() =>
                      void Promise.allSettled(failedQueries.map((result) => result.mutate()))
                    }
                  >
                    {t('common.retry')}
                  </Button>
                }
              >
                {t('search.loadError')}
              </Alert>
            )}
            {visibleGroups.map((group) => (
              <Box
                component="section"
                key={group.key}
                aria-labelledby={`search-${group.key}`}
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  '&:last-child': { borderBottom: 0 },
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ px: 3, pt: 2, pb: 0.5 }}
                >
                  <Typography
                    component="h3"
                    variant="label"
                    color="text.secondary"
                    id={`search-${group.key}`}
                  >
                    {t(`search.${group.key}`)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {group.items.length}
                  </Typography>
                </Stack>
                <SearchItems items={group.items} onNavigate={handleClose} />
              </Box>
            ))}
            {!isLoading && !hasError && visibleGroups.length === 0 && (
              <EmptyState
                compact
                kind="search"
                title={t('search.noResults')}
                description={t('search.tryAnotherQuery')}
                action={
                  <Button variant="outlined" onClick={clearSearch}>
                    {t('search.clearQuery')}
                  </Button>
                }
              />
            )}
          </>
        )}
      </Box>
    </>
  );
};

const SearchItems = ({ items, onNavigate }: { items: SearchItem[]; onNavigate: () => void }) => (
  <List sx={{ pt: 0, pb: 1 }}>
    {items.map((item) => (
      <ListItem key={item.path} disablePadding>
        {item.username ? (
          <UserPopover
            username={item.username}
            avatar={item.avatar}
            fullName={item.label}
            onViewDetails={onNavigate}
            sx={{
              width: '100%',
              px: 3,
              py: 1.5,
              gap: 1.5,
              minHeight: 52,
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <SearchItemContent item={item} />
          </UserPopover>
        ) : (
          <ListItemButton
            component={NavLink}
            to={item.path}
            onClick={onNavigate}
            sx={{ px: 3, py: 1.5, gap: 1.5, minHeight: 52 }}
          >
            <SearchItemContent item={item} />
          </ListItemButton>
        )}
      </ListItem>
    ))}
  </List>
);

const SearchItemContent = ({ item }: { item: SearchItem }) => (
  <>
    {item.avatar ? (
      <Avatar src={item.avatar} alt="" sx={{ width: 32, height: 32 }} />
    ) : (
      <IconifyIcon
        icon={item.icon ?? 'mdi:link-variant'}
        sx={{ width: 24, flexShrink: 0, color: 'primary.main' }}
      />
    )}
    <Box sx={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}>
      <Typography variant="body2" color="text.primary" fontWeight={600}>
        {item.label}
      </Typography>
      {item.secondary && (
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>
          {item.secondary}
        </Typography>
      )}
    </Box>
    <IconifyIcon
      icon={item.username ? 'mdi:account-details-outline' : 'mdi:arrow-top-right'}
      sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }}
    />
  </>
);

export default SearchResult;
