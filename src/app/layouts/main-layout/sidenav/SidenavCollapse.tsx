import { useState } from 'react';
import { Box, ButtonBase, Tooltip } from '@mui/material';
import { useSettingsContext } from 'app/providers/SettingsProvider';

const SidenavCollapse = () => {
  const [isHovered, setIsHovered] = useState(false);
  const {
    config: { sidenavCollapsed },
    toggleNavbarCollapse,
  } = useSettingsContext();

  const paths = {
    vertical: 'M8 4v16',
    chevronRight: 'M8 6l6 6-6 6',
    chevronLeft: 'M14 6l-6 6 6 6',
  };

  return (
    <ButtonBase
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onClick={toggleNavbarCollapse}
      disableRipple
      sx={{
        width: 40,
        flexShrink: 0,
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        right: -30,
        height: 80,
        borderRadius: 0,
        textAlign: 'center',
        p: '0px !important',
      }}
    >
      <Tooltip
        open={isHovered}
        title={sidenavCollapsed ? 'Expand' : 'Collapse'}
        placement="right"
        slotProps={{
          tooltip: {},
          popper: {
            sx: {
              cursor: 'pointer',
            },
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, -8],
                },
              },
            ],
          },
        }}
      >
        <Box
          component="svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          sx={{
            width: 24,
            stroke: (theme) => theme.vars.palette.background.elevation4,
            height: 24,
            '& path': {
              transition: 'opacity 180ms ease, transform 180ms ease',
              transformOrigin: 'center',
              '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
            },
          }}
        >
          <path d={paths.vertical} opacity={isHovered ? 0 : 1} />
          <path
            d={sidenavCollapsed ? paths.chevronRight : paths.chevronLeft}
            opacity={isHovered ? 1 : 0}
            style={{ transform: `translateX(${isHovered ? 0 : -3}px)` }}
          />
        </Box>
      </Tooltip>
    </ButtonBase>
  );
};

export default SidenavCollapse;
