import { useTranslation } from 'react-i18next';
import { Button, Dialog, DialogActions } from '@mui/material';
import ContentLoading from './ContentLoading';

const DialogLoading = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm" aria-label={t('common.loading')}>
      <ContentLoading />
      <DialogActions>
        <Button onClick={onClose}>{t('common.close')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogLoading;
