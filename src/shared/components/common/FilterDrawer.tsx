import { ReactNode, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Slider,
  Stack,
  Typography,
  checkboxClasses,
  drawerClasses,
  formControlLabelClasses,
  styled,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavContext } from 'app/layouts/main-layout/NavProvider';
import { useBreakpoints } from 'app/providers/BreakpointsProvider.tsx';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';

export const DEFAULT_FILTER_DRAWER_WIDTH = 280;

export const useFilterDrawer = () => {
  const { up } = useBreakpoints();
  const upXl = up('xl');
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [upXl]);

  return {
    open,
    setOpen,
    close: () => setOpen(false),
    toggle: () => setOpen((prev) => !prev),
  };
};

interface FilterDrawerLayoutProps {
  open: boolean;
  drawerWidth?: number;
  drawer: ReactNode;
  children: ReactNode;
}

export const FilterDrawerLayout = ({
  open,
  drawerWidth = DEFAULT_FILTER_DRAWER_WIDTH,
  drawer,
  children,
}: FilterDrawerLayoutProps) => {
  const { up } = useBreakpoints();
  const { topbarHeight } = useNavContext();
  const upSm = up('sm');

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        height: theme.mixins.contentHeight(
          topbarHeight,
          (upSm ? theme.mixins.footer.sm : theme.mixins.footer.xs) + 1,
        ),
      })}
    >
      {drawer}

      <Box
        sx={({ transitions }) => ({
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          minWidth: 0,
          minHeight: 0,
          overflowY: 'auto',
          marginLeft: { xl: `-${drawerWidth}px` },
          transition: transitions.create('margin', {
            easing: transitions.easing.sharp,
            duration: transitions.duration.leavingScreen,
          }),
          ...(open && {
            transition: transitions.create('margin', {
              easing: transitions.easing.easeOut,
              duration: transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
          }),
        })}
      >
        {children}
      </Box>
    </Box>
  );
};

export interface FilterDrawerProps {
  id: string;
  open: boolean;
  title?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  drawerWidth?: number;
  clearLabel?: ReactNode;
  hasActiveFilters?: boolean;
  onClear?: () => void;
}

const FilterDrawer = ({
  id,
  open,
  title,
  onClose,
  children,
  drawerWidth = DEFAULT_FILTER_DRAWER_WIDTH,
  clearLabel,
  hasActiveFilters = false,
  onClear,
}: FilterDrawerProps) => {
  const { t } = useTranslation();
  const { up } = useBreakpoints();
  const { topbarHeight } = useNavContext();
  const upXl = up('xl');
  const upSm = up('sm');
  const showClear = hasActiveFilters && Boolean(onClear);
  const resolvedTitle = title ?? t('problems.filters');
  const drawerContent = (
    <Box id={id} component="aside" sx={{ px: 3, py: 2 }}>
      <Stack direction="row" alignItems="center" sx={{ justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">{resolvedTitle}</Typography>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          {showClear ? (
            <Button size="small" variant="text" color="secondary" onClick={onClear}>
              {clearLabel}
            </Button>
          ) : null}
          <Button shape="circle" color="neutral" onClick={onClose}>
            <IconifyIcon icon="material-symbols:close-rounded" sx={{ fontSize: 20 }} />
          </Button>
        </Stack>
      </Stack>

      {children}
    </Box>
  );

  return (
    <>
      {upXl ? (
        <Drawer
          variant="persistent"
          open={open}
          sx={(theme) => ({
            flexShrink: 0,
            display: { xs: 'none', xl: 'block' },
            [`& .${drawerClasses.paper}`]: {
              position: 'sticky',
              zIndex: 'unset',
              top: theme.mixins.topOffset(topbarHeight),
              height: theme.mixins.contentHeight(
                topbarHeight,
                (upSm ? theme.mixins.footer.sm : theme.mixins.footer.xs) + 1,
              ),
              border: 0,
              overflowY: 'auto',
              width: drawerWidth,
              outline: `1px solid ${theme.vars.palette.divider}`,
              bgcolor: theme.vars.palette.background.elevation1,
            },
          })}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{
            disableAutoFocus: true,
            disableEnforceFocus: true,
            disableRestoreFocus: true,
          }}
          disablePortal
          sx={(theme) => ({
            display: { xs: 'block', xl: 'none' },
            [`& .${drawerClasses.paper}`]: {
              top: theme.mixins.topOffset(topbarHeight),
              height: theme.mixins.contentHeight(topbarHeight),
              width: drawerWidth,
              border: 0,
              zIndex: theme.zIndex.drawer,
              outline: `1px solid ${theme.vars.palette.divider}`,
              bgcolor: theme.vars.palette.background.elevation1,
            },
          })}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

interface FilterFieldsetProps {
  label: string;
  options: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }[];
}

export const FilterFieldset = ({ label, options }: FilterFieldsetProps) => {
  return (
    <FormControl component="fieldset" variant="standard" sx={{ px: 2 }}>
      <StyledFormLabel>{label}</StyledFormLabel>
      <FormGroup sx={{ pl: 2 }}>
        {options.map((option) => (
          <StyledFormControlLabel
            key={option.label}
            control={
              <Checkbox
                checked={option.checked}
                onChange={(event) => option.onChange(event.target.checked)}
                name={option.label}
              />
            }
            label={option.label}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
};

interface FilterRangeFieldProps {
  label: string;
  range: [number, number];
  step: number;
  value: [number, number];
  onChange: (event: Event, value: number | number[]) => void;
  valueText: (value: number) => string;
}

export const FilterRangeField = ({
  label,
  range,
  step,
  value,
  onChange,
  valueText,
}: FilterRangeFieldProps) => {
  return (
    <FormControl component="fieldset" variant="standard" sx={{ px: 2 }}>
      <StyledFormLabel>{label}</StyledFormLabel>
      <FormGroup>
        <Slider
          value={value}
          min={range[0]}
          max={range[1]}
          step={step}
          onChange={onChange}
          valueLabelDisplay="auto"
          valueLabelFormat={valueText}
          getAriaValueText={valueText}
          sx={{ mx: 0 }}
        />
        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {valueText(range[0])}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {valueText(range[1])}
          </Typography>
        </Stack>
      </FormGroup>
    </FormControl>
  );
};

const StyledFormLabel = styled(FormLabel)(({ theme: { typography, vars, spacing } }) => ({
  fontSize: typography.caption.fontSize,
  fontWeight: 500,
  lineHeight: '14px',
  color: vars.palette.text.primary,
  paddingTop: spacing(1),
  paddingBottom: spacing(1),
}));

const StyledFormControlLabel = styled(FormControlLabel)(({ theme: { typography, spacing } }) => ({
  [`& .${formControlLabelClasses.label}`]: {
    fontSize: typography.caption.fontSize,
    alignSelf: 'center',
    marginTop: '0 !important',
  },
  [`& .${checkboxClasses.root}`]: { padding: spacing(0.875), alignSelf: 'center' },
}));

export default FilterDrawer;
