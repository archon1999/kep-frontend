import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { ThemePreset } from 'app/config.ts';
import { allPalettes } from 'app/theme/palettes';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import useResolvedThemeMode from 'shared/hooks/useResolvedThemeMode';
import { useThemeMode } from 'shared/hooks/useThemeMode';
import PrimaryColorPicker from './PrimaryColorPicker';
import ThemeListItem from './ThemeListItem';
import { ThemeRadio, themeListRowSx } from './ThemeRadio';

interface ThemeListProps {
  variant?: 'default' | 'menu';
}

const organizeThemes = () => {
  const defaultThemes: [ThemePreset, any][] = [];
  const customThemes: [ThemePreset, any][] = [];

  Object.entries(allPalettes).forEach(([preset, palette]) => {
    if (preset.startsWith('default-')) {
      defaultThemes.push([preset as ThemePreset, palette]);
    } else {
      customThemes.push([preset as ThemePreset, palette]);
    }
  });

  return { defaultThemes, customThemes };
};

const ThemeList = ({ variant = 'default' }: ThemeListProps) => {
  const { t } = useTranslation();
  const { setThemePreset, setThemeMode, themePreset, mode } = useThemeMode();
  const { isDark } = useResolvedThemeMode();
  const [isDefaultSectionOpen, setIsDefaultSectionOpen] = useState(true);
  const isSystemSelected = mode === 'system';

  const handleThemeChange = useCallback(
    (preset: ThemePreset) => {
      setThemePreset(preset);
    },
    [setThemePreset],
  );

  const { defaultThemes, customThemes } = organizeThemes();
  const isDefaultThemeActive = themePreset.startsWith('default-');

  const handleSystemThemeSelect = useCallback(() => {
    setThemeMode('system');
    setThemePreset('default-light', { updateMode: false });
  }, [setThemeMode, setThemePreset]);

  const expandIcon = isDefaultSectionOpen
    ? 'material-symbols:keyboard-arrow-up-rounded'
    : 'material-symbols:keyboard-arrow-down-rounded';

  return (
    <>
      <List
        dense
        disablePadding
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: variant === 'default' ? 1 : 0,
        }}
      >
        <ListItem
          secondaryAction={
            <IconButton edge="end" onClick={() => setIsDefaultSectionOpen(!isDefaultSectionOpen)}>
              <IconifyIcon icon={expandIcon} />
            </IconButton>
          }
          dense
          disablePadding
        >
          <ListItemButton
            dense
            selected={isDefaultThemeActive}
            onClick={() => handleThemeChange('default-light')}
            sx={themeListRowSx(variant, false, isDark)}
          >
            <ListItemIcon>
              <ThemeRadio checked={isDefaultThemeActive} />
            </ListItemIcon>
            <ListItemText primary={t('settings.customizer.themePresets.defaultGroup')} />
          </ListItemButton>
        </ListItem>

        <Collapse in={isDefaultSectionOpen} timeout="auto" unmountOnExit>
          <List
            disablePadding
            dense
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: variant === 'default' ? 0.5 : 0,
              pl: variant === 'menu' ? 0 : 2,
            }}
          >
            {defaultThemes.map(([preset, palette]) => (
              <ThemeListItem
                key={preset}
                preset={preset}
                palette={palette}
                isSelected={!isSystemSelected && preset === themePreset}
                onSelect={handleThemeChange}
                variant={variant}
                isNested
              />
            ))}

            <ListItem disablePadding sx={{ alignItems: 'center' }}>
              <ListItemButton
                dense
                selected={isSystemSelected}
                onClick={handleSystemThemeSelect}
                sx={themeListRowSx(variant, true, isDark)}
              >
                <ListItemIcon>
                  <ThemeRadio checked={isSystemSelected} />
                </ListItemIcon>
                <ListItemText primary={t('settings.customizer.labels.system')} />
              </ListItemButton>
              <IconifyIcon
                icon="material-symbols:monitor-outline-rounded"
                sx={{ fontSize: 18, display: 'block', mr: 2 }}
              />
            </ListItem>
          </List>
        </Collapse>

        {customThemes.map(([preset, palette]) => (
          <ThemeListItem
            key={preset}
            preset={preset}
            palette={palette}
            isSelected={!isSystemSelected && preset === themePreset}
            onSelect={handleThemeChange}
            variant={variant}
          />
        ))}
      </List>

      <PrimaryColorPicker variant={variant} />
    </>
  );
};

export default ThemeList;
