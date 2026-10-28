import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material';
import DialogHeader from 'shared/components/common/DialogHeader';
import PatternArtwork from 'shared/components/common/PatternArtwork';

const TestFinishDialog = ({
  open,
  result,
  total,
  onClose,
}: {
  open: boolean;
  result: number | null;
  total: number;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="test-finish-title"
    >
      <DialogHeader id="test-finish-title" title={t('tests.finishTitle')} onClose={onClose} />
      <DialogContent sx={{ textAlign: 'center', py: 3 }}>
        <PatternArtwork kind="competitions" sx={{ width: 160, mx: 'auto' }} />
        {result !== null ? (
          <Stack gap={1} alignItems="center">
            <Typography variant="label" color="text.secondary">
              {t('tests.resultsColumns.score')}
            </Typography>
            <Typography variant="metric" sx={{ fontSize: 52 }}>
              {result}
              <Box component="span" sx={{ fontSize: 24, color: 'text.secondary' }}>
                {' '}
                / {total}
              </Box>
            </Typography>
          </Stack>
        ) : (
          <Typography color="text.secondary">{t('tests.finishNoResult')}</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" fullWidth onClick={onClose} autoFocus>
          {t('tests.returnToTest')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default TestFinishDialog;
