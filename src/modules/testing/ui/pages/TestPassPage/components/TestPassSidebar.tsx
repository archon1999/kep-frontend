import { useTranslation } from 'react-i18next';
import { Box, Button, IconButton, LinearProgress, Stack, Typography } from '@mui/material';
import { TestPassQuestion } from 'modules/testing/domain/entities/test-pass.types';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import SectionHeader from 'shared/components/sections/common/SectionHeader';

type Props = {
  questions: TestPassQuestion[];
  currentIndex: number;
  disabled: boolean;
  isFinishing: boolean;
  onQuestionSelect: (index: number) => void;
  onFinish: () => void;
  mobile?: boolean;
  onClose?: () => void;
};
const TestPassSidebar = ({
  questions,
  currentIndex,
  disabled,
  isFinishing,
  onQuestionSelect,
  onFinish,
  mobile = false,
  onClose,
}: Props) => {
  const { t } = useTranslation(),
    answered = questions.filter((q) => q.answered).length;
  return (
    <Box
      component="section"
      className="kep-test-questions"
      sx={{
        minWidth: 0,
        bgcolor: 'background.default',
        position: mobile ? undefined : 'sticky',
        top: 0,
        maxHeight: mobile ? '80dvh' : undefined,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <SectionHeader
        title={t('tests.questions')}
        id={mobile ? 'test-mobile-questions-title' : undefined}
        action={
          <Stack direction="row" gap={1} alignItems="center">
            <Typography variant="metric" color="primary.main" sx={{ fontSize: 22 }}>
              {answered}
              <Typography
                component="span"
                variant="metric"
                color="text.secondary"
                sx={{ fontSize: 14 }}
              >
                {' '}
                / {questions.length}
              </Typography>
            </Typography>
            {mobile ? (
              <IconButton onClick={onClose} aria-label={t('tests.closeQuestions')} size="small">
                <IconifyIcon icon="mdi:close" />
              </IconButton>
            ) : (
              <PatternArtwork kind="daily-tasks" sx={{ width: 64, opacity: 0.4 }} />
            )}
          </Stack>
        }
      />
      <Stack gap={2.5} sx={{ p: 'var(--kep-content-inset)', minHeight: 0, overflowY: 'auto' }}>
        <Stack gap={1}>
          <Typography variant="body2" color="text.secondary">
            {t('tests.savedAnswers', { count: answered, total: questions.length })}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={questions.length ? (answered / questions.length) * 100 : 0}
            aria-label={t('tests.savedAnswers', { count: answered, total: questions.length })}
            sx={{ height: 3, bgcolor: 'action.selected' }}
          />
        </Stack>
        <Box
          component="nav"
          aria-label={t('tests.questions')}
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5,minmax(0,1fr))',
            gap: 1,
            maxHeight: mobile ? '40dvh' : 340,
            overflowY: 'auto',
            p: 0.25,
            minHeight: 0,
          }}
        >
          {questions.map((q, i) => (
            <Button
              key={q.id ?? q.number}
              variant={i === currentIndex ? 'contained' : 'outlined'}
              color={q.answered ? 'success' : 'primary'}
              aria-current={i === currentIndex ? 'step' : undefined}
              aria-label={
                t('tests.questionLabel', { index: q.number, total: questions.length }) +
                ', ' +
                t(q.answered ? 'tests.answered' : 'tests.notAnswered')
              }
              disabled={disabled}
              onClick={() => onQuestionSelect(i)}
              sx={{
                minWidth: 0,
                p: 0,
                height: 44,
                borderRadius: 0,
                fontFamily: 'var(--kep-display-font)',
                fontFeatureSettings: '"ss01" 1',
                fontSize: 17,
                borderColor: i === currentIndex ? undefined : 'var(--kep-line)',
                color:
                  i === currentIndex ? undefined : q.answered ? 'success.main' : 'text.secondary',
              }}
            >
              {String(q.number).padStart(2, '0')}
            </Button>
          ))}
        </Box>
        <Stack direction="row" gap={2} flexWrap="wrap">
          {[
            { key: 'tests.answered', color: 'success.main' },
            { key: 'tests.notAnswered', color: 'text.disabled' },
          ].map((s) => (
            <Stack key={s.key} direction="row" gap={0.75} alignItems="center">
              <Box sx={{ width: 5, height: 5, bgcolor: s.color }} />
              <Typography variant="caption" color="text.secondary">
                {t(s.key)}
              </Typography>
            </Stack>
          ))}
        </Stack>
        <Box sx={{ pt: 2.5, borderTop: '1px solid var(--kep-line)' }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={onFinish}
            disabled={disabled}
            loading={isFinishing}
            endIcon={<IconifyIcon icon="mdi:flag-checkered" />}
          >
            {t('tests.finishTest')}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};
export default TestPassSidebar;
