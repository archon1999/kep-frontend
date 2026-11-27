import { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, dialogClasses } from '@mui/material';
import ContentLoading from 'shared/components/loading/ContentLoading';

const SearchResult = lazy(() => import('./SearchResult'));

interface SearchDialogProps {
  open: boolean;
  handleClose: () => void;
}

const SearchDialog = ({ open, handleClose }: SearchDialogProps) => {
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{ paper: { 'aria-label': t('common.searchPlaceholder') } }}
      maxWidth="sm"
      sx={{
        [`& .${dialogClasses.paper}`]: {
          width: '100%',
          outline: 'none',
          overflow: 'hidden',
        },
      }}
    >
      {open && (
        <Suspense fallback={<ContentLoading />}>
          <SearchResult handleClose={handleClose} />
        </Suspense>
      )}
    </Dialog>
  );
};

export default SearchDialog;
