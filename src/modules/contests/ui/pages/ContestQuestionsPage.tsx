import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { contestsQueries, useContest, useContestProblems, useContestQuestions } from '../../application/queries';
import { ContestQuestion } from '../../domain/entities/contest-question.entity';
import { ContestStatus } from '../../domain/entities/contest-status';
import ContestCountdownCard from '../components/ContestCountdownCard';
import ContestPageHeader from '../components/ContestPageHeader';

const ContestQuestionsPage = () => {
  const { id } = useParams<{ id: string }>();
  const contestId = id ? Number(id) : undefined;
  const { t } = useTranslation();

  const { data: contest, isLoading: isContestLoading } = useContest(contestId);
  const { data: contestProblems = [] } = useContestProblems(contestId);
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
    mutate,
  } = useContestQuestions(contestId);

  const [selectedProblem, setSelectedProblem] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const canAsk =
    contest?.userInfo?.isRegistered && contest?.statusCode === ContestStatus.Already;

  const problemOptions = useMemo(
    () =>
      contestProblems.map((problem) => ({
        value: problem.symbol,
        label: `${problem.symbol}. ${problem.problem.title}`,
      })),
    [contestProblems],
  );

  const handleSubmit = async () => {
    if (!contest?.id || !question.trim()) return;
    await contestsQueries.contestsRepository.submitQuestion(contest.id, {
      problem: selectedProblem || null,
      question: question.trim(),
    });
    setQuestion('');
    await mutate();
  };

  return (
    <Stack spacing={3} sx={responsivePagePaddingSx}>
      <ContestPageHeader
        title={contest?.title ?? t('contests.questions.title')}
        contest={contest as any}
        contestId={contestId}
        isLoading={isContestLoading}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={700}>
                  {t('contests.questions.title')}
                </Typography>

                {isQuestionsLoading ? (
                  <Stack spacing={1.25}>
                    {Array.from({ length: 3 }).map((_, index) => (
                      <Box
                        key={index}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          bgcolor: 'background.paper',
                        }}
                      >
                        <Stack direction="row" spacing={1} justifyContent="space-between">
                          <Skeleton variant="text" width="40%" />
                          <Skeleton variant="text" width="20%" />
                        </Stack>
                        <Skeleton variant="text" width="80%" sx={{ mt: 1 }} />
                        <Skeleton variant="text" width="65%" />
                      </Box>
                    ))}
                  </Stack>
                ) : questions.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    {t('contests.questions.empty')}
                  </Typography>
                ) : (
                  <Stack spacing={1.5}>
                    {questions.map((item: ContestQuestion, index) => (
                      <Box
                        key={`${item.username}-${index}`}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          bgcolor: 'background.paper',
                        }}
                      >
                        <Stack direction="row" spacing={1} justifyContent="space-between">
                          <Stack spacing={0.25}>
                            <Typography variant="subtitle2" fontWeight={700}>
                              {item.username}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.problemSymbol}. {item.problemTitle}
                            </Typography>
                          </Stack>
                          <Typography variant="caption" color="text.secondary">
                            {item.created ?? ''}
                          </Typography>
                        </Stack>

                        <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                          {item.question}
                        </Typography>

                        {item.answer ? (
                          <Box
                            sx={{
                              mt: 1,
                              p: 1.25,
                              borderRadius: 1.5,
                              bgcolor: 'background.neutral',
                            }}
                          >
                            <Typography variant="subtitle2" fontWeight={700}>
                              {t('contests.questions.answer')}
                            </Typography>
                            <Typography
                              variant="body2"
                              component="div"
                              sx={{ mt: 0.5 }}
                              dangerouslySetInnerHTML={{ __html: item.answer }}
                            />
                          </Box>
                        ) : null}
                      </Box>
                    ))}
                  </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>

          {canAsk ? (
            <Card variant="outlined" sx={{ borderRadius: 3, mt: 2 }}>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6" fontWeight={700}>
                    {t('contests.questions.ask')}
                  </Typography>
                  <FormControl variant="standard" size="small" fullWidth>
                    <InputLabel id="contest-question-problem-label">
                      {t('contests.questions.problem')}
                    </InputLabel>
                    <Select
                      labelId="contest-question-problem-label"
                      label={t('contests.questions.problem')}
                      value={selectedProblem}
                      onChange={(event) => setSelectedProblem(event.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">{t('contests.questions.anyProblem')}</MenuItem>
                      {problemOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label={t('contests.questions.question')}
                    multiline
                    minRows={4}
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                  />

                  <Button variant="contained" onClick={handleSubmit} disabled={!question.trim()}>
                    {t('contests.questions.submit')}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ) : null}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <ContestCountdownCard contest={contest} isLoading={isContestLoading} />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ContestQuestionsPage;
