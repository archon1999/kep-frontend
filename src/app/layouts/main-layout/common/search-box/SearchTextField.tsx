import { useTranslation } from 'react-i18next';
import { InputAdornment, TextFieldProps } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import StyledTextField from 'shared/components/styled/StyledTextField';

const SearchTextField = ({ slotProps, sx, ...rest }: TextFieldProps) => {
  const { t } = useTranslation();
  const { input: inputSlotProps } = slotProps || {};

  return (
    <StyledTextField
      id="search-box"
      type="search"
      variant="filled"
      placeholder={t('common.searchPlaceholder')}
      sx={[
        { minWidth: 0, '& input::-webkit-search-cancel-button': { WebkitAppearance: 'none' } },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      slotProps={{
        ...slotProps,
        input: (ownerState) => ({
          className: 'search-box-input',
          startAdornment: (
            <InputAdornment position="start">
              <IconifyIcon icon="material-symbols:search-rounded" />
            </InputAdornment>
          ),
          ...(typeof inputSlotProps === 'function' ? inputSlotProps(ownerState) : inputSlotProps),
        }),
      }}
      {...rest}
    />
  );
};

export default SearchTextField;
