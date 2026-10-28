import { useEffect, useMemo, useState } from 'react';
import { useAuth } from 'app/providers/AuthProvider';
import { useKepcoinSummary, useTaskCategories } from 'modules/kepcoin/application/queries';
import type { OneTimeTask } from 'modules/kepcoin/domain/entities/kepcoin.entity';
import { consumePendingTaskSlug } from 'modules/kepcoin/lib/pending-task-storage';

type TaskFilter = 'all' | 'completed' | 'uncompleted';

export const useKepcoinEarnPage = () => {
  const { refreshCurrentUser } = useAuth();

  const [selectedTaskSlug, setSelectedTaskSlug] = useState<string | null>(null);

  const [taskFilter, setTaskFilter] = useState<TaskFilter>('all');

  const [pendingRestoreSlug, setPendingRestoreSlug] = useState<string | null>(() =>
    consumePendingTaskSlug(),
  );

  const { mutate: reloadSummary } = useKepcoinSummary();

  const {
    data: taskCategoriesResponse,
    isLoading: isTasksLoading,
    mutate: reloadTasks,
  } = useTaskCategories();

  const taskCategories = taskCategoriesResponse?.categories ?? [];

  const allTasks = useMemo(
    () => taskCategories.flatMap((category) => category.tasks),
    [taskCategories],
  );

  const filteredCategories = useMemo(() => {
    if (taskFilter === 'all') {
      return taskCategories;
    }

    return taskCategories
      .map((category) => ({
        ...category,
        tasks: category.tasks.filter((task) =>
          taskFilter === 'completed' ? task.status === 'completed' : task.status !== 'completed',
        ),
      }))
      .filter((category) => category.tasks.length > 0);
  }, [taskCategories, taskFilter]);

  const selectedTask = useMemo(
    () => allTasks.find((task) => task.slug === selectedTaskSlug) ?? null,
    [allTasks, selectedTaskSlug],
  );

  useEffect(() => {
    if (isTasksLoading || !pendingRestoreSlug) {
      return;
    }

    if (allTasks.some((task) => task.slug === pendingRestoreSlug)) {
      setSelectedTaskSlug(pendingRestoreSlug);
    }

    setPendingRestoreSlug(null);
  }, [allTasks, isTasksLoading, pendingRestoreSlug]);

  useEffect(() => {
    if (selectedTaskSlug && taskCategories.length > 0 && !selectedTask) {
      setSelectedTaskSlug(null);
    }
  }, [selectedTask, selectedTaskSlug, taskCategories.length]);

  const handleOpenTask = (task: OneTimeTask) => {
    setSelectedTaskSlug(task.slug);
  };

  const handleCloseTask = () => {
    setSelectedTaskSlug(null);
  };

  const handleTaskCompleted = async () => {
    await Promise.all([reloadSummary(), reloadTasks(), refreshCurrentUser()]);
  };
  return {
    isTasksLoading,
    filteredCategories,
    selectedTask,
    handleTaskCompleted,
    taskFilter,
    setTaskFilter,
    handleOpenTask,
    handleCloseTask,
  };
};
