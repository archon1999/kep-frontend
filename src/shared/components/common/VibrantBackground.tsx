import { Box } from '@mui/material';
import sidebarVibrant from 'shared/assets/images/background/6.webp';
import topVibrant from 'shared/assets/images/background/7.webp';

interface VibrantBackgroundProps {
  position?: 'top' | 'side';
}

const VibrantBackground = ({ position }: VibrantBackgroundProps) => {
  return (
    <Box
      sx={[
        {
          backgroundPositionX: 'left',
          backgroundPositionY: 'top',
          top: 0,
          position: 'absolute',
          transform: 'none',
          height: '100%',
          width: '100%',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'background.default',
            opacity: 0.8,
          },
        },
        position === 'top' && {
          backgroundImage: `url(${topVibrant})`,
        },
        position === 'side' && {
          backgroundImage: `url(${sidebarVibrant})`,
        },
      ]}
    />
  );
};

export default VibrantBackground;
