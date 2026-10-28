# KEP design system

The current interface is the application's **Default** theme. **Cobalt** retains
its original blue light/dark palettes and component treatment. There is no
separate design-specific provider, override bundle, or navigation implementation.

## Ownership

- `src/app/theme/presets.ts`: canonical preset IDs and persisted-setting migration.
- `src/app/theme/palettes/default.ts`: Default light/dark palettes.
- `src/app/theme/palette/{lightPalette,darkPalette}.ts`: original Cobalt palettes.
- `src/app/theme/tokens.ts`: shared accent, typography and layout values.
- `src/app/theme/fonts.ts`: supported reading fonts, local font faces and preference migration.
- `src/app/theme/typography.ts`: reading, display, metric and label roles.
- `src/app/theme/components/CssBaseline.tsx`: publishes palette-backed CSS variables
  and responsive layout tokens through the normal MUI theme.
- `src/app/theme/components/`: reusable Button, Card, Paper, Tab, Dialog, table and
  form-control styling. `Paper variant="framed"` supplies square menu surfaces;
  `Paper variant="panel"` supplies connected panels and their four-edge focus/hover treatment.
- `src/app/theme/styles/`: shared page header, panel decoration, motion styles and
  existing surface/navigation preferences.
- `src/app/theme/editor.ts`: Monaco light/dark theme registration.
- `src/shared/components/motion/InteractionEffects.tsx`: shared interaction effects.

Feature-specific composition remains beside its page. Home sections, ContestListCard
and NavMenu have functional names and consume the active theme. Features should use
MUI controls and theme tokens rather than copy palettes or create preset-specific
component trees. Assets and font files live under `public/assets/theme/`; provenance
is documented in that directory's README.

Application-owned `.css` files have been removed. Global foundations are registered
once through `MuiCssBaseline`; page layouts use typed MUI `styled` objects beside the
page. Portaled Menu/Popover/Drawer roots have scoped MUI styles while keeping MUI's
native paper positioning, scrolling and focus behavior. Vendor styles for Devicon, SimpleBar and KaTeX remain with
their respective libraries.

## Appearance and compatibility

Default and Cobalt both support Light, Dark and System. Choosing between them
preserves the selected appearance mode. Existing single-mode presets continue to
select their supported mode.

Stored `flames` becomes `default`; `old-blue`, `default-light` and `default-dark` become
`cobalt`. A legacy light preset without a saved appearance remains light.
Explicit appearance, supported reading fonts, navigation, primary color and
accessibility preferences are preserved. Retired Roboto, Inter and Alpha Lyrae body
preferences migrate to Open Sans; Alpha Lyrae remains the independent display font.
Canonical values are persisted after initialization.

The first-paint bootstrap in `index.html` applies the same mode migration before
React mounts. Compatibility names are confined to that bootstrap, the migration
helper and regression tests; no component uses them.

## Visual conventions

- Dark/light canvas, thin framed borders, cyan/sand accents and restrained patterns.
- Alpha Lyrae display typography and pixel numerals; Open Sans for reading text.
- Shared primary contained buttons provide the gradient call to action.
- Neutral header controls, common bounded page/header width, illustrated menus.
- Compact contest hero/cards, readable announcements and prominent View contest.
- Default pagination uses square outlined controls, pixel numerals and a gradient
  selected page. List frames end with a continuous bottom border; breathing room
  belongs outside the frame so column dividers reach the closing edge.
- Expanded footer belongs only to the guest landing page.
- Motion respects reduced-motion preferences; page layouts remain responsive.

## Reference composition: contests list

The contests list is the baseline for new list pages. Reuse these building blocks
before adding page-specific selectors:

Hackathons, arena and tournaments use `FramedListPage` for the same bounded frame,
closing border and outside spacing. `listPage.ts` owns the frame styles consumed by
contests too. `ListPagination` shares responsive page controls across all four lists.
`EventListCard` composes the common title, category/status, schedule, metric and action
roles without fetching data. Features supply their own content: project logos and
counts for hackathons, chapters and live countdowns for arena, formats and player
counts for tournaments. Error, loading and empty states remain explicit.

