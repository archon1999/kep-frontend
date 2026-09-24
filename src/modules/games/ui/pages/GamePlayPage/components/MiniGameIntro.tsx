import { Box, Button, Stack, Typography } from '@mui/material';
import type { GameId } from 'modules/games/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { gamePreviewSrc } from '../../GamesPage/components/gameAssets';

type Props = {
  id: GameId;
  title: string;
  description: string;
  action: string;
  onStart: () => void;
};

const MiniGameIntro = ({ id, title, description, action, onStart }: Props) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: {
        xs: 'minmax(0, 1fr)',
        md: 'minmax(0, 1.35fr) minmax(320px, 0.9fr)',
      },
      '@media (min-width: 740px) and (max-width: 899.95px)': {
        gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
      },
      alignItems: 'stretch',
      overflow: 'hidden',
    }}
  >
    <Box
      sx={{
        overflow: 'hidden',
        bgcolor: '#203d5c',
        aspectRatio: '16 / 9',
        minWidth: 0,
        borderRadius: 2,
      }}
    >
      <Box
        component="img"
        src={gamePreviewSrc(id)}
        alt=""
        sx={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </Box>
    <Stack
      alignItems="flex-start"
      justifyContent="center"
      spacing={{ xs: 2, md: 2.5 }}
      sx={{ minWidth: 0, px: { xs: 0, md: 4 }, py: { xs: 2.5, md: 3 } }}
    >
      <Box>
        <Typography
          component="h2"
          sx={{
            maxWidth: 440,
            fontSize: { xs: 24, md: 30 },
            fontWeight: 700,
            lineHeight: 1.18,
            letterSpacing: '-0.035em',
          }}
        >
          {title}
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ mt: 1.25, maxWidth: 420, fontSize: { xs: 14, sm: 15 }, lineHeight: 1.6 }}
        >
          {description}
        </Typography>
      </Box>
      <Button
        variant="contained"
        size="large"
        onClick={onStart}
        endIcon={<IconifyIcon icon="mdi:arrow-right" width={19} />}
        sx={{ px: 2.5, boxShadow: 'none' }}
      >
        {action}
      </Button>
    </Stack>
  </Box>
);

export default MiniGameIntro;
