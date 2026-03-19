import { useTranslation } from 'react-i18next';
import {
  Box,
  Chip,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ThemePreset } from 'app/config';
import { THEME_DISPLAY_NAMES } from 'app/theme/palettes';
import useResolvedThemeMode from 'shared/hooks/useResolvedThemeMode';
import { ThemeRadio, themeListRowSx } from './ThemeRadio';

const THEME_NEW_PRESETS: Partial<Record<ThemePreset, boolean>> = {
  midnight: true,
  dracula: true,
  luxury: true,
  retro: true,
  arctic: true,
  nature: true,
  ember: true,
};

const THEME_LABEL_KEYS: Partial<Record<ThemePreset, string>> = {
  'default-light': 'settings.customizer.themePresets.defaultLight',
  'default-dark': 'settings.customizer.themePresets.defaultDark',
  luxury: 'settings.customizer.themePresets.luxury',
  retro: 'settings.customizer.themePresets.retro',
  arctic: 'settings.customizer.themePresets.arctic',
  nature: 'settings.customizer.themePresets.nature',
  ember: 'settings.customizer.themePresets.ember',
  dracula: 'settings.customizer.themePresets.dracula',
  midnight: 'settings.customizer.themePresets.midnight',
};

interface ThemeListItemProps {
  preset: ThemePreset;
  palette: any;
  isSelected: boolean;
  onSelect: (preset: ThemePreset) => void;
  variant?: 'default' | 'menu';
  isNested?: boolean;
}

const ThemeListItem = ({
  preset,
  palette,
  isSelected,
  onSelect,
  variant = 'default',
  isNested = false,
}: ThemeListItemProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { isDark } = useResolvedThemeMode();
  const isNew = THEME_NEW_PRESETS[preset] === true;
  const labelKey = THEME_LABEL_KEYS[preset];
  const displayName = labelKey
    ? t(labelKey, { defaultValue: THEME_DISPLAY_NAMES[preset] || preset })
    : THEME_DISPLAY_NAMES[preset] || preset;

  return (
    <ListItem disablePadding>
      <ListItemButton
        dense
        selected={isSelected}
        onClick={() => onSelect(preset)}
        sx={themeListRowSx(variant, isNested, isDark)}
      >
        <ListItemIcon>
          <ThemeRadio checked={isSelected} />
        </ListItemIcon>
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {displayName}
              {isNew && (
                <Chip
                  size="xsmall"
                  label={t('settings.customizer.new')}
                  color="warning"
                  sx={{ textTransform: 'capitalize' }}
                />
              )}
            </Box>
          }
        />
        <Box
          sx={{
            width: 58,
            height: 36,
            borderRadius: 1.5,
            p: 0.625,
            border: 1,
            borderColor: alpha(
              isSelected ? theme.palette.primary.main : theme.palette.divider,
              isSelected ? (isDark ? 0.42 : 0.24) : isDark ? 0.34 : 0.9,
            ),
            bgcolor: theme.vars.palette.background.menuElevation1,
            backgroundImage: isDark
              ? `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.045)} 0%, transparent 100%)`
              : `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.82)} 0%, transparent 100%)`,
            boxShadow: `${isSelected ? `0 16px 28px -24px ${alpha(theme.palette.primary.main, isDark ? 0.8 : 0.36)}, ` : ''}${
              isDark
                ? `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.05)}`
                : `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.7)}`
            }`,
          }}
        >
          <Stack
            sx={{
              height: 1,
              borderRadius: 0.75,
              overflow: 'hidden',
              border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.45 : 0.7)}`,
              bgcolor: palette.background?.default || palette.background?.paper,
            }}
          >
            <Box
              sx={{
                height: 10,
                px: 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: palette.background?.menu || palette.background?.paper,
                borderBottom: `1px solid ${alpha(palette.divider || theme.palette.divider, isDark ? 0.56 : 0.8)}`,
              }}
            >
              <Box
                sx={{
                  width: 14,
                  height: 2.5,
                  borderRadius: 999,
                  bgcolor: alpha(palette.primary?.main || theme.palette.primary.main, 0.8),
                }}
              />
              <Stack direction="row" gap={0.25}>
                {[palette.primary?.main, palette.secondary?.main]
                  .filter(Boolean)
                  .map((color, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        bgcolor: color,
                      }}
                    />
                  ))}
              </Stack>
            </Box>

            <Stack sx={{ flex: 1, p: 0.5, gap: 0.5 }}>
              <Box
                sx={{
                  height: 8,
                  borderRadius: 0.5,
                  bgcolor: palette.background?.paper || palette.background?.menu,
                  border: `1px solid ${alpha(palette.divider || theme.palette.divider, isDark ? 0.6 : 0.9)}`,
                  boxShadow: `0 5px 12px -12px ${alpha(palette.primary?.main || theme.palette.primary.main, 0.65)}`,
                }}
              />
              <Box
                sx={{
                  width: '70%',
                  height: 6,
                  borderRadius: 0.5,
                  bgcolor: alpha(
                    palette.primary?.main || theme.palette.primary.main,
                    isDark ? 0.2 : 0.14,
                  ),
                }}
              />
            </Stack>
          </Stack>
        </Box>
      </ListItemButton>
    </ListItem>
  );
};

export default ThemeListItem;