| Role                | Shared API                              | Contract                                                                   |
| ------------------- | --------------------------------------- | -------------------------------------------------------------------------- |
| Intro               | `PageHeader variant="hero"`             | Compact title, short description, optional eyebrow and dot pattern         |
| Content/leaderboard | `Paper variant="panel"`                 | Square corners, thin divider, corner marks, four-edge hover/focus gradient |
| Dropdown            | `Paper variant="framed"`                | Square themed surface; no detached legacy dropdown style                   |
| Category            | `Chip variant="category"`               | Compact uppercase gradient-outline pill                                    |
| State               | `Chip variant="status" color="success"` | Quiet semantic status; neutral is the default                              |
| Primary action      | `Button variant="contained"`            | One prominent gradient action per card                                     |
| Pixel value         | `Typography variant="metric"`           | Alpha Lyrae, tabular numbers, restrained size                              |
| Pixel emphasis      | `Typography variant="pixel"`            | Explicit decorative display role, never long prose                         |
| Small label         | `Typography variant="label"`            | Readable uppercase UI label                                                |

Header and content share `designTokens.layout.maxWidth` and responsive gutters. On desktop,
card and leaderboard headers share the same height and ruler boundary; on narrow
screens the columns stack. Keep descriptions readable and let the announcement
expand rather than making every card tall. Preserve semantic tables, definition
lists, accessible icon labels and visible keyboard focus.

### Hybrid typography

Use **Alpha Lyrae + Open Sans** by default. Display font is fixed independently of
the user's reading-font setting. Settings offers Open Sans, Plus Jakarta Sans and
DM Sans; Roboto and Inter are no longer loaded or offered.

- Logo, page/card headings, clocks and key counts: display font. Enable `ss01` only
  where pixel forms are intentional; do not apply it to a whole container.
- `MixedText` gives page/card titles and the Default wordmark a single pixel accent
  on the third character. `ScrambleText mixed` preserves that accent during hover/focus.
- Use `Typography variant="label"` for section eyebrows, table headers and metadata:
  the active reading font, 12px semibold, uppercase, 0.06em tracking and 1.5 line height.
- Descriptions, navigation, filters, buttons, usernames and table labels: reading
  font. Use 400 for body and 600 for emphasis, with 1.5–1.6 line height for prose.
- Start at 16px body, 14px secondary text and 11–12px compact labels. Reserve all
  caps for short metadata; avoid pixel prose and excessive letter spacing.
- Open Sans is self-hosted with normal and italic variable faces (300–800), including
  Cyrillic. Its OFL license is shipped with the assets.

The recommendation balances the distinctive pixel display with neutral, readable
body text. Font source: https://github.com/googlefonts/opensans.

## Local preview

Run `npm run dev`. Existing local preview: `http://localhost:4200/`.
For a remote development backend, `VITE_DEV_API_PROXY=true` proxies `/api/` and
`/ws/` while preserving normal session cookies and TLS verification. Keep API and
WebSocket configuration in the existing environment setup; no theme code handles
transport or authentication.

## Validation

Migration coverage is in `src/app/theme/presets.test.ts`: canonical/legacy IDs,
appearance preservation, missing/invalid modes and pre-React bootstrap parity.
`src/app/theme/fonts.test.ts` covers reading-font migration and supported choices.
Use `npm run test:unit`, `npm run typecheck`, `npm run lint` and `npm run build`.

Browser checks cover Default/Cobalt, appearance modes, desktop/mobile contests,
framed menus and the authenticated home. The available browser viewport has a
480 CSS pixel minimum; an exact 390px rendering is not certified.

## Detail pages

Use `PageHeader.backTo` for a localized “Back to list” action at the right of the
header, alongside existing actions. Pass an explicit list route from `resources`
and retain relevant query filters. Breadcrumb trails are not part of the theme.
The shared `BackToListButton` also serves admin form headers; on narrow screens,
actions wrap and the return button stays right-aligned. Root list pages do not
show a return button.

