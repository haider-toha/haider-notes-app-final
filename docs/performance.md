# Performance work — 10 September 2026

The review covered startup and routes, all components and stylesheets, pagination and authored content, the page-flip adapter and its installed renderer, loose sheets, expanded media, all three simulation loops, fonts/images, prerendering, deployment configuration, and regression scripts. The changes retain the notebook's handwriting, paper geometry, soft folds and native mobile scrolling.

## Changes

- Compile Tailwind v3 into production CSS instead of generating it through the Play CDN in each browser.
- Generate pagination boundaries during development/build. The browser slices the existing source at those offsets; it no longer runs the page-packing algorithm twice at startup. A baseline hash protects every original reading and legacy bookmark boundary for unchanged source.
- Load Mermaid near diagram pages, serialize its work, skip obsolete queued renders, and cache completed SVGs. Every live copy receives unique IDs, including detached sheets and expanded viewers. Cache equation markup synchronously to avoid delayed math reflow.
- Render the page engine only when its inputs change or an animation is running. Preserve the original fold calculations. Pin page-flip to 2.0.7 because the adapter depends on its internals; exercise lifecycle and interaction tests before upgrading.
- Memoize stable sheet faces and content, precompute decorative ink, and mount mobile grip controls near active pages. Retain all 269 engine leaf elements and existing destination preparation.
- Set correct book dimensions before the first engine paint. Batch writing-area geometry reads and avoid rewriting figure dimensions during scrolling.
- Preload a lossless WOFF2 handwriting font with identical glyphs and metrics. Serve a lossless full-size WebP and a smaller responsive image, retaining the original PNG for expanded viewing and fallback.
- Skip hidden simulation charts/readouts and size canvas buffers for their displayed size and device pixel ratio. Preserve numerical integration steps and trajectories.

The same pass corrected table typography and diagram presentation; see the [diagram audit](diagram-audit.md). Tables keep the notebook's 24px desktop / 23px mobile handwriting, with horizontal panning for wide phone tables.

## Asset measurements before the cover addition

The original production build was retained separately for comparison. Sizes below are bytes; gzip measurements use Node's default gzip settings on the actual emitted entry file.

| Asset | Original | Optimized | Reduction |
|---|---:|---:|---:|
| Entry JavaScript | 1,426,017 | 807,235 | 43.4% |
| Entry JavaScript, gzip | 410,402 | 263,361 | 35.8% |
| Handwriting font | 147,036 TTF | 40,904 WOFF2 | 72.2% |
| Full-resolution tulip image | 697,406 PNG | 396,016 lossless WebP | 43.2% |
| Small tulip image | 697,406 PNG | 179,148 WebP | 74.3% |

The small image is intentionally resampled to 320×486; the full-resolution WebP matches the original decoded RGBA pixels. The original image remains available for fallback and expanded viewing. The JavaScript figure describes the entry file, not every lazy diagram chunk combined. Home no longer requests Mermaid rendering chunks or the Tailwind Play CDN.

## Regression fixes found during integration

The original route suite exposed a stale passive page-change effect that could overwrite a browser Back destination and truncate Forward history. Page changes now publish directly from the engine event, with route restoration protected from intermediate callbacks. Navigation also settles an existing animation or captured fold before restoring its destination.

Detached phone images now inherit the bound page's height cap before painting and remain observed during resizing. Image transitions cover transform and shadow only; animating the height cap caused a visible size mismatch during detachment.

## Preserved contracts

The source audit verifies all 27 notes, 199,424 exact source characters, 267 reading pages, two contents leaves, 284 legacy bookmark pages and 102 intact rich blocks. The source content, note order, URL offsets and original page boundaries remain unchanged. Simulation regression fixtures compare all three original numerical trajectories after 120 frames as well as desktop/mobile canvas sizing and hidden diagnostics.

## Reproducing checks

```sh
npx playwright install chromium
npm run check
npm run check:performance
```

The full check owns its production/development servers and runs type, content, pagination, desktop, six mobile sizes, routes, interrupted history, detached media, figures, expanded viewers, all equations, all tables, simulation and engine lifecycle checks. Performance diagnostics run separately to avoid competing browser jobs. `NOTEBOOK_PERFORMANCE_OUTPUT` saves raw JSON; `NOTEBOOK_THROTTLE_NETWORK=1` adds a 150ms / 1.6Mbps network profile.

Install WebKit with `npx playwright install webkit` and use `NOTEBOOK_WEBKIT=1 npm run check` to include the desktop/mobile WebKit smoke suite.

Local browser emulation is not a physical iPhone or low-end Android measurement. Performance numbers should be compared under the same machine, CPU, network and cache conditions; they are not field Core Web Vitals. The static implementation and automated checks reduce regression risk but cannot guarantee the absence of every device-specific issue.

The subsequently added closed-cover homepage changes the startup scenario. The performance harness reports cover startup and the cost of opening separately; compare those separately from the earlier immediate-reading baseline.
