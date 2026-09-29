# World decoration manifest

`src/modules/keppy-world/domain/utils/world-decoration.json` is the canonical
saved placement of trees and solid scenery at each of the ten world levels.
The frontend renders its trees and uses its footprints for local prediction.
The realtime server imports an identical copy at
`../kep-backend/realtime-server/src/world-decoration.json` for authoritative
collision. Both copies must travel in the same feature change.

The generator lives here so placement can be reproduced without a browser,
random gameplay state or the current working directory. It uses a fixed seed,
reserves construction sites and quest approaches, reserves the new tree placements around all five bridge approaches,
and checks that later levels do not remove earlier solids. The original seven
manifest stages are also compared exactly before writing, so adding the southern
workshop island, eastern crystal island and western citadel cannot change the
existing settlement's saved placement. Other prop positions
must remain aligned with `WorldStructures.tsx`; building/coast geometry lives in
`terrain.ts` and its realtime counterpart `movement.ts`.

Run with Node 22.6 or later from the frontend directory:

```powershell
# Read-only: recompute and compare both saved manifests.
node --experimental-strip-types scripts/world/generate-decor.mjs --check

# Explicitly update the canonical manifest and its sibling backend copy.
node --experimental-strip-types scripts/world/generate-decor.mjs --write --sync-backend
```

The same script works when invoked by absolute path from another directory.
`--write` without `--sync-backend` changes only the frontend manifest; the next
`--check` will report a stale backend mirror. No regeneration happens as a side
effect of a build, test or application startup.

After any placement or ground change:

1. Run the generator with `--check` after regeneration/synchronization.
2. Run `node --experimental-strip-types --test src/modules/keppy-world/domain/utils/terrain.test.ts`
   in the frontend and `npm test` in `kep-backend/realtime-server`.
3. Compare all ten exported server maps (`npm run map`) with the frontend
   coastlines, building footprints and decoration data. Check kiosk clearance,
   bridge centerlines, shore monotonicity and connected walkable ground.
4. Run frontend typecheck/lint and the realtime build; inspect construction and
   collision in the actual browser before deployment.

The level 8–10 extension regenerated and synchronized both manifests through
this script. The first seven saved stages stayed identical. At level 10 the
manifest contains 236 trees and 294 scenery colliders; the separate building
list has 32 footprints. The new landmark definitions are shared by terrain,
visual rendering and this generator, including the workshop crane and water
tower, crystal clusters, citadel fountain and flags.