Contest detail routes use `FramedPage` for the same page boundary as event lists and `PageHeader` with `variant="detail"` for compact, left-aligned titles. The `panel` variant is available on both MUI Paper and Card for standalone surfaces. Within a framed detail page, use the shared `section` variant: transparent background, a bottom divider and no additional frame or corner markers. Contest headers contain the title, optional view actions and navigation. Actions align beside the title on desktop and wrap below it on narrow screens. Tabs, forms, table headers, status chips and pagination keep their normal MUI behavior and use theme styles.

`ContestPageLayout` composes this shared frame with contest navigation and handles route errors. `PageHeader.navigationComponent` places the tabs inside the detail header, below its title/actions and above the closing ruler. Mobile navigation uses the same slot with the responsive select control. The overview separates the announcement, schedule, participation metrics and podium; finished contests show results instead of an inactive countdown. Problem solving keeps its dedicated split-pane workspace.

Tables inside a page frame use the theme's `kep-data-grid-section` class on MUI DataGrid, with a flush layout and zero column gaps. The theme removes the table's outer border and rounded surface while preserving row separators and pagination. Sidebars share a single divider with the table; toolbars retain their own content padding.

`DataGridListPagination` adapts DataGrid's zero-based pagination model to the shared
`ListPagination` controls. Use it for framed event tables, preserving the table's
existing client/server pagination configuration. Contest attempts, registrants,
standings and rating changes all use this adapter.

Statistics use connected metric and chart sections with responsive dividers;
questions use plain list rows and an inline answer accent. Keep chart labels and
legends on the active reading font and palette, with pixel typography reserved for
key metrics. Question submission remains available only to eligible participants.

## Solving workspace

`WorkspaceRoot`, `WorkspacePane` and `WorkspaceToolbar` are shared structural
primitives, styled through `app/theme/styles/workspace.ts`. Keep the solving view
full-height with connected panes, fixed toolbars, independent scrolling and thin
theme dividers. Do not place cards inside the editor or console.

The contest workspace places contest identity and Run/Submit above a horizontal
problem navigator. The left pane shows the statement followed by My attempts,
without description/attempt tabs; code and a resizable console share the right
pane. Narrow contest layouts use a bottom Solve button and a return control next
to Run/Submit. Practice retains its navigation for description, attempts,
statistics and solvers. Submission success scrolls to the inline contest attempts.

Keep headers compact: a single action row, a 44px pane navigation row and a plain
problem title with inline difficulty/limits. `ProblemIntro` is shared by contest
and practice. Use the display font with a single pixel accent for the problem
title, 15px Open Sans with 1.65 line height for the statement, and a monospace font
for code and test data. Use sentence-case section headings and one compact sample
table with paired input/output and copy controls. `ProblemConsole`
owns Input/Output/Expected output navigation and sample selection; the page keeps
execution, submission, language and draft state. Preserve selectable statement
text, keyboard resize handles and labelled controls.

## Reference overlays

`FilterPopover` is the shared anchored filter surface for list and detail views.
It composes `Paper variant="framed"`, a labelled heading, close control, content
area and Reset/Done footer. Features retain their filter state and callbacks; the
shared component owns spacing, focus/escape behavior through MUI Popover and
responsive viewport bounds. Nested select menus use the same framed paper.

Default dialogs receive their square surface, thin border, top accent, backdrop
and title/content/action spacing from `MuiDialog` in the theme. Use `DialogHeader`
for an accessible mixed-font title and close button, and associate the Dialog via
`aria-labelledby`. `overlayFormStyles` keeps dialog and filter fields consistent.
Contestant results and contest replay are reference consumers; both switch to a
full-screen dialog on small screens while retaining their existing behavior.

## Site-wide reference consumers

The reference shell now covers practice (problems, attempts, ratings, study plans,
projects and tests), competitions (contests, arena, tournaments and hackathons),
battles (duels and challenges), users and profiles, account settings, blog,
calendar, shop, Kepcoin, cover voting, giveaways and updates. Admin list and form
layouts inherit the same foundations. Game catalogs use framed pages; interactive
games and the 3D world retain the space required by their dedicated canvases.

