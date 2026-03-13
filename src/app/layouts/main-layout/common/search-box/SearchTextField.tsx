import { InputAdornment, TextFieldProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import StyledTextField from 'shared/components/styled/StyledTextField';

const SearchTextField = ({ slotProps, ...rest }: TextFieldProps) => {
  const { t } = useTranslation();
  const { input: inputSlotProps } = slotProps || {};

  return (
    <StyledTextField
      id="search-box"
      placeholder={t('common.searchPlaceholder')}
      sx={{
        minWidth: 348,
      }}
      slotProps={{
        ...slotProps,
        input: {
          className: 'search-box-input',
          startAdornment: (
            <InputAdornment position="start">
              <IconifyIcon icon="material-symbols:search-rounded" />
            </InputAdornment>
          ),
          ...inputSlotProps,
        },
      }}
      {...rest}
    />
  );
};

export default SearchTextField;
