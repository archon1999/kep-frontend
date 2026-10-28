import { MouseEvent, ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { useNavContext } from 'app/layouts/main-layout/NavProvider';
import { useBreakpoints } from 'app/providers/BreakpointsProvider.tsx';
import { overlayFormStyles } from 'app/theme/styles/overlays';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import FramedPage from 'shared/components/sections/common/FramedPage';
import FilterPopover from './FilterPopover';
import MixedText from './MixedText';

const FilterAnchorContext = createContext<HTMLElement | null | undefined>(undefined);

export const DEFAULT_FILTER_DRAWER_WIDTH = 280;

export const useFilterDrawer = () => {
  const { up } = useBreakpoints();
  const upXl = up('xl');
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  useEffect(() => setOpen(false), [upXl]);

  return {
    open,
    anchorEl,
    setOpen,
    close: () => setOpen(false),
    toggle: (event?: MouseEvent<HTMLElement>) => {
      if (event) setAnchorEl(event.currentTarget);
      setOpen((prev) => !prev);
    },
  };
};

interface FilterDrawerLayoutProps {
  open: boolean;
  anchorEl?: HTMLElement | null;
  drawerWidth?: number;
  drawer: ReactNode;
  children: ReactNode;
}

export const FilterDrawerLayout = ({
  open,
  anchorEl,
  drawerWidth = DEFAULT_FILTER_DRAWER_WIDTH,
  drawer,
  children,
}: FilterDrawerLayoutProps) => {
  const { topbarHeight } = useNavContext();

  if (anchorEl !== undefined) {
    return (
      <FilterAnchorContext.Provider value={open ? anchorEl : null}>
        {drawer}
        <FramedPage>{children}</FramedPage>
      </FilterAnchorContext.Provider>
    );
  }

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        height: theme.mixins.contentHeight(topbarHeight),
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
  temporary?: boolean;
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
  temporary = false,
  clearLabel,
  hasActiveFilters = false,
  onClear,
}: FilterDrawerProps) => {
  const { t } = useTranslation();
  const { up } = useBreakpoints();
  const { topbarHeight } = useNavContext();
  const upXl = up('xl');
  const persistent = upXl && !temporary;
  const showClear = hasActiveFilters && Boolean(onClear);
  const resolvedTitle = title ?? t('problems.filters');
  const anchorEl = useContext(FilterAnchorContext);

  if (anchorEl !== undefined) {
    return (
      <FilterPopover
        id={id}
        title={resolvedTitle}
        anchorEl={open ? anchorEl : null}
        onClose={onClose}
        onReset={onClear ?? (() => undefined)}
        hasActiveFilters={showClear}
        resetLabel={clearLabel ?? t('problems.clearFilters')}
        doneLabel={t('contests.filters.done')}
      >
        {children}
      </FilterPopover>
    );
  }
  const drawerContent = (
    <Box
      id={id}
      component="aside"
      aria-labelledby={`${id}-title`}
      sx={(theme) => ({ px: 3, py: 2, ...overlayFormStyles(theme) })}
    >
      <Stack
        direction="row"
        alignItems="center"
        gap={1}
        sx={{
          justifyContent: 'space-between',
          mb: 3,
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography id={`${id}-title`} component="h2" variant="h6">
          {typeof resolvedTitle === 'string' ? (
            <MixedText>{resolvedTitle}</MixedText>
          ) : (
            resolvedTitle
          )}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          {showClear ? (
            <Button size="small" variant="text" color="secondary" onClick={onClear}>
              {clearLabel ?? t('problems.clearFilters')}
            </Button>
          ) : null}
          <Button shape="circle" color="neutral" onClick={onClose} aria-label={t('common.close')}>
            <IconifyIcon icon="material-symbols:close-rounded" sx={{ fontSize: 20 }} />
          </Button>
        </Stack>
      </Stack>

      {children}
    </Box>
  );

  return (
    <>
      {persistent ? (
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
              height: theme.mixins.contentHeight(topbarHeight),
              border: 0,
              overflowY: 'auto',
              width: drawerWidth,
              outline: `1px solid ${theme.vars.palette.divider}`,
              bgcolor: theme.vars.palette.background.default,
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
          sx={(theme) => ({
            display: temporary ? 'block' : { xs: 'block', xl: 'none' },
            [`& .${drawerClasses.paper}`]: {
              top: theme.mixins.topOffset(topbarHeight),
              height: theme.mixins.contentHeight(topbarHeight),
              width: { xs: '100vw', sm: drawerWidth },
              maxWidth: '100vw',
              border: 0,
              zIndex: theme.zIndex.drawer,
              outline: `1px solid ${theme.vars.palette.divider}`,
              bgcolor: theme.vars.palette.background.default,
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
