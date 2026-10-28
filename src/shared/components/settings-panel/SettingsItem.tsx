import { ReactElement, isValidElement, useState } from 'react';
import { Box, Typography } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import Image from 'shared/components/base/Image';

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
      sx={(theme) => ({
        position: 'relative',
        width: 1,
        p: 1,
        border: '1px solid',
        borderRadius: 0,
        borderColor: active ? 'primary.main' : 'divider',
        bgcolor: active ? 'action.selected' : 'transparent',
        transition: theme.transitions.create(['border-color', 'background-color']),
        '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
      })}
    >
      <Box
        sx={[
          {
            height: 64,
            width: 1,
            position: 'relative',
            mb: 1.25,
            backgroundColor: 'transparent',
            borderRadius: 0,
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
            fontSize: 16,
            position: 'absolute',
            top: 6,
            right: 6,
          }}
        />
      )}
      <Typography
        variant="subtitle2"
        sx={{
          textAlign: 'center',
          lineHeight: 1.4,
          color: active || isHovered ? 'primary.main' : 'text.primary',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default SettingsItem;
