import { useTranslation } from 'react-i18next';
import { Button, Stack, Typography } from '@mui/material';
import { useNavContext } from 'app/layouts/main-layout/NavProvider';
import IconifyIcon from 'shared/components/base/IconifyIcon';

interface Props {
  currentNumber: number;
  total: number;
  time: string;
  urgent: boolean;
  disabled: boolean;
  questionsOpen: boolean;
  onOpenQuestions: () => void;
}

const TestPassMobileToolbar = ({
  currentNumber,
  total,
  time,
  urgent,
  disabled,
  questionsOpen,
  onOpenQuestions,
}: Props) => {
  const { t } = useTranslation();
  const { topbarHeight } = useNavContext();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      gap={1}
      data-test-pass-mobile-toolbar
      sx={(theme) => ({
        position: 'sticky',
        top: topbarHeight ?? theme.mixins.topbar.default,
        zIndex: theme.zIndex.appBar - 1,
        py: 1,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      })}
    >
      <Button
        variant="outlined"
        color="neutral"
        disabled={disabled}
        onClick={onOpenQuestions}
        aria-haspopup="dialog"
        aria-expanded={questionsOpen}
        aria-controls={questionsOpen ? 'test-mobile-questions' : undefined}
        aria-label={`${t('tests.questions')}, ${t('tests.questionLabel', { index: currentNumber, total })}`}
        startIcon={<IconifyIcon icon="material-symbols:grid-view-outline-rounded" fontSize={20} />}
        sx={{ minHeight: 44, px: 1.25, gap: 0.75, fontSize: '0.875rem', whiteSpace: 'nowrap' }}
      >
        {t('tests.questions')}
        <Typography component="span" variant="caption" sx={{ fontVariantNumeric: 'tabular-nums' }}>
          {currentNumber}/{total}
        </Typography>
      </Button>
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.75}
        role="timer"
        aria-label={t('tests.timeLeft')}
        sx={{ flexShrink: 0, color: urgent ? 'warning.dark' : 'text.primary' }}
      >
        <IconifyIcon icon="material-symbols:timer-outline-rounded" fontSize={20} />
        <Typography variant="body2" fontWeight={600} sx={{ fontVariantNumeric: 'tabular-nums' }}>
          {time}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default TestPassMobileToolbar;
