import { useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { fontFamilies } from 'app/config';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { loadReadingFont } from 'app/theme/fontLoading';
import { overlayOptionStyles } from 'app/theme/styles/overlays';
import IconifyIcon from 'shared/components/base/IconifyIcon';

const FontFamilyPanel = () => {
  useEffect(() => {
    fontFamilies.forEach((font) => loadReadingFont(font, document));
  }, []);
  const {
    config: { fontFamily },
    setConfig,
  } = useSettingsContext();
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1 }}>
      {fontFamilies.map((font) => {
        const active = fontFamily === font;
        return (
          <Button
            key={font}
            aria-pressed={active}
            onClick={() => setConfig({ fontFamily: font })}
            sx={(theme) => ({
              ...overlayOptionStyles(theme),
              position: 'relative',
              minWidth: 0,
              minHeight: 100,
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 1,
              border: '1px solid',
              borderColor: active ? 'primary.main' : 'divider',
              bgcolor: active ? 'action.selected' : 'transparent',
              color: active ? 'primary.main' : 'text.primary',
              '&::before, &::after': { display: 'none' },
            })}
          >
            <Typography
              component="span"
              aria-hidden="true"
              sx={{ fontFamily: font, fontSize: 28, lineHeight: 1.2 }}
            >
              Aa
            </Typography>
            <Typography
              component="span"
              variant="body2"
              sx={{ fontFamily: font, fontWeight: 600, textAlign: 'left' }}
            >
              {font}
            </Typography>
            {active && (
              <IconifyIcon
                icon="material-symbols:check"
                sx={{ position: 'absolute', right: 10, top: 10, fontSize: 16 }}
              />
            )}
          </Button>
        );
      })}
    </Box>
  );
};
export default FontFamilyPanel;
