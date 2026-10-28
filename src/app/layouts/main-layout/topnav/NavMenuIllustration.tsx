import { Box } from '@mui/material';
import PatternArtwork, { type PatternArtworkKind } from 'shared/components/common/PatternArtwork';

const artwork: Record<string, PatternArtworkKind> = {
  practice: 'hackathon',
  battles: 'battles',
  competitions: 'competitions',
  more: 'more',
};
const NavMenuIllustration = ({ kind }: { kind: string }) => (
  <Box className="kep-nav-illustration" sx={{ display: 'flex', alignItems: 'center' }}>
    <PatternArtwork
      kind={artwork[kind] ?? 'more'}
      sx={{ width: '100%', '& .kep-pattern-signal': { animation: 'none', opacity: 1 } }}
    />
  </Box>
);
export default NavMenuIllustration;
