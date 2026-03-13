import { Box, Stack, StackOwnProps } from '@mui/material';
import Lottie from 'lottie-react';
import splash from 'shared/assets/json/splash-loader.json';

const Splash = (props: StackOwnProps) => {
  return (
    <Stack
      {...props}
      sx={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    >
      <Box
        sx={{
          height: 50,
          width: 50,
        }}
      >
        <Lottie animationData={splash} />
      </Box>
    </Stack>
  );
};

export default Splash;
