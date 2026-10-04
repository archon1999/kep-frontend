import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { TestPassQuestion } from '../types';

interface TestPassSidebarProps {
  questions: TestPassQuestion[];
  currentIndex: number;
  disabled: boolean;
  isFinishing: boolean;
  onQuestionSelect: (index: number) => void;
  onFinish: () => void;
  mobile?: boolean;
  onClose?: () => void;
}

const TestPassSidebar = ({
  questions,
  currentIndex,
  disabled,
  isFinishing,
  onQuestionSelect,
  onFinish,
  mobile = false,
  onClose,
}: TestPassSidebarProps) => {
  const { t } = useTranslation();
  const answeredCount = questions.filter((question) => question.answered).length;

  return (
    <Paper
      variant="elevation"
      elevation={0}
      sx={{
        bgcolor: mobile ? 'background.paper' : 'background.elevation1',
        border: 0,
        borderRadius: mobile ? 0 : 4,
        overflow: 'hidden',
        position: mobile ? undefined : { md: 'sticky' },
        top: { md: 96 },
      }}
    >
      <Stack
        spacing={mobile ? 1.5 : 2.5}
        sx={{ p: mobile ? 2 : 2.5, maxHeight: mobile ? '80dvh' : undefined, minHeight: 0 }}
      >
        <Stack spacing={1.25} sx={{ flexShrink: 0 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography
              component="h2"
              id={mobile ? 'test-mobile-questions-title' : undefined}
              variant="subtitle1"
              fontWeight={600}
            >
              {t('tests.questions')}
            </Typography>
            <Stack direction="row" alignItems="center" gap={1}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {answeredCount}/{questions.length}
              </Typography>
              {mobile && (
                <IconButton
                  onClick={onClose}
                  aria-label={t('tests.closeQuestions')}
                  sx={{ width: 44, height: 44 }}
                >
                  <IconifyIcon icon="material-symbols:close-rounded" fontSize={24} />
                </IconButton>
              )}
            </Stack>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {t('tests.savedAnswers', { count: answeredCount, total: questions.length })}
          </Typography>
          <LinearProgress
            aria-label={t('tests.savedAnswers', { count: answeredCount, total: questions.length })}
            variant="determinate"
            value={questions.length ? (answeredCount / questions.length) * 100 : 0}
            color="success"
            sx={{ height: 4, borderRadius: 1 }}
          />
        </Stack>
        <Box
          component="nav"
          aria-label={t('tests.questions')}
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(5, minmax(0, 1fr))',
              sm: 'repeat(6, minmax(0, 1fr))',
              md: 'repeat(5, minmax(0, 1fr))',
              lg: 'repeat(6, minmax(0, 1fr))',
            },
            gap: 1,
            maxHeight: mobile ? '40dvh' : { md: 320 },
            minHeight: 0,
            flexShrink: 1,
            overflowY: 'auto',
            p: 0.5,
            m: -0.5,
          }}
        >
          {questions.map((question, index) => {
            const isCurrent = index === currentIndex;

            return (
              <Button
                key={question.id ?? question.number}
                variant={isCurrent ? 'contained' : 'soft'}
                color={isCurrent ? 'primary' : question.answered ? 'success' : 'neutral'}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`${t('tests.questionLabel', { index: question.number, total: questions.length })}, ${t(question.answered ? 'tests.answered' : 'tests.notAnswered')}`}
                onClick={() => onQuestionSelect(index)}
                disabled={disabled}
                sx={{
                  minWidth: 0,
                  height: mobile ? 44 : 40,
                  p: 0,
                  borderRadius: 1.25,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {question.number}
              </Button>
            );
          })}
        </Box>
        <Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap" sx={{ flexShrink: 0 }}>
          {[
            { label: 'tests.answered', color: 'success.main' },
            { label: 'tests.notAnswered', color: 'text.disabled' },
          ].map(({ label, color }) => (
            <Stack key={label} direction="row" alignItems="center" spacing={0.75}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color }} />
              <Typography variant="caption" color="text.secondary">
                {t(label)}
              </Typography>
            </Stack>
          ))}
        </Stack>
        <Divider sx={{ flexShrink: 0 }} />
        <Button
          variant="outlined"
          color="neutral"
          fullWidth
          onClick={onFinish}
          disabled={disabled}
          startIcon={isFinishing ? <CircularProgress size={18} color="inherit" /> : undefined}
          sx={{ minHeight: mobile ? 44 : undefined, flexShrink: 0 }}
        >
          {t('tests.finishTest')}
        </Button>
      </Stack>
    </Paper>
  );
};

export default TestPassSidebar;
