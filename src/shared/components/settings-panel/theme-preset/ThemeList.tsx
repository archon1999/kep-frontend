import { useCallback, useState } from 'react';
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
import { useThemeMode } from 'shared/hooks/useThemeMode';
import IconifyIcon from 'shared/components/base/IconifyIcon';
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
  const { setThemePreset, setThemeMode, themePreset, mode } = useThemeMode();
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
          <ListItemButton dense selected={isDefaultThemeActive} onClick={() => handleThemeChange('default-light')} sx={themeListRowSx(variant)}>
            <ListItemIcon>
              <ThemeRadio checked={isDefaultThemeActive} />
            </ListItemIcon>
            <ListItemText primary="Default" />
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
              <ListItemButton dense selected={isSystemSelected} onClick={handleSystemThemeSelect} sx={themeListRowSx(variant, true)}>
                <ListItemIcon>
                  <ThemeRadio checked={isSystemSelected} />
                </ListItemIcon>
                <ListItemText primary="System" />
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
