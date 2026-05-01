import { ReactElement, isValidElement, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import Image from 'shared/components/base/Image';
import useResolvedThemeMode from 'shared/hooks/useResolvedThemeMode';

interface SettingsItemProps {
  label: string;
  image:
    | string
    | { light: string; dark: string }
    | ReactElement<{ hovered?: boolean; active?: boolean }>;
  active?: boolean;
}

const SettingsItem = ({ label, image, active }: SettingsItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isDark } = useResolvedThemeMode();

  const renderImage = () => {
    if (isValidElement(image)) {
      const ImageComponent = image.type as React.ComponentType<{
        hovered?: boolean;
        active?: boolean;
      }>;

      return (
        <Box
          sx={{
            height: 1,
            width: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ImageComponent {...image.props} hovered={isHovered} active={active} />
        </Box>
      );
    }

    return (
      <Image
        src={image as string | { light: string; dark: string }}
        sx={{ height: 1, width: 1, display: 'block' }}
      />
    );
  };

  return (
    <Box
      className="SettingsItem"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={[
        (theme) => ({
          bgcolor:
            active || isHovered
              ? alpha(theme.palette.primary.main, isDark ? 0.14 : 0.05)
              : theme.vars.palette.background.menuElevation1,
          backgroundImage:
            isDark
              ? `linear-gradient(180deg, ${alpha(theme.palette.common.white, active || isHovered ? 0.06 : 0.035)} 0%, transparent 100%)`
              : `linear-gradient(180deg, ${alpha(theme.palette.common.white, active || isHovered ? 0.72 : 0.94)} 0%, transparent 100%)`,
          position: 'relative',
          borderRadius: 2.5,
          p: 0.75,
          transition: theme.transitions.create(['background-color', 'box-shadow'], {
            duration: theme.transitions.duration.shorter,
          }),
          boxShadow:
            active && isDark
              ? `0 18px 34px -28px ${alpha(theme.palette.primary.main, 0.82)}, inset 0 1px 0 ${alpha(theme.palette.common.white, 0.06)}`
              : active
                ? `0 16px 34px -28px ${alpha(theme.palette.primary.main, 0.36)}, inset 0 1px 0 ${alpha(theme.palette.common.white, 0.72)}`
                : isDark
                  ? `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.035)}`
                  : `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.74)}`,
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            border: `1px solid ${alpha(
              active || isHovered ? theme.palette.primary.main : theme.palette.divider,
              active || isHovered
                ? isDark
                  ? 0.42
                  : 0.18
                : isDark
                  ? 0.36
                  : 0.62,
            )}`,
          },
        }),
      ]}
    >
      <Box
        sx={[
          {
            height: 76,
            width: 1,
            position: 'relative',
            mb: 1.25,
            backgroundColor: 'transparent',
            borderRadius: 2,
            overflow: 'hidden',
          },
        ]}
      >
        {renderImage()}
      </Box>

      {active && (
        <IconifyIcon
          icon="material-symbols:check-circle-rounded"
          sx={{
            color: 'primary.main',
            fontSize: 20,
            position: 'absolute',
            top: 3,
            left: 3,
          }}
        />
      )}
      <Typography
        variant="subtitle2"
        sx={{
          textAlign: 'center',
          lineHeight: 1.2,
          color: active || isHovered ? 'primary.main' : 'text.primary',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default SettingsItem;
