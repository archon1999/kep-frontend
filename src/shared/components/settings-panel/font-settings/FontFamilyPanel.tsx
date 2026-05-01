import { Button, ButtonProps, Grid, Typography, styled } from '@mui/material';
import { alpha, Theme } from '@mui/material/styles';
import { FontFamily, fontFamilies } from 'app/config';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { kebabCase } from 'shared/lib/utils';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import useResolvedThemeMode from 'shared/hooks/useResolvedThemeMode';

const FontFamilyPanel = () => {
  const {
    config: { fontFamily },
    setConfig,
  } = useSettingsContext();
  const { isDark } = useResolvedThemeMode();

  const handleChange = (newValue: FontFamily) => setConfig({ fontFamily: newValue });

  return (
    <Grid container spacing={1}>
      {fontFamilies.map((font) => (
        <Grid key={kebabCase(font)} size={6}>
          <FontFamilyItem
            active={fontFamily === font}
            fontFamily={font}
            isDark={isDark}
            onClick={() => handleChange(font)}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default FontFamilyPanel;

interface FontFamilyItemProps extends ButtonProps {
  active?: boolean;
  fontFamily: FontFamily;
  isDark: boolean;
}

const FontFamilyItem = ({ active, fontFamily, isDark, ...props }: FontFamilyItemProps) => {
  const buttonSx = (theme: Theme) => ({
    bgcolor: active
      ? alpha(theme.palette.primary.main, isDark ? 0.18 : 0.08)
      : theme.vars.palette.background.menuElevation1,
    border: `1px solid ${alpha(
      active ? theme.palette.primary.main : theme.palette.divider,
      active ? (isDark ? 0.4 : 0.22) : isDark ? 0.36 : 0.72,
    )}`,
    boxShadow: active
      ? `0 14px 28px -24px ${alpha(theme.palette.primary.main, isDark ? 0.82 : 0.45)}, inset 0 1px 0 ${alpha(theme.palette.common.white, isDark ? 0.06 : 0.72)}`
      : isDark
        ? `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.04)}`
        : `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.72)}`,
    backgroundImage: isDark
      ? `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.045)} 0%, transparent 100%)`
      : `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.82)} 0%, transparent 100%)`,
    '&:hover': {
      bgcolor: alpha(theme.palette.primary.main, isDark ? 0.12 : 0.05),
    },
  });

  return (
    <FontButton
      {...props}
      sx={buttonSx}
      fontFamily={fontFamily}
    >
      {active && <TickIcon icon="material-symbols:check-circle-rounded" />}
      <IconifyIcon
        icon="material-symbols:match-case-rounded"
        sx={{ fontSize: 32, color: active ? 'primary.main' : 'text.secondary' }}
      />
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: active ? 500 : 400,
          fontFamily,
          color: active ? 'primary.main' : 'text.primary',
          lineClamp: 2,
        }}
      >
        {fontFamily}
      </Typography>
    </FontButton>
  );
};

interface FontButtonProps {
  fontFamily: FontFamily;
}

const FontButton = styled((props: ButtonProps) => <Button color="neutral" fullWidth {...props} />)<FontButtonProps>(
  ({ theme, fontFamily }) => ({
    padding: theme.spacing(1),
    paddingTop: theme.spacing(1.5),
    gap: theme.spacing(1),
    flex: 1,
    height: '100%',
    flexDirection: 'column',
    borderRadius: Number(theme.shape.borderRadius) * 2,
    position: 'relative',
    fontFamily,
  }),
);

const TickIcon = styled(IconifyIcon)(({ theme }) => ({
  color: theme.vars.palette.primary.main,
  fontSize: 20,
  position: 'absolute',
  top: 4,
  left: 4,
}));
