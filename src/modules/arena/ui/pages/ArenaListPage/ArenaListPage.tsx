import { Box, Stack } from '@mui/material';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import ArenaListPageHeroCard from './ArenaListPageHeroCard.tsx';
import ArenaListPageSection from './ArenaListPageSection.tsx';

const ArenaListPage = () => (
  <Box sx={responsivePagePaddingSx}>
    <Stack direction="column" spacing={3}>
      <ArenaListPageHeroCard />
      <ArenaListPageSection />
    </Stack>
  </Box>
);

export default ArenaListPage;
