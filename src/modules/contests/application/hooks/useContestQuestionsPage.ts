import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { submitContestQuestion } from 'modules/contests/application/mutations';
import {
  useContest,
  useContestProblems,
  useContestQuestions,
} from 'modules/contests/application/queries';
import { ContestStatus } from 'modules/contests/domain/entities/contest-status';

export const useContestQuestionsPage = () => {
  const { id } = useParams<{ id: string }>();

  const contestId = id ? Number(id) : undefined;

  const { data: contest, isLoading: isContestLoading, error: contestError } = useContest(contestId);

  const canLoadContestProblems = Boolean(
    contest && contest.statusCode !== ContestStatus.NotStarted,
  );

  const { data: contestProblems = [] } = useContestProblems(
    contestId,
    undefined,
    canLoadContestProblems,
  );

  useDocumentTitle(
    contest?.title ? 'pageTitles.contestQuestions' : undefined,
    contest?.title
      ? {
          contestTitle: contest.title,
        }
      : undefined,
  );

  const {
    data: questions = [],
    isLoading: isQuestionsLoading,
    error: sectionError,
    mutate,
  } = useContestQuestions(contestId);

  const [selectedProblem, setSelectedProblem] = useState<string>('');

  const [question, setQuestion] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitError, setSubmitError] = useState(false);

  const canAsk = contest?.userInfo?.isRegistered && contest?.statusCode === ContestStatus.Already;

  const problemOptions = useMemo(
    () =>
      contestProblems.map((problem) => ({
        value: problem.symbol,
        label: `${problem.symbol}. ${problem.problem.title}`,
      })),
    [contestProblems],
  );

  const handleSubmit = async () => {
    if (!contest?.id || !canAsk || !question.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(false);
    try {
      await submitContestQuestion(contest.id, {
        problem: selectedProblem || null,
        question: question.trim(),
      });
      setQuestion('');
      await mutate();
    } catch {
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  return {
    contest,
    isContestLoading,
    contestError,
    questions,
    isQuestionsLoading,
    sectionError,
    handleSubmit,
    contestId,
    canAsk,
    problemOptions,
    question,
    setQuestion,
    isSubmitting,
    submitError,
    selectedProblem,
    setSelectedProblem,
  };
};
