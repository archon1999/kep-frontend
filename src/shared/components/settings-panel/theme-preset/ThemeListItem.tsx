import { useTranslation } from 'react-i18next';
import { Box, ListItem, ListItemButton, Typography } from '@mui/material';
import type { PaletteOptions } from '@mui/material/styles';
import { ThemePreset } from 'app/config';
import { THEME_DISPLAY_NAMES } from 'app/theme/palettes';
import { overlayOptionStyles } from 'app/theme/styles/overlays';
import IconifyIcon from 'shared/components/base/IconifyIcon';

const THEME_LABEL_KEYS: Partial<Record<ThemePreset, string>> = {
  default: 'settings.customizer.themePresets.defaultGroup',
  cobalt: 'settings.customizer.themePresets.cobalt',
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
  palette: PaletteOptions;
  isSelected: boolean;
  onSelect: (preset: ThemePreset) => void;
}

const ThemeListItem = ({ preset, palette, isSelected, onSelect }: ThemeListItemProps) => {
  const { t } = useTranslation();
  const primary = palette.primary && 'main' in palette.primary ? palette.primary.main : undefined;
  const secondary =
    palette.secondary && 'main' in palette.secondary ? palette.secondary.main : undefined;
  const labelKey = THEME_LABEL_KEYS[preset];
  const displayName = labelKey ? t(labelKey) : THEME_DISPLAY_NAMES[preset] || preset;
  return (
    <ListItem disablePadding sx={{ minWidth: 0 }}>
      <ListItemButton
        selected={isSelected}
        onClick={() => onSelect(preset)}
        aria-pressed={isSelected}
        sx={(theme) => ({
          ...overlayOptionStyles(theme),
          px: 1.25,
          py: 1,
          minHeight: 56,
          gap: 1,
          border: '1px solid',
          borderColor: isSelected ? 'primary.main' : 'divider',
        })}
      >
        <Box
          aria-hidden="true"
          sx={{
            display: 'flex',
            flexShrink: 0,
            width: 28,
            height: 28,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: palette.background?.default,
          }}
        >
          <Box sx={{ width: '50%', bgcolor: primary ?? 'primary.main' }} />
          <Box sx={{ width: '50%', bgcolor: secondary ?? 'secondary.main' }} />
        </Box>
        <Typography
          variant="body2"
          sx={{ flex: 1, minWidth: 0, fontSize: 12, fontWeight: isSelected ? 600 : 400 }}
        >
          {displayName}
        </Typography>
        {isSelected && (
          <IconifyIcon
            icon="material-symbols:check"
            sx={{ fontSize: 14, flexShrink: 0, color: 'primary.main' }}
          />
        )}
      </ListItemButton>
    </ListItem>
  );
};
export default ThemeListItem;
