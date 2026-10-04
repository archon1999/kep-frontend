import { Box, Stack, Typography } from '@mui/material';
import { type Hackathon } from 'modules/hackathons/domain';
import Image from 'shared/components/base/Image';
import HackathonTabs from './HackathonTabs';

const HackathonPageHeader = ({ hackathon }: { hackathon: Hackathon }) => (
  <Box
    component="header"
    sx={(theme) => ({
      borderRadius: { xs: 2, md: 3 },
      p: { xs: 1.5, md: 4 },
      flexShrink: 0,
      position: 'relative',
      overflow: 'hidden',
      background: `linear-gradient(135deg, ${theme.palette.primary.light}18, ${theme.palette.info.light}12)`,
    })}
  >
    {hackathon.logo ? (
      <Box
        sx={{
          position: 'absolute',
          right: { xs: -44, md: 24 },
          bottom: { xs: -36, md: 8 },
          opacity: { xs: 0.06, md: 0.08 },
          pointerEvents: 'none',
        }}
      >
        <Image src={hackathon.logo} alt="" sx={{ width: { xs: 150, md: 200 } }} />
      </Box>
    ) : null}
    <Stack direction="column" spacing={{ xs: 1.25, md: 2 }} position="relative" zIndex={1}>
      <Typography
        component="h1"
        variant="h5"
        fontWeight={800}
        sx={{
          minWidth: 0,
          overflowWrap: 'anywhere',
          fontSize: { xs: '1.25rem', md: undefined },
          lineHeight: { xs: 1.15, md: undefined },
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        {hackathon.title}
      </Typography>
      <HackathonTabs hackathon={hackathon} />
    </Stack>
  </Box>
);

export default HackathonPageHeader;
