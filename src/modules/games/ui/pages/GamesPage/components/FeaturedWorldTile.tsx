import GameTile from './GameTile';

const FeaturedWorldTile = ({ best }: { best?: number }) => (
  <GameTile id="keppy-world" best={best} featured />
);

export default FeaturedWorldTile;
