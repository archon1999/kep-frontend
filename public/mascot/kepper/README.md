# KEPPER frontend assets

Approved KEPPER reaction artwork from the KEP.uz emoji pack. PNG posters are used for static states, reduced motion and animation fallback. JSON files are the corresponding browser Lottie exports; Telegram TGS files stay in the emoji pack.

| Frontend pose | Emoji source |
| --- | --- |
| welcome | kepper-089 |
| thinking | kepper-079 |
| coding | kepper-081 |
| loading | kepper-086 |
| success | kepper-084 |
| celebrate | kepper-093 |
| coffee | kepper-091 |
| confused | kepper-092 |
| debug | kepper-082 |
| gg | kepper-088 |

`coin.webp` is the user-provided original KEPPER with the Kepcoin necklace, supplied on 2026-09-13. Keep its original colors and silhouette.

Use the shared `Kepper` component rather than importing Lottie into each feature. Motion modes are `static`, `once`, and `loop`. All animated frontend placements loop while visible. Static placements stay still, and reduced-motion preferences use the PNG poster.
