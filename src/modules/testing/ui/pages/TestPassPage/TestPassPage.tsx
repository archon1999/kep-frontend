import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Drawer, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useNavContext } from 'app/layouts/main-layout/NavProvider';
import { useTestPassPage } from 'modules/testing/application/hooks/useTestPassPage';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import EmptyState from 'shared/components/common/EmptyState';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';
import TestFinishDialog from './components/TestFinishDialog';
import TestPassActions from './components/TestPassActions';
import TestPassMobileToolbar from './components/TestPassMobileToolbar';
import { TestPassQuestionContent } from './components/TestPassQuestionContent';
import TestPassSidebar from './components/TestPassSidebar';
import TestPassSkeleton from './components/TestPassSkeleton';

const TestPassPage = () => {
  const m = useTestPassPage(),
    { t } = useTranslation(),
    theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('md'));
  const { topbarHeight } = useNavContext();
  const anchor = useRef<HTMLDivElement>(null),
    previous = useRef<number | undefined>(undefined);
  useEffect(() => {
    const old = previous.current,
      next = m.currentQuestion?.number;
    previous.current = next;
    if (!mobile || old === undefined || next === undefined || old === next) return;
    const frame = requestAnimationFrame(() => anchor.current?.scrollIntoView({ block: 'start' }));
    return () => cancelAnimationFrame(frame);
  }, [m.currentQuestion?.number, mobile]);
  const closeResult = () => {
    m.setFinishResult(null);
    m.handleNavigateToTest();
  };
  if (m.isLoading || (!m.error && m.testPass?.test.questions?.length && !m.currentQuestion))
    return <TestPassSkeleton />;
  const title = m.testPass?.test.title ?? t('tests.passTitle');
  if (m.error || !m.testPass || !m.currentQuestion)
    return (
      <FramedPage>
        <PageHeader title={title} />
        <EmptyState
          kind={m.error ? 'error' : 'empty'}
          title={t(m.error ? 'tests.passLoadError' : 'tests.noQuestions')}
          action={
            m.error ? (
              <Button variant="outlined" onClick={() => void m.mutate()}>
                {t('tests.retry')}
              </Button>
            ) : undefined
          }
        />
      </FramedPage>
    );
  const disabled = m.isSubmitting || m.isFinishing || m.isFinished;
  return (
    <FramedPage>
      <PageHeader
        title={title}
        subtitle={m.testPass.test.chapter?.title || t('tests.passTitle')}
        actionComponent={
          !mobile ? (
            <Stack
              direction="row"
              gap={1.5}
              alignItems="center"
              role="timer"
              aria-label={t('tests.timeLeft')}
              sx={{ color: m.remainingMs < 60000 ? 'warning.main' : 'primary.main' }}
            >
              <IconifyIcon icon="mdi:timer-outline" sx={{ fontSize: 24 }} />
              <Stack gap={0.5}>
                <Typography variant="label" color="text.secondary">
                  {t('tests.timeLeft')}
                </Typography>
                <Typography variant="metric" sx={{ fontSize: 30 }}>
                  {m.timeLeft.hours}:{m.timeLeft.minutes}:{m.timeLeft.seconds}
                </Typography>
              </Stack>
            </Stack>
          ) : undefined
        }
      />
      {mobile && (
        <Box sx={{ px: 'var(--kep-content-inset)' }}>
          <TestPassMobileToolbar
            currentNumber={m.currentQuestion.number}
            total={m.questions.length}
            time={m.timeLeft.hours + ':' + m.timeLeft.minutes + ':' + m.timeLeft.seconds}
            urgent={m.remainingMs < 60000}
            disabled={disabled}
            questionsOpen={m.questionsOpen}
            onOpenQuestions={() => m.setQuestionsOpen(true)}
          />
        </Box>
      )}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,1fr) 320px' },
          minWidth: 0,
        }}
      >
        <Stack
          ref={anchor}
          gap={3}
          sx={{
            p: 'var(--kep-content-inset)',
            pb: mobile ? 'calc(88px + env(safe-area-inset-bottom))' : 4,
            minWidth: 0,
            scrollMarginTop: theme.mixins.topOffset(
              topbarHeight ?? theme.mixins.topbar.default,
              76,
            ),
            '& input, & textarea': {
              scrollMarginBottom: 'calc(88px + env(safe-area-inset-bottom))',
            },
          }}
        >
          <Stack
            direction="row"
            gap={2}
            alignItems="center"
            justifyContent="space-between"
            sx={{ pb: 2, borderBottom: '1px solid var(--kep-line)' }}
          >
            <Typography variant="label" color="text.secondary">
              {t('tests.questionLabel', {
                index: m.currentQuestion.number,
                total: m.questions.length,
              })}
            </Typography>
            <Stack
              direction="row"
              gap={0.75}
              alignItems="center"
              color={m.currentQuestion.answered ? 'success.main' : 'text.secondary'}
            >
              {m.currentQuestion.answered && (
                <IconifyIcon icon="mdi:check-circle-outline" sx={{ fontSize: 16 }} />
              )}
              <Typography variant="caption">
                {t(m.currentQuestion.answered ? 'tests.answered' : 'tests.notAnswered')}
              </Typography>
            </Stack>
          </Stack>
          <TestPassQuestionContent
            currentQuestion={m.currentQuestion}
            ensureState={m.ensureState}
            updateState={m.updateState}
          />
          <TestPassActions
            mobile={mobile}
            previousDisabled={m.currentIndex === 0}
            disabled={disabled}
            submitting={m.isSubmitting}
            onPrevious={() => void m.handleQuestionSelect(m.currentIndex - 1)}
            onSubmit={() => void m.handleSubmitAnswer()}
          />
        </Stack>
        {!mobile && (
          <Box
            component="aside"
            sx={{ minWidth: 0, borderInlineStart: '1px solid var(--kep-line)' }}
          >
            <TestPassSidebar
              questions={m.questions}
              currentIndex={m.currentIndex}
              disabled={disabled}
              isFinishing={m.isFinishing}
              onQuestionSelect={m.handleQuestionSelect}
              onFinish={() => void m.handleFinish()}
            />
          </Box>
        )}
      </Box>
      <Drawer
        anchor="bottom"
        open={mobile && m.questionsOpen}
        onClose={() => m.setQuestionsOpen(false)}
        slotProps={{
          paper: {
            id: 'test-mobile-questions',
            role: 'dialog',
            'aria-labelledby': 'test-mobile-questions-title',
            sx: { maxHeight: '80dvh', pb: 'env(safe-area-inset-bottom)' },
          },
        }}
      >
        <TestPassSidebar
          mobile
          questions={m.questions}
          currentIndex={m.currentIndex}
          disabled={disabled}
          isFinishing={m.isFinishing}
          onClose={() => m.setQuestionsOpen(false)}
          onQuestionSelect={async (index) => {
            if (await m.handleQuestionSelect(index)) m.setQuestionsOpen(false);
          }}
          onFinish={() => void m.handleFinish()}
        />
      </Drawer>
      <TestFinishDialog
        open={m.isFinished}
        result={m.hasFinishResult ? m.finishResult : null}
        total={m.testPass.test.questionsCount ?? m.questions.length}
        onClose={closeResult}
      />
    </FramedPage>
  );
};
export default TestPassPage;
