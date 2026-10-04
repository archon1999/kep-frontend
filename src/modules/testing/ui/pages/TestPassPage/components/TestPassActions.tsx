import { useTranslation } from 'react-i18next';
import { Button, CircularProgress, IconButton, Stack } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';

interface Props {
  mobile: boolean;
  previousDisabled: boolean;
  disabled: boolean;
  submitting: boolean;
  onPrevious: () => void;
  onSubmit: () => void;
}

const TestPassActions = ({
  mobile,
  previousDisabled,
  disabled,
  submitting,
  onPrevious,
  onSubmit,
}: Props) => {
  const { t } = useTranslation();
  const previousIcon = (
    <IconifyIcon icon="material-symbols:arrow-back-rounded" sx={{ fontSize: 20 }} />
  );

  return (
    <Stack
      direction="row"
      spacing={1.5}
      justifyContent="space-between"
      role="group"
      aria-label={t('tests.answerActions')}
      data-test-pass-actions
      sx={
        mobile
          ? {
              position: 'fixed',
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: (theme) => theme.zIndex.appBar + 1,
              px: 2,
              pt: 1,
              pb: 'max(8px, env(safe-area-inset-bottom))',
              bgcolor: 'background.paper',
              borderTop: '1px solid',
              borderColor: 'divider',
            }
          : { pt: 1 }
      }
    >
      {mobile ? (
        <IconButton
          color="default"
          onClick={onPrevious}
          disabled={previousDisabled || disabled}
          aria-label={t('tests.previous')}
          sx={{ width: 44, height: 44, flexShrink: 0 }}
        >
          {previousIcon}
        </IconButton>
      ) : (
        <Button
          variant="text"
          color="neutral"
          onClick={onPrevious}
          disabled={previousDisabled || disabled}
          startIcon={previousIcon}
        >
          {t('tests.previous')}
        </Button>
      )}
      <Button
        variant="contained"
        onClick={onSubmit}
        disabled={disabled}
        startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : undefined}
        endIcon={
          !submitting ? (
            <IconifyIcon icon="material-symbols:arrow-forward-rounded" sx={{ fontSize: 20 }} />
          ) : undefined
        }
        sx={mobile ? { flex: 1, minWidth: 0, minHeight: 44 } : undefined}
      >
        {t('tests.submitAnswer')}
      </Button>
    </Stack>
  );
};

export default TestPassActions;
