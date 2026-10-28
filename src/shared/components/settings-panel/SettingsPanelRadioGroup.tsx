import { RadioGroup, RadioGroupProps, formControlLabelClasses, radioClasses } from '@mui/material';

const SettingsPanelRadioGroup = ({ children, ...rest }: RadioGroupProps) => {
  return (
    <RadioGroup
      sx={{
        flexDirection: 'row',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: 1,
        [`& .${formControlLabelClasses.root}`]: {
          position: 'relative',
          margin: 0,
          minWidth: 0,
          '& .MuiFormControlLabel-label': { width: '100%' },
          '&:focus-within .SettingsItem': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: 2,
          },
        },
        [`& .${radioClasses.root}`]: {
          position: 'absolute',
          width: '1px',
          height: '1px',
          top: 0,
          left: 0,
          overflow: 'hidden',
          clipPath: 'inset(50%)',
          opacity: 0,
          padding: 0,
        },
      }}
      {...rest}
    >
      {children}
    </RadioGroup>
  );
};

export default SettingsPanelRadioGroup;
