import { useTranslation } from 'react-i18next';
import {
  Alert,
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
import { useContestQuestionsPage } from 'modules/contests/application/hooks/useContestQuestionsPage';
import ContestCountdownCard from 'modules/contests/ui/shared/components/ContestCountdownCard';
import ContestPageHeader from 'modules/contests/ui/shared/components/ContestPageHeader';
import ContestPageLayout from 'modules/contests/ui/shared/components/ContestPageLayout';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import ContestQuestionItem from './components/ContestQuestionItem';

const ContestQuestionsPage = () => {
  const {
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
  } = useContestQuestionsPage();

  const { t } = useTranslation();

  return (
    <ContestPageLayout
      flush
      error={contestError || sectionError}
      header={
        <ContestPageHeader
          title={contest?.title ?? t('contests.questions.title')}
          contest={contest}
          contestId={contestId}
          isLoading={isContestLoading}
        />
      }
    >
      <Grid container spacing={0}>
        <Grid size={{ xs: 12, md: 8 }} sx={{ minWidth: 0 }}>
          <Stack
            direction="row"
            gap={1.25}
            alignItems="center"
            sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}
          >
            <IconifyIcon
              icon="mdi:comment-question-outline"
              sx={{ color: 'primary.main', fontSize: 20 }}
            />
            <Typography variant="label" component="h2">
              {t('contests.questions.title')}
            </Typography>
            <Typography variant="metric" color="primary.main" sx={{ ml: 'auto', fontSize: 24 }}>
              {isQuestionsLoading ? '—' : questions.length}
            </Typography>
          </Stack>
          {isQuestionsLoading ? (
            <Stack sx={{ p: 3 }} gap={2}>
              {Array.from({ length: 3 }, (_, index) => (
                <Skeleton key={index} variant="rectangular" height={140} />
              ))}
            </Stack>
          ) : questions.length ? (
            <Box component="ol" sx={{ m: 0, p: 0 }}>
              {questions.map((item, index) => (
                <ContestQuestionItem key={`${item.username}-${index}`} question={item} />
              ))}
            </Box>
          ) : (
            <Stack alignItems="center" gap={2} sx={{ px: 3, py: 8 }}>
              <IconifyIcon
                icon="mdi:comment-outline"
                sx={{ fontSize: 32, color: 'primary.main' }}
              />
              <Typography color="text.secondary">{t('contests.questions.empty')}</Typography>
            </Stack>
          )}
        </Grid>
        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{
            minWidth: 0,
            borderLeft: { md: '1px solid var(--kep-line)' },
            borderTop: { xs: '1px solid var(--kep-line)', md: 0 },
          }}
        >
          <ContestCountdownCard contest={contest} isLoading={isContestLoading} />
          {canAsk && (
            <Card variant="section">
              <CardContent sx={{ p: 3 }}>
                <Stack
                  component="form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void handleSubmit();
                  }}
                  spacing={2.5}
                >
                  <Typography variant="label" component="h2">
                    {t('contests.questions.ask')}
                  </Typography>
                  {submitError && <Alert severity="error">{t('contests.detail.dataError')}</Alert>}
                  <FormControl variant="outlined" size="small" fullWidth>
                    <InputLabel id="contest-question-problem-label" shrink>
                      {t('contests.questions.problem')}
                    </InputLabel>
                    <Select
                      labelId="contest-question-problem-label"
                      label={t('contests.questions.problem')}
                      value={selectedProblem}
                      onChange={(event) => setSelectedProblem(event.target.value)}
                      displayEmpty
                      MenuProps={{ slotProps: { paper: { variant: 'framed' } } }}
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
                    variant="outlined"
                    label={t('contests.questions.question')}
                    multiline
                    minRows={5}
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting || !question.trim()}
                    endIcon={<IconifyIcon icon="mdi:arrow-top-right" />}
                  >
                    {t('contests.questions.submit')}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </ContestPageLayout>
  );
};

export default ContestQuestionsPage;
