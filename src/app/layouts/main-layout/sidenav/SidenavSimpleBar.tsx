import { PropsWithChildren } from 'react';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import SimpleBar, { SimpleBarProps } from 'shared/components/base/SimpleBar';
import { useThemeMode } from 'shared/hooks/useThemeMode';
import { cssVarRgba } from 'shared/lib/utils';

const SidenavSimpleBar = ({ children, sx, ...props }: PropsWithChildren<SimpleBarProps>) => {
  const {
    config: { navColor },
  } = useSettingsContext();
  const { isDark } = useThemeMode();

  return (
    <SimpleBar
      {...props}
      autoHide
      sx={{
        height: 1,
        '& .simplebar-track': {
          '&.simplebar-vertical': {
            '& .simplebar-scrollbar': {
              '&:before': {
                backgroundColor: (theme) =>
                  navColor === 'vibrant'
                    ? isDark
                      ? cssVarRgba(theme.vars.palette.common.whiteChannel, 0.3)
                      : cssVarRgba(theme.vars.palette.common.whiteChannel, 0.7)
                    : 'chGrey.300',
              },
            },
          },
        },
        ...sx,
      }}
    >
      {children}
    </SimpleBar>
  );
};

export default SidenavSimpleBar;
