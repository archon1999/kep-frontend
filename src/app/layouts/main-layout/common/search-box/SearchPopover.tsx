import { ReactElement, Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { Fade, Popover } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import ContentLoading from 'shared/components/loading/ContentLoading';

const SearchResult = lazy(() => import('./SearchResult'));

interface TransitionComponentProps extends TransitionProps {
  children: ReactElement<any>;
  ref?: React.Ref<unknown>;
}

const Transition = ({ ref, ...props }: TransitionComponentProps) => <Fade ref={ref} {...props} />;

interface SearchPopoverProps {
  anchorEl: HTMLDivElement | HTMLButtonElement | null;
  handleClose: () => void;
}

const SearchPopover = ({ anchorEl, handleClose }: SearchPopoverProps) => {
  const { t } = useTranslation();
  const open = Boolean(anchorEl);
  const {
    config: { navigationMenuType },
  } = useSettingsContext();

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      marginThreshold={16}
      elevation={3}
      transitionDuration={150}
      slots={{ transition: Transition }}
      slotProps={{
        paper: {
          role: 'dialog',
          'aria-label': t('common.searchPlaceholder'),
          sx: [
            {
              width: 420,
              maxWidth: 'calc(100vw - 32px)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            },
            navigationMenuType === 'topnav' && {
              width: 480,
            },
          ],
        },
        root: {
          slotProps: {
            backdrop: {
              invisible: false,
            },
          },
        },
      }}
    >
      {open && (
        <Suspense fallback={<ContentLoading />}>
          <SearchResult handleClose={handleClose} />
        </Suspense>
      )}
    </Popover>
  );
};

export default SearchPopover;