Use `FramedPage` once at the route boundary, `PageHeader variant="detail"` for
compact titles, and the shared list pagination. Forms inside a frame use the
`section` card variant. Standalone tiles use `panel`; avoid an additional panel
around an already framed table. Keep images and interactive illustrations specific
to their feature rather than replacing every page with the same artwork.

The authenticated dashboard and guest landing share typography and boundaries.
The landing keeps its larger hero, interactive preview, motion artwork and FAQ;
the dashboard prioritizes practice, account metrics, recent contests and activity.
Only the guest landing renders the full site footer.

The dashboard starts with a compact welcome header and a practice action beside
a two-by-two rating summary. Shortcuts are concise icon-and-text links. Subsequent
rows pair competitions with personal history, community stories with leaders,
and updates with birthdays. Shared column boundaries keep these rows aligned;
on mobile their DOM order becomes the reading order. Platform activity and totals
close the page. Empty upcoming events use a brief calendar link, without repeating
the section heading or inserting a large illustration. Home updates and activity
history use flat lists, and charts share one section instead of nested cards.

## Feedback, charts and motion

`PatternArtwork` provides decorative vector patterns for loading, empty, search,
authentication and error states. `EmptyState` combines the illustration, readable
copy and an optional action. `DataGridNoRowsOverlay` uses the same treatment for
empty and filtered tables. `StandalonePage` hosts login, 403, 404 and application
errors. Do not show an empty result in place of a failed request.

`DefaultLoader`, `PageLoader`, `Splash`, themed Skeleton and progress components
share the reference palette. The pre-React loader in `index.html` intentionally
uses a small inline critical stylesheet so it can render before bundles load;
its appearance migration remains covered by the preset tests.

`ReactEchart` resolves reading fonts, axis/grid colors and tooltip surfaces from
the theme without mutating the caller's options. It styles only legends explicitly
declared by the chart, including arrays of legends. Do not inject a legend into a
chart that has none. `calendarStyles` supplies FullCalendar with the same palette,
square event markers and compact weekday labels.

Motion includes brief page reveals, framed hover/focus accents, loading patterns
and landing illustrations. Honor `prefers-reduced-motion`; landing animations pause
when their sections leave the viewport. Keep primary actions readable and available
without waiting for animation.

## Migration verification

Read-only browser checks cover home and landing, problems and statistics, projects,
tests, users, duels, challenges, games, calendar, blog, shop, account settings,
admin problems, login and error surfaces. Checks include desktop, the available
480 CSS pixel mobile viewport, light/dark appearance, filters, search/reset,
pagination and representative dialogs. Purchase, submission, registration and
account mutations are not part of visual verification.

The migration uses existing module queries and mutations. Theme rules and shared
primitives own the visual language; feature files retain their business behavior.

### Surface review conventions

Within a framed detail page, use flat `section` surfaces for summaries, statistics,
forms and tables. A finished event needs a compact status instead of a zeroed
countdown or an empty sidebar. Keep standalone study-plan tiles and tournament
match nodes distinct, since their boundaries communicate separate destinations.

Use `ListPagination` for every paginated list, including narrow sidebar cards. It
measures its own container to reduce the page buttons and accepts a `disabled`
state while data changes. Compact tables should constrain long usernames rather
than adding a horizontal scrollbar for three short columns.

Resolve surface, text and divider colors through `theme.vars.palette`; the static
palette does not follow the active color scheme. The shared table, data-grid and
rich-text editor treatments own square edges and dark-mode contrast. Decorative
white study-plan assets receive a light-mode treatment in the branding helper.

Mobile settings open the selected form immediately. Their section navigation is
an explicit menu with a named trigger and a close button, not an initial overlay.

### Menus and dialogs

`overlayPaperStyles` and `overlayOptionStyles` define anchored surfaces and their
options. MUI Menu, Popover, Autocomplete, DataGrid panels and PickerPopper use these
styles in the default preset; Cobalt retains its own treatment. Use live palette
variables for opaque backgrounds, readable text and thin dividers. Avoid local
paper gradients, rounded card stacks or hardcoded blue backgrounds. Decorative
game canvases and distinct selectable items can keep their own boundaries.

