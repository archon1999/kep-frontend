import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useAuth } from 'app/providers/AuthProvider';
import { useTestsCatalog } from 'modules/testing/application/queries';

export const useTestsListPage = () => {
  const { currentUser, isAuthLoading } = useAuth();

  const {
    data: tests = [],
    isLoading: isCatalogLoading,
    error,
    mutate,
  } = useTestsCatalog(currentUser?.username, !isAuthLoading);

  const isLoading = isAuthLoading || isCatalogLoading;

  const completion = useMemo(
    () =>
      Object.fromEntries(
        tests
          .filter((test) => typeof test.userCompleted === 'boolean')
          .map((test) => [test.id, test.userCompleted!]),
      ),
    [tests],
  );

  const [searchParams, setSearchParams] = useSearchParams();

  const chapterParam = searchParams.get('chapter');

  const parsedChapterId = chapterParam && /^\d+$/.test(chapterParam) ? Number(chapterParam) : 0;

  const chapterId =
    Number.isSafeInteger(parsedChapterId) && parsedChapterId > 0 ? parsedChapterId : 0;

  const [view, setView] = useState('topics');

  const [search, setSearch] = useState('');

  const [difficulty, setDifficulty] = useState(0);

  useEffect(() => {
    setSearch('');
    setDifficulty(0);
  }, [chapterId]);

  const chapters = useMemo(() => {
    const grouped = new Map<
      number,
      { id: number; title: string; icon: string; count: number; completed: number }
    >();
    tests.forEach((test) => {
      const chapter = grouped.get(test.chapter.id);
      const completed = completion?.[test.id] ? 1 : 0;
      if (chapter) {
        chapter.count += 1;
        chapter.completed += completed;
      } else grouped.set(test.chapter.id, { ...test.chapter, count: 1, completed });
    });
    return [...grouped.values()].sort((a, b) => a.id - b.id);
  }, [tests, completion]);

  const selectedChapter = chapters.find((chapter) => chapter.id === chapterId);

  const showTopics = view === 'topics' && !search.trim() && !chapterId;

  const difficulties = useMemo(
    () =>
      [...new Map(tests.map((test) => [test.difficulty, test.difficultyTitle])).entries()].sort(
        ([a], [b]) => a - b,
      ),
    [tests],
  );

  const filteredTests = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    const filtered = tests.filter(
      (test) =>
        (!chapterId || test.chapter.id === chapterId) &&
        (!difficulty || test.difficulty === difficulty) &&
        (!query ||
          [
            test.title,
            test.description,
            test.chapter.title,
            ...(test.tags ?? []).map((tag) => tag.name),
          ].some((value) => value.toLocaleLowerCase().includes(query))),
    );
    return filtered.sort((a, b) => a.chapter.id - b.chapter.id || a.id - b.id);
  }, [tests, chapterId, difficulty, search]);

  const resetFilters = () => {
    setSearch('');
    setDifficulty(0);
    if (searchParams.has('chapter')) {
      setSearchParams((previous) => {
        const next = new URLSearchParams(previous);
        next.delete('chapter');
        return next;
      });
    }
  };

  const openTopics = () => {
    resetFilters();
    setView('topics');
  };
  return {
    tests,
    error,
    mutate,
    setSearchParams,
    isLoading,
    completion,
    chapterId,
    chapters,
    selectedChapter,
    showTopics,
    difficulties,
    filteredTests,
    resetFilters,
    openTopics,
    search,
    setSearch,
    difficulty,
    setDifficulty,
    view,
    setView,
  };
};
