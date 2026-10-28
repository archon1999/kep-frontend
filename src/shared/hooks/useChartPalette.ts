import { useColorScheme, useTheme } from '@mui/material/styles';

// Canvas charts need resolved colors and a rerender when the active scheme changes.
const useChartPalette = () => {
  const theme = useTheme();
  const { mode, systemMode } = useColorScheme();
  const scheme = mode === 'dark' || (mode === 'system' && systemMode === 'dark') ? 'dark' : 'light';
  return theme.colorSchemes[scheme]?.palette ?? theme.palette;
};

export default useChartPalette;
