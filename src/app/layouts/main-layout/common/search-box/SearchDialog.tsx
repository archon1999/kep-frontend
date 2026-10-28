import { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, dialogClasses } from '@mui/material';
import ContentLoading from 'shared/components/loading/ContentLoading';

const SearchResult = lazy(() => import('./SearchResult'));

interface SearchDialogProps {
  anchorEl: HTMLDivElement | HTMLButtonElement | null;
  handleClose: () => void;
}

const SearchDialog = ({ anchorEl, handleClose }: SearchDialogProps) => {
  const open = Boolean(anchorEl);
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-label={t('common.searchPlaceholder')}
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
