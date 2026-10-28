import { useTranslation } from 'react-i18next';
import { Box, Button, Stack, Typography } from '@mui/material';
import type { CSSObject, Theme } from '@mui/material/styles';
import { NavColor } from 'app/config';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { SET_NAV_COLOR } from 'app/reducers/SettingsReducer';
import { overlayOptionStyles } from 'app/theme/styles/overlays';

interface ItemProps {
  label: string;
  previewSx: (theme: Theme) => CSSObject;
  active?: boolean;
  onClick: () => void;
}

const Item = ({ label, previewSx, active, onClick }: ItemProps) => {
  return (
    <Button
      aria-pressed={active}
      sx={(theme) => ({
        ...overlayOptionStyles(theme),
        p: 1.5,
        gap: 1,
        minWidth: 0,
        flex: 1,
        flexDirection: 'column',
        border: '1px solid',
        borderColor: active ? 'primary.main' : 'divider',
        bgcolor: active ? 'action.selected' : 'transparent',
        '&::before, &::after': { display: 'none' },
      })}
      onClick={onClick}
    >
      <Box
        sx={(theme) => ({
          height: 28,
          width: 64,
          borderRadius: 0,
          ...previewSx(theme),
        })}
      />
      <Typography
        variant="body2"
        sx={{
          fontWeight: active ? 500 : 400,
          color: active ? 'primary.main' : 'text.secondary',
        }}
      >
        {label}
      </Typography>
    </Button>
  );
};

const NavColorPanel = () => {
  const { t } = useTranslation();
  const {
    config: { navColor },
    configDispatch,
  } = useSettingsContext();

  const handleClick = (value: NavColor) => {
    configDispatch({
      type: SET_NAV_COLOR,
      payload: value,
    });
  };

  return (
    <Stack
      direction="row"
      sx={{
        gap: 1,
      }}
    >
      <Item
        label={t('settings.customizer.labels.default')}
        previewSx={(theme) => ({
          backgroundColor: theme.vars.palette.background.default,
          border: `1px solid ${theme.vars.palette.divider}`,
        })}
        active={navColor === 'default'}
        onClick={() => handleClick('default')}
      />
      <Item
        label={t('settings.customizer.labels.vibrant')}
        previewSx={(theme) => ({
          background: `linear-gradient(163.93deg, ${theme.palette.primary.light} 3.83%, ${theme.palette.success.main} 132.96%)`,
        })}
        active={navColor === 'vibrant'}
        onClick={() => handleClick('vibrant')}
      />
    </Stack>
  );
};

export default NavColorPanel;
