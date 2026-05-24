import { ReactElement, ReactNode } from 'react';
import {
  Box,
  FormControl,
  FormControlProps,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuItemProps,
  Select,
  SelectProps,
  SxProps,
  Tab,
  TabProps,
  Tabs,
  TabsProps,
  Theme,
} from '@mui/material';

type ResponsiveTabValue = string | number;

export interface ResponsiveTabItem<Value extends ResponsiveTabValue = string> {
  value: Value;
  label: string | ReactElement;
  selectLabel?: ReactNode;
  icon?: string | ReactElement;
  disabled?: boolean;
  tabProps?: Omit<TabProps, 'value' | 'label' | 'icon' | 'disabled'>;
  menuItemProps?: Omit<MenuItemProps, 'value' | 'children' | 'disabled'>;
}

interface ResponsiveTabsProps<Value extends ResponsiveTabValue = string> {
  value: Value | false;
  items: ResponsiveTabItem<Value>[];
  onChange: (value: Value) => void;
  ariaLabel?: string;
  mobileLabel?: string;
  mobileBreakpoint?: 'sm' | 'md' | 'lg';
  fullWidthMobile?: boolean;
  containerSx?: SxProps<Theme>;
  tabsProps?: Omit<TabsProps, 'value' | 'onChange' | 'children' | 'aria-label'>;
  selectProps?: Omit<SelectProps<Value>, 'value' | 'onChange' | 'children' | 'label'>;
  formControlProps?: Omit<FormControlProps, 'children'>;
}

const ResponsiveTabs = <Value extends ResponsiveTabValue = string>({
  value,
  items,
  onChange,
  ariaLabel,
  mobileLabel,
  mobileBreakpoint = 'sm',
  fullWidthMobile = true,
  containerSx,
  tabsProps,
  selectProps,
  formControlProps,
}: ResponsiveTabsProps<Value>) => {
  const activeItem = items.find((item) => item.value === value);
  const mobileDisplay = { xs: 'block', [mobileBreakpoint]: 'none' };
  const desktopDisplay = { xs: 'none', [mobileBreakpoint]: 'block' };

  return (
    <Box sx={containerSx}>
      <Box sx={{ display: mobileDisplay }}>
        <FormControl size="small" fullWidth={fullWidthMobile} {...formControlProps}>
          <Select
            variant="outlined"
            value={value === false ? ('' as Value) : value}
            onChange={(event) => onChange(event.target.value as Value)}
            displayEmpty
            label={mobileLabel}
            renderValue={() => activeItem?.selectLabel ?? activeItem?.label ?? ''}
            inputProps={{
              'aria-label': ariaLabel,
              ...selectProps?.inputProps,
            }}
            {...selectProps}
          >
            {items.map(({ value: itemValue, label, selectLabel, icon, disabled, menuItemProps }) => (
              <MenuItem key={String(itemValue)} value={itemValue} disabled={disabled} {...menuItemProps}>
                {icon ? <ListItemIcon sx={{ minWidth: 34 }}>{icon}</ListItemIcon> : null}
                <ListItemText primary={selectLabel ?? label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: desktopDisplay, minWidth: 0 }}>
        <Tabs
          value={value}
          onChange={(_, nextValue) => onChange(nextValue as Value)}
          aria-label={ariaLabel}
          {...tabsProps}
        >
          {items.map(({ value: itemValue, label, icon, disabled, tabProps }) => (
            <Tab
              key={String(itemValue)}
              value={itemValue}
              label={label}
              icon={icon}
              disabled={disabled}
              {...tabProps}
            />
          ))}
        </Tabs>
      </Box>
    </Box>
  );
};

export default ResponsiveTabs;
