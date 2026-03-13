import { ChangeEvent, PropsWithChildren, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  inputBaseClasses,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SimpleBar from 'simplebar-react';
import useSWR from 'swr';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import SearchTextField from './SearchTextField';
import sitemap, { MenuItem } from 'app/routes/sitemap';
import { getResourceById, getResourceByUsername, resources } from 'app/routes/resources';
import { HttpUsersRepository } from 'modules/users/data-access/repository/http.users.repository';
import { HttpProblemsRepository } from 'modules/problems/data-access/repository/http.problems.repository';
import { HttpContestsRepository } from 'modules/contests/data-access/repository/http.contests.repository';
import { HttpBlogRepository } from 'modules/blog/data-access/repository/http.blog.repository';
import { UsersListItem } from 'modules/users/domain/entities/user.entity';
import { ProblemListItem } from 'modules/problems/domain/entities/problem.entity';
import { ContestListItem } from 'modules/contests/domain/entities/contest.entity';
import { BlogPost } from 'modules/blog/domain/entities/blog.entity';
import { useDebouncedValue } from 'shared/hooks/useDebouncedValue';
import { clearRecentPages, getRecentPages, RecentPage } from 'shared/lib/recent-pages';
import type { TFunction } from 'i18next';

const usersRepository = new HttpUsersRepository();
const problemsRepository = new HttpProblemsRepository();
const contestsRepository = new HttpContestsRepository();
const blogRepository = new HttpBlogRepository();

type ResourceResult = {
  path: string;
  label: string;
  icon?: string;
  searchText: string;
};

const buildResources = (items: MenuItem[], t: TFunction): ResourceResult[] =>
  items.flatMap((item) => {
    const label = item.key ? t(item.key) : item.name;
    const currentItems = item.path
      ? [{ path: item.path, label, icon: item.icon, searchText: `${label} ${item.name}`.toLowerCase() }]
      : [];

    if (!item.items?.length) return currentItems;

    return [...currentItems, ...buildResources(item.items, t)];
  });

const SearchResult = ({ handleClose }: { handleClose: () => void }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentPages, setRecentPages] = useState<RecentPage[]>([]);

  const debouncedQuery = useDebouncedValue(searchQuery.trim(), 300);
  const canSearch = debouncedQuery.length >= 2;
  const hasTyped = searchQuery.trim().length > 0;

  useEffect(() => {
    setRecentPages(getRecentPages());
  }, []);

  const resourcesList = useMemo(() => buildResources(sitemap, t), [t]);

  const filteredResources = useMemo(() => {
    if (!canSearch) return [];

    const normalizedQuery = debouncedQuery.toLowerCase();
    return resourcesList
      .filter((resource) => resource.searchText.includes(normalizedQuery))
      .slice(0, 5);
  }, [canSearch, debouncedQuery, resourcesList]);

  const { data: usersData, isLoading: isUsersLoading } = useSWR(
    canSearch ? ['global-search-users', debouncedQuery] : null,
    () => usersRepository.getUsers({ search: debouncedQuery, page: 1, pageSize: 5 }),
    { revalidateOnFocus: false },
  );

  const { data: problemsData, isLoading: isProblemsLoading } = useSWR(
    canSearch ? ['global-search-problems', debouncedQuery] : null,
    () => problemsRepository.list({ page: 1, pageSize: 5, search: debouncedQuery }),
    { revalidateOnFocus: false },
  );

  const { data: contestsData, isLoading: isContestsLoading } = useSWR(
    canSearch ? ['global-search-contests', debouncedQuery] : null,
    () => contestsRepository.list({ page: 1, pageSize: 5, title: debouncedQuery }),
    { revalidateOnFocus: false },
  );

  const { data: blogsData, isLoading: isBlogsLoading } = useSWR(
    canSearch ? ['global-search-blogs', debouncedQuery] : null,
    () => blogRepository.list({ page: 1, pageSize: 5, title: debouncedQuery }),
    { revalidateOnFocus: false },
  );

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleClearHistory = () => {
    clearRecentPages();
    setRecentPages([]);
  };

  const users = usersData?.data ?? [];
  const problems = problemsData?.data ?? [];
  const contests = contestsData?.data ?? [];
  const blogs = blogsData?.data ?? [];

  const isLoading = isUsersLoading || isProblemsLoading || isContestsLoading || isBlogsLoading;
  const hasResults =
    filteredResources.length > 0 || users.length > 0 || problems.length > 0 || contests.length > 0 || blogs.length > 0;

  const showEmptyState = canSearch && !isLoading && !hasResults;

  const showRecentPages = !hasTyped;

  return (
    <>
      <SearchField handleClose={handleClose} value={searchQuery} onChange={handleSearchChange} />
      <SimpleBar style={{ maxHeight: 600, minHeight: 0, width: '100%' }}>
        {showRecentPages ? (
          <ResultSection
            title={t('search.recent')}
            action={
              recentPages.length ? (
                <Typography
                  component="button"
                  variant="caption"
                  onClick={handleClearHistory}
                  sx={{ fontWeight: 'medium', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {t('search.clearHistory')}
                </Typography>
              ) : undefined
            }
          >
            {recentPages.length ? (
              <List sx={{ pt: 0, pb: 2 }}>
                {recentPages.map((page) => (
                  <ListItem key={page.path} disablePadding>
                    <ListItemButton component={NavLink} to={page.path} onClick={handleClose} sx={{ px: 3 }}>
                      <ListItemIcon>
                        <IconifyIcon icon="material-symbols:history-rounded" />
                      </ListItemIcon>
                      <ListItemText
                        primary={page.title}
                        secondary={page.path}
                        primaryTypographyProps={{ variant: 'subtitle2', color: 'text.primary' }}
                        secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : (
              <EmptyState message={t('search.recentEmpty')} />
            )}
          </ResultSection>
        ) : !canSearch ? (
          <Box sx={{ px: 3, py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t('search.minCharsHint')}
            </Typography>
          </Box>
        ) : (
          <>
            <ResultSection title={t('search.resources')} bottomDivider={hasResults}>
              {filteredResources.length ? (
                <List sx={{ pt: 0, pb: 1 }}>
                  {filteredResources.map((resource) => (
                    <ListItem key={resource.path} disablePadding>
                      <ListItemButton component={NavLink} to={resource.path} onClick={handleClose} sx={{ px: 3 }}>
                        <ListItemIcon>
                          <IconifyIcon icon={resource.icon ?? 'material-symbols:link-rounded'} />
                        </ListItemIcon>
                        <ListItemText
                          primary={resource.label}
                          secondary={resource.path}
                          primaryTypographyProps={{ variant: 'subtitle2', color: 'text.primary' }}
                          secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <EmptyState message={t('search.noMatchingResources')} />
              )}
            </ResultSection>

            <ResultSection title={t('search.users')}>
              {isUsersLoading ? (
                <LoadingIndicator message={t('search.loading')} />
              ) : users.length ? (
                <List sx={{ pt: 0, pb: 1 }}>
                  {users.map((user: UsersListItem) => {
                    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
                    const usernameLabel = `@${user.username}`;

                    return (
                      <ListItem key={user.username} disablePadding>
                        <ListItemButton
                          component={NavLink}
                          to={getResourceByUsername(resources.UserProfile, user.username)}
                          onClick={handleClose}
                          sx={{ px: 3, py: 1, columnGap: 1.5 }}
                        >
                          <Avatar src={user.avatar} alt={user.username} sx={{ width: 32, height: 32 }}>
                            {user.username.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              variant="subtitle2"
                              color="text.primary"
                              sx={{ lineHeight: 1.4, mb: 0.25 }}
                            >
                              {fullName || usernameLabel}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                              {usernameLabel}
                            </Typography>
                          </Box>
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              ) : (
                <EmptyState message={t('search.usersEmpty')} />
              )}
            </ResultSection>

            <ResultSection title={t('search.problems')}>
              {isProblemsLoading ? (
                <LoadingIndicator message={t('search.loading')} />
              ) : problems.length ? (
                <List sx={{ pt: 0, pb: 1 }}>
                  {problems.map((problem: ProblemListItem) => (
                    <ListItem key={problem.id} disablePadding>
                      <ListItemButton
                        component={NavLink}
                        to={getResourceById(resources.Problem, problem.id)}
                        onClick={handleClose}
                        sx={{ px: 3 }}
                      >
                        <ListItemIcon>
                          <IconifyIcon icon="material-symbols:code-rounded" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${problem.id}. ${problem.title}`}
                          primaryTypographyProps={{ variant: 'subtitle2', color: 'text.primary' }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <EmptyState message={t('search.problemsEmpty')} />
              )}
            </ResultSection>

            <ResultSection title={t('search.blogs')}>
              {isBlogsLoading ? (
                <LoadingIndicator message={t('search.loading')} />
              ) : blogs.length ? (
                <List sx={{ pt: 0, pb: 1 }}>
                  {blogs.map((post: BlogPost) => (
                    <ListItem key={post.id} disablePadding>
                      <ListItemButton
                        component={NavLink}
                        to={getResourceById(resources.BlogPost, post.id)}
                        onClick={handleClose}
                        sx={{ px: 3 }}
                      >
                        <ListItemIcon>
                          <IconifyIcon icon="mdi:book-open-page-variant-outline" />
                        </ListItemIcon>
                        <ListItemText
                          primary={post.title}
                          secondary={post.author?.username}
                          primaryTypographyProps={{ variant: 'subtitle2', color: 'text.primary' }}
                          secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <EmptyState message={t('search.blogsEmpty')} />
              )}
            </ResultSection>

            <ResultSection title={t('search.contests')} bottomDivider={!showEmptyState}>
              {isContestsLoading ? (
                <LoadingIndicator message={t('search.loading')} />
              ) : contests.length ? (
                <List sx={{ pt: 0, pb: 1 }}>
                  {contests.map((contest: ContestListItem) => (
                    <ListItem key={contest.id} disablePadding>
                      <ListItemButton
                        component={NavLink}
                        to={getResourceById(resources.Contest, contest.id)}
                        onClick={handleClose}
                        sx={{ px: 3 }}
                      >
                        <ListItemIcon>
                          <IconifyIcon icon="mdi:trophy-outline" />
                        </ListItemIcon>
                        <ListItemText
                          primary={contest.title}
                          secondary={t('contests.type', { type: contest.type })}
                          primaryTypographyProps={{ variant: 'subtitle2', color: 'text.primary' }}
                          secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                        />
                        <Chip label={contest.categoryTitle} variant="soft" color="neutral" size="small" />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <EmptyState message={t('search.contestsEmpty')} />
              )}
            </ResultSection>

            {showEmptyState && <EmptyState message={t('search.noResults')} />}
          </>
        )}
      </SimpleBar>
    </>
  );
};

export const SearchField = ({
  handleClose,
  value,
  onChange,
}: {
  handleClose: () => void;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
  const initialFocusRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    initialFocusRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <SearchTextField
      fullWidth
      value={value}
      onChange={onChange}
      sx={{
        [`& .${inputBaseClasses.root}`]: {
          borderRadius: '4px 4px 0 0',
          border: 1,
          borderColor: 'transparent',
          [`&.${inputBaseClasses.focused}`]: {
            outline: 'none',
            border: 1,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            borderColor: 'primary.main',
            boxShadow: 'none',
          },
        },
      }}
      slotProps={{
        input: {
          inputProps: {
            ref: initialFocusRef,
          },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" edge="end" onClick={handleClose}>
                <IconifyIcon icon="material-symbols:close-rounded" color="grey.500" />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

const ResultSection = ({
  title,
  action,
  children,
  bottomDivider = true,
}: PropsWithChildren<{ title: string; bottomDivider?: boolean; action?: ReactNode }>) => {
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 3, py: 1.5 }}>
        <Typography
          variant="caption"
          component="h6"
          sx={{
            fontWeight: 'medium',
            color: 'text.disabled',
          }}
        >
          {title}
        </Typography>
        {action}
      </Stack>
      {children}
      {bottomDivider && <Divider />}
    </Box>
  );
};

const LoadingIndicator = ({ message }: { message: string }) => (
  <Stack direction="row" alignItems="center" gap={1.5} sx={{ px: 3, py: 1.5 }}>
    <CircularProgress size={16} />
    <Typography variant="body2" color="text.secondary">
      {message}
    </Typography>
  </Stack>
);

const EmptyState = ({ message }: { message: string }) => (
  <Box sx={{ px: 3, py: 2 }}>
    <Typography variant="body2" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

export default SearchResult;