Every dialog needs an accessible name and a shared `DialogHeader`. Search and
MUI's built-in date/time pickers retain their specialized headers. Omit `onClose`
only for a deliberately mandatory flow, such as accepting an incoming challenge.
Disable dismissal while an existing transaction requires it. Form popovers are
named dialogs; action lists are menus with a named trigger. Keep both bounded by
the viewport, with scrolling content and reachable actions.

Use `useConfirmationDialog` for asynchronous confirmation gates, and await its
result before a mutation. Cancel, Escape, backdrop dismissal and unmount resolve
to false. A second request cannot replace an outstanding confirmation. Native
`window.confirm` and `window.prompt` do not belong in themed flows. The rich-text
formula dialog preserves the cursor before opening, validates KaTeX syntax and
does not submit the surrounding editor form.

Overlay review includes source coverage of dialogs, menus, styled wrappers,
select fields, autocomplete, pickers, drawers and native browser prompts. Browser
checks exercise representative families in light/dark appearance and at desktop
and 480 CSS pixel widths, including nested filters, keyboard dismissal, replay,
formula validation and confirmation cancellation. Conditional purchase, game,
authentication and destructive completion states are reviewed in source without
performing their business actions. The detailed inventory and verification
artifacts are recorded under `output/overlay-review-*`.

### Mobile layout conventions

Use the shared page gutter and content inset: 16px on small screens and 12px at
380px and below. Detail headers use compact vertical spacing, wrapping actions
and readable mixed-font titles. Give flex and grid children `minWidth: 0`; allow
long titles and usernames to wrap before reducing the reading font size. Mobile
tabs retain the shared select treatment without inheriting heading typography.

Keep table overflow inside the table or data-grid container. Do not hide page
overflow to mask a fixed-width child. Media must fit its content width. At a
viewport edge, inset decorative corner markers instead of letting them create
document scrollbars. Form footers need a minimum height, wrapping explanatory
text and reachable actions rather than a fixed height.

Workspace resize handles must follow their panel group's orientation. Mobile
duels separate navigation from the Run/Submit row and retain usable statement
and editor heights. Podiums stack in ranking order on narrow screens; result
dialogs give the score its own row before the two player columns. Keep filters,
calendar controls, balances and preview placeholders compact without hiding
their content or changing business behavior.

The mobile review covers route families and representative detail states at
480 CSS pixels in the available browser, including light/dark checks. Rules for
320–390px were inspected in source; those widths were not browser-verified because
device emulation was unavailable under the browser permissions. Active paid,
submission and game states remain source-reviewed. Coverage, screenshots and
validation results are recorded under `output/mobile-review-*`.

### Statistics and chart surfaces

Statistics pages use the same framed page and content inset as competition lists.
Place the main metrics first, then the primary timeline or rating chart, followed
by distributions and detailed results. Use a zero-gap responsive grid with thin
shared boundaries instead of nested cards. Metrics use the `metric` typography
variant; labels use `label`, and section headings use the mixed display font.

Shared primitives live in `shared/components/statistics`: `StatisticsSection`
owns panel spacing and accessible headings, `StatisticsMetric` owns label/value
hierarchy (with an embedded variant), and `StatisticsChart` handles chart sizing,
loading and empty states. Panel tokens belong to `app/theme/styles/statistics`.
Feature modules keep their data queries, calculations and chart options.

Canvas charts must use `useChartPalette` for resolved colors from the active
light/dark scheme. CSS palette variables alone cannot update a canvas. The base
`ReactEchart` supplies shared typography, axes, legends, confined tooltips and
reduced-motion behavior. Use primary/secondary accents for comparisons and
semantic success/error colors for outcomes. Keep rating bands subtle, avoid
opaque decorative gradients, and include units on percentage axes.

Charts fit their panel; annual heatmaps may scroll inside a named bounded area.
Long language and category lists scroll within their panel without stretching an
adjacent chart. Keep filters labeled, preserve route query state, and distinguish
empty results from loading or failed queries. Arena player outcomes use a bar
chart; arena aggregates with different units remain separate metrics.
