import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceById, resources } from 'app/routes/resources';
import { startTest } from 'modules/testing/application/mutations';
import { useTestDetail, useTestResults } from 'modules/testing/application/queries';
import { toast } from 'sonner';

export const useTestDetailPage = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { id } = useParams();

  const { data: test, error, isLoading, mutate } = useTestDetail(id);

  const {
    data: results,
    error: resultsError,
    isLoading: isResultsLoading,
    mutate: refreshResults,
  } = useTestResults(id);

  const [canStart, setCanStart] = useState(false);

  const [isStarting, setIsStarting] = useState(false);

  useDocumentTitle(
    test ? 'pageTitles.test' : undefined,
    test ? { testTitle: test.title ?? '' } : undefined,
  );

  useEffect(() => {
    setCanStart(Boolean(test?.canStart));
  }, [test?.id, test?.canStart]);

  const handleStart = async () => {
    if (!test || isStarting) return;

    setIsStarting(true);
    try {
      const response = await startTest(test.id);
      if (response.success && response.testPassId) {
        navigate(getResourceById(resources.TestPass, response.testPassId));
        return;
      }
      toast.error(t('tests.startError'));
    } catch {
      toast.error(t('tests.startError'));
    } finally {
      setIsStarting(false);
    }
  };

  const questionsCount = test?.questionsCount ?? test?.questions?.length ?? 0;
  return {
    test,
    error,
    isLoading,
    mutate,
    results,
    resultsError,
    isResultsLoading,
    refreshResults,
    handleStart,
    isStarting,
    questionsCount,
    canStart,
    setCanStart,
  };
};
