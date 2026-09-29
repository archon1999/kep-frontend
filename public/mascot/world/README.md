# Keppy World characters

These eleven transparent 512px WebP files are copied without modification from
the original artwork folder supplied by the user on 2026-09-29:

`C:/Users/Asus/Documents/Codex/2026-09-12/hatch-pet-c-users-asus-codex-2/outputs/`

- Characters 01–10: `KEP-telegram-static-webp/`
- Character 11: `11-kepcoin-explorer/11-kepcoin-explorer.webp`

## Eight movement directions

All eleven characters have front, front-left, left, back-left, back, back-right,
right and front-right views. The renderer selects them in 45-degree sectors
relative to the camera, so diagonal movement displays a diagonal pose.

`directions/` contains 21 generated transparent PNG atlases (1254 x 1254):

- Ten `*-directions.png` atlases supply front/back/left/right views.
- Eleven `*-diagonals.png` atlases supply back-left/back-right/front-left/front-right views.
- Keppy keeps the four existing cardinal poses in the sibling `kepper` directory.

Generated files are copied unchanged from the built-in image generation tool.
The user-supplied originals above are also unchanged. Atlas frame bounds in
`src/modules/keppy-world/ui/shared/helpers/mascot-atlas-rects.ts` normalize visible
height and foot alignment without rewriting pixels. Use those explicit bounds,
not fixed quadrants: some silhouettes cross the atlas midpoint, and the dragon's
two front diagonal cells require reversed semantic mapping.

`mascot-visuals.ts` connects stable game IDs to the artwork. The direction helper
clones texture transforms without changing shared source pixels. Do not substitute
another character's poses.

## Generation and review artifacts

The built-in image generation tool used each character's original as its identity
reference, and its cardinal atlas as a supporting reference for diagonal views.
Exact final prompts and image checks are saved in the local, ignored output folder:

- `output/imagegen/world-mascot-prompts.json`: consolidated exact prompts for all batches.
- `output/imagegen/mascot-directions-prompts-root.json`
- `output/imagegen/mascot-diagonals-prompts-root.json`
- `output/imagegen/mascot-directions-batch-b-prompts.json`
- `output/imagegen/mascot-diagonals-batch-b-prompts.json`
- `output/imagegen/mascot-directions-batch-b-qa.json`
- `output/imagegen/mascot-diagonals-batch-b-qa.json`
- `output/playwright/directions-review.html` and `directions-review.png`: all 88 views.
- `output/playwright/world-kepbot-<direction>.png`: actual keyboard movement checks.

The gallery and game use the same source assets and crop rectangles. PNG alpha,
complete silhouettes, orientation and absence of neighboring-frame bleed were
checked. These are rendered sprite views; they are not new rigged 3D models.
