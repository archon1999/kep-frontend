import { List, Stack } from '@mui/material';
import { allPalettes } from 'app/theme/palettes';
import { themePresets } from 'app/theme/presets';
import { useThemeMode } from 'shared/hooks/useThemeMode';
import ThemeModeToggleTab from '../ThemeModeToggleTab';
import PrimaryColorPicker from './PrimaryColorPicker';
import ThemeListItem from './ThemeListItem';

const ThemeList = ({ variant = 'default' }: { variant?: 'default' | 'menu' }) => {
  const { setThemePreset, themePreset } = useThemeMode();
  return (
    <Stack direction="column" gap={2}>
      <ThemeModeToggleTab />
      <List
        dense
        disablePadding
        sx={{
          display: 'grid',
          gridTemplateColumns: variant === 'default' ? 'repeat(2, minmax(0, 1fr))' : '1fr',
          gap: 1,
        }}
      >
        {themePresets.map((preset) => (
          <ThemeListItem
            key={preset}
            preset={preset}
            palette={allPalettes[preset]}
            isSelected={preset === themePreset}
            onSelect={setThemePreset}
          />
        ))}
      </List>
      <PrimaryColorPicker variant={variant} />
    </Stack>
  );
};
export default ThemeList;
