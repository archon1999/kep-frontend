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
        direction="row"
        sx={[
          {
            columnGap: { xs: 1.5, sm: 2 },
            bgcolor: 'background.default',
            justifyContent: { xs: 'center', sm: 'space-between' },
            alignItems: 'center',
            minHeight: ({ mixins }) => mixins.footer,
            height: 'auto',
            py: { xs: 0.75, sm: 1 },
            px: { xs: 1.5, sm: 3, md: 5 },
            textAlign: 'left',
            overflow: 'hidden',
          },
        ]}
      >
        <Stack
          direction="row"
          alignItems="center"
          columnGap={{ xs: 0.75, sm: 1.25 }}
          flexShrink={0}
        >
          <Logo showName={false} sx={{ width: { xs: 22, sm: 26 }, height: { xs: 34, sm: 40 } }} />
          <Typography
            variant="caption"
            component="p"
            sx={{
              lineHeight: 1.6,
              fontWeight: 'medium',
              color: 'text.secondary',
              whiteSpace: 'nowrap',
            }}
          >
            KEP.uz ©
          </Typography>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          flexWrap="nowrap"
          columnGap={{ xs: 0.75, sm: 1 }}
          minWidth={0}
        >
          <Typography
            variant="caption"
            component="span"
            color="text.secondary"
            sx={{ whiteSpace: 'nowrap' }}
          >
            Powered by
          </Typography>

          <Tooltip title="Aurora" arrow>
            <Box
              component="img"
              src="/aurora.svg"
              alt="Aurora"
              sx={{
                width: { xs: 20, sm: 22 },
                height: { xs: 20, sm: 22 },
                display: 'inline-flex',
                flexShrink: 0,
              }}
            />
          </Tooltip>

          {techIcons.map(({ icon, label }) => (
            <Tooltip key={icon} title={label} arrow>
              <Box component="span" sx={{ display: 'inline-flex', flexShrink: 0 }}>
                <IconifyIcon
                  icon={icon}
                  width={20}
                  height={20}
                  sx={{ width: { sm: 22 }, height: { sm: 22 } }}
                />
              </Box>
            </Tooltip>
          ))}
        </Stack>
      </Stack>
    </>
  );
};

export default Footer;
