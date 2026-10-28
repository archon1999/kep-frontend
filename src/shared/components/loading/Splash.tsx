import { useTranslation } from 'react-i18next';
import { Box, Stack, StackOwnProps } from '@mui/material';
import Logo from 'shared/components/common/Logo';
import DefaultLoader from './DefaultLoader';

const Splash = (props: StackOwnProps) => {
  const { t } = useTranslation();
  return (
    <Stack
      {...props}
      role="status"
      aria-label={t('common.mascot.loading')}
      sx={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100dvh',
          bgcolor: 'background.default',
          p: 3,
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    >
      <Box
        sx={{
          width: 360,
          maxWidth: '100%',
          border: 1,
          borderColor: 'divider',
          px: 4,
          pt: 4,
          position: 'relative',
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            width: 5,
            height: 5,
            bgcolor: 'text.primary',
          },
          '&::before': { top: -3, left: -3 },
          '&::after': { bottom: -3, right: -3 },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Logo />
        </Box>
        <DefaultLoader />
      </Box>
    </Stack>
  );
};
export default Splash;
