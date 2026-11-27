import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, SxProps } from '@mui/material';
import { ButtonOwnProps } from '@mui/material';
import { useBreakpoints } from 'app/providers/BreakpointsProvider';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import SearchDialog from './SearchDialog';
import SearchPopover from './SearchPopover';

interface SearchBoxButtonProps extends ButtonOwnProps {
  type?: 'default' | 'slim';
}

interface SearchBoxProps {
  sx?: SxProps;
}

const SearchBox = ({ sx }: SearchBoxProps) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        className="search-box-input"
        color="neutral"
        variant="outlined"
        aria-haspopup="dialog"
        aria-expanded={Boolean(anchorEl)}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        startIcon={<IconifyIcon icon="mdi:magnify" sx={{ fontSize: 20 }} />}
        sx={[
          {
            minWidth: 0,
            minHeight: 42,
            px: 1.75,
            justifyContent: 'flex-start',
            bgcolor: 'background.default',
            color: 'text.secondary',
            textTransform: 'none',
            fontWeight: 400,
            '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main' },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        {t('common.searchPlaceholder')}
      </Button>
      <SearchPopover anchorEl={anchorEl} handleClose={handleClose} />
    </>
  );
};

export const SearchBoxButton = ({ type = 'default', sx, ...rest }: SearchBoxButtonProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { up } = useBreakpoints();
  const upSm = up('sm');
  const label = t('common.searchPlaceholder');

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {type === 'slim' && upSm ? (
        <Button
          className="search-box-button"
          aria-haspopup="dialog"
          aria-expanded={open}
          title={label}
          color="neutral"
          size="small"
          variant="soft"
          onClick={() => setOpen(true)}
          startIcon={<IconifyIcon icon="material-symbols:search-rounded" sx={{ fontSize: 20 }} />}
          sx={{ borderRadius: 11, py: '5px', ...sx }}
          {...rest}
        >
          <Box sx={{ mb: 0.25 }} component="span">
            {label}
          </Box>
        </Button>
      ) : (
        <Button
          className="search-box-button"
          aria-label={label}
          aria-haspopup="dialog"
          aria-expanded={open}
          title={label}
          color="neutral"
          shape="circle"
          variant="soft"
          size={type === 'slim' ? 'small' : 'medium'}
          onClick={() => setOpen(true)}
          sx={sx}
          {...rest}
        >
          <IconifyIcon
            icon="material-symbols:search-rounded"
            sx={[{ fontSize: 20 }, type === 'slim' && { fontSize: 18 }]}
          />
        </Button>
      )}
      <SearchDialog open={open} handleClose={handleClose} />
    </>
  );
};

export default SearchBox;
