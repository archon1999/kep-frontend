# Static rank artwork

Approved KEP emoji artwork, exported at the resting frame as static SVG paths and gradients.
These files contain no animation, embedded raster images, fonts, scripts, or runtime dependencies.

- `challenges/`: all 9 ranks from `CHALLENGES_RATING_LEVELS`.
- `contests/`: all 13 emblems from `CONTESTS_RATING_LEVELS`.

The transparent canvas is trimmed with a small safety margin for use in tables and profile cards.
Keep SVG aspect ratios and avoid circular clipping: books, crowns, and other rank silhouettes
must remain intact. Challenge glyphs use Plus Jakarta Sans outlines (SIL Open Font License).

Design source: the approved TGS rank collection, exported by `emoji-pack/source/export_rank_svg.py`
in the parent workspace. Original contest PNGs remain available as design references.
