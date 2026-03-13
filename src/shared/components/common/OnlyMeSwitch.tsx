import { Card, CardProps, FormControlLabel, Stack, Switch, SwitchProps, Typography } from '@mui/material';

type OnlyMeSwitchProps = {
  label: string;
  checked: boolean;
  onChange: NonNullable<SwitchProps['onChange']>;
  disabled?: boolean;
  switchSize?: SwitchProps['size'];
  switchColor?: SwitchProps['color'];
} & Omit<CardProps, 'children' | 'onChange'>;

const OnlyMeSwitch = ({
  label,
  checked,
  onChange,
  disabled,
  switchSize = 'small',
  switchColor = 'primary',
  sx,
  ...cardProps
}: OnlyMeSwitchProps) => (
  <Card
    background={2}
    {...cardProps}
  >
    <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ px: 1.5, pr: 0, py: 1 }}>
      <Typography variant="body2" fontWeight={600}>
        {label}
      </Typography>
      <FormControlLabel
        control={
          <Switch
            size={switchSize}
            checked={checked}
            onChange={onChange}
            color={switchColor}
          />
        }
        label=""
        disabled={disabled}
        sx={{ ml: 0 }}
      />
    </Stack>
  </Card>
);

export default OnlyMeSwitch;
