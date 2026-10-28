import { useMemo } from 'react';
import { useBlogAuthors, useBlogPosts, useBlogTopics } from 'modules/blog/application/queries';
import type { BlogFilterState } from 'modules/blog/domain/entities/blog-filter.types';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { numberParam, stringParam } from 'shared/lib/queryParams';

export const PAGE_SIZE = 10;

const initialFilters: BlogFilterState = {
  title: '',
  author: '',
  orderBy: '',
  topic: '',
};

export const useBlogListPage = () => {
  const { state, patchState, resetState, setField } = useRouteQueryState({
    defaults: {
      ...initialFilters,
      page: 1,
    },
    schema: {
      title: {
        ...stringParam(),
        param: 'title',
      },
      author: {
        ...stringParam(),
        param: 'author',
      },
      orderBy: {
        ...stringParam(),
        param: 'orderBy',
      },
      topic: {
        ...stringParam(),
        param: 'topic',
      },
      page: {
        ...numberParam({ min: 1 }),
        param: 'page',
      },
    },
    historyByKey: {
      page: 'push',
    },
    pageResetKeys: ['title', 'author', 'orderBy', 'topic'],
  });

  const filters = useMemo<BlogFilterState>(
    () => ({
      title: state.title,
      author: state.author,
      orderBy: state.orderBy,
      topic: state.topic,
    }),
    [state.author, state.orderBy, state.title, state.topic],
  );

  const listParams = useMemo(
    () => ({
      page: state.page,
      pageSize: PAGE_SIZE,
      title: filters.title || undefined,
      author: filters.author || undefined,
      order_by: filters.orderBy || undefined,
      topic: filters.topic || undefined,
    }),
    [filters.title, filters.author, filters.orderBy, filters.topic, state.page],
  );

  const { data: postsPage, isLoading, error, mutate } = useBlogPosts(listParams);

  const { data: authors = [] } = useBlogAuthors();

  const { data: topics = [] } = useBlogTopics();

  const posts = postsPage?.data ?? [];

  const total = postsPage?.total ?? posts.length;

  const handleFilterChange = (next: BlogFilterState) => patchState(next);

  const handleResetFilters = () => resetState(['title', 'author', 'orderBy', 'topic', 'page']);

  const hasActiveFilters = Boolean(
    filters.title || filters.author || filters.orderBy || filters.topic,
  );

  const featuredPost = state.page === 1 && !hasActiveFilters ? posts[0] : undefined;

  const remainingPosts = featuredPost ? posts.slice(1) : posts;
  return {
    state,
    setField,
    isLoading,
    error,
    mutate,
    authors,
    topics,
    filters,
    posts,
    total,
    handleFilterChange,
    handleResetFilters,
    hasActiveFilters,
    featuredPost,
    remainingPosts,
  };
};
