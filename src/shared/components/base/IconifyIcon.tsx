import { Icon, IconProps } from '@iconify/react';
import { Box, BoxProps } from '@mui/material';

export interface IconifyProps extends IconProps {
  sx?: BoxProps['sx'];
}

const IconifyIcon = ({ ...rest }: IconifyProps) => {
  return (
    //@ts-ignore
    <Box
      ssr
      component={Icon}
      {...rest}
      sx={[...(Array.isArray(rest.sx) ? rest.sx : [rest.sx])]}
    />
  );
};

export default IconifyIcon;
