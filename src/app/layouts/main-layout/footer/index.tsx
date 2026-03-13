import { Box, Divider, Stack, Tooltip, Typography } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import Logo from 'shared/components/common/Logo';

const Footer = () => {
  const techIcons = [
    { icon: 'logos:python', label: 'Python' },
    { icon: 'logos:django-icon', label: 'Django' },
    { icon: 'logos:react', label: 'React' },
    { icon: 'logos:material-ui', label: 'MUI' },
  ];

  return (
    <>
      <Divider />
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={[
          {
            columnGap: 2,
            bgcolor: 'background.default',
            justifyContent: { xs: 'center', sm: 'space-between' },
            alignItems: 'center',
            height: ({ mixins }) => mixins.footer,
            py: 1,
            px: { xs: 3, md: 5 },
            textAlign: { xs: 'center', sm: 'left' },
            rowGap: 1,
          },
        ]}
      >
        <Stack direction="row" alignItems="center" columnGap={1.25}>
          <Logo showName={false} sx={{ width: 26, height: 40 }} />
          <Typography
            variant="caption"
            component="p"
            sx={{
              lineHeight: 1.6,
              fontWeight: 'medium',
              color: 'text.secondary',
            }}
          >
            KEP.uz ©
          </Typography>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          flexWrap="wrap"
          columnGap={1}
          rowGap={0.5}
        >
          <Typography variant="caption" component="span" color="text.secondary">
            Powered by
          </Typography>

          {techIcons.map(({ icon, label }) => (
            <Tooltip key={icon} title={label} arrow>
              <Box component="span" sx={{ display: 'inline-flex' }}>
                <IconifyIcon icon={icon} width={22} height={22} />
              </Box>
            </Tooltip>
          ))}
        </Stack>
      </Stack>
    </>
  );
};

export default Footer;
