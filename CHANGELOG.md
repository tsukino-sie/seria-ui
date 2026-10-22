# Changes

## 1.8.1

- Preserve the standard backdrop-filter declaration in optimized production CSS so glass blur and saturation controls work after deployment as they do during development.
- Verify the generated consumer CSS in React 18.3 and React 19 builds to catch this regression before publishing.

## 1.8.0

- A unified olive glass introduction and a viewport-sized live workbench. The document owns its continuous background; no fixed backdrop layer leaves blank areas in full-page captures.
- Whole-page fit at desktop, tablet, mobile and custom widths, plus a 100% view for detailed interaction. Small screens expose settings through the same workbench toolbar.
- Live controls for composition, layout, background, theme, glass opacity/blur/saturation, accent and custom color, corner radius, spacing, text scale, borders, shadows and motion. Exported Page.tsx includes these settings.
- A fourth editable composition exercises buttons, input, select, switch, badges, menus and dialogs. Stat and Dialog accept optional glass materials; glass blur and saturation are configurable CSS tokens.
- Korean preview titles keep their intended word groups, including narrow widths and enlarged text. All four examples and their shared styles ship in the runnable starter.

## 1.7.0

- PlaybackControls supports a completed state and a dedicated replay action, including a translated label and typed replay callback.
- The keynote stops after its final chapter, keeps the last progress track full and replays from the first chapter on request. Manually choosing a chapter clears completion.
- Chapters hold for 6.2 seconds. Caption exits take 360ms and entrances 680ms, with a shorter travel distance and gentler easing. Reduced motion uses a 280ms/520ms opacity transition.
- The example page remains visible throughout the transitions.

## 1.6.0

- Reusable responsive Hero split layout, explicit glass surface, token-based title and spacing controls.
- Transparent PageSection with reading width, heading hierarchy and shared section spacing; MediaFrame with aspect ratio and captions.
- The three showcase compositions now use the editable examples shipped in the package. Code preview exposes the same TSX, CSS and theme files.
- A runnable starter includes the exact library package, React project, styles and example image. Release metadata includes both archive hashes.
- Separate consumer builds verify the installed package and examples with React 18.3 and React 19. CI packages downloads before building the showcase.
- Existing page adoption guide, inherited fonts, preserved content and explicit migration guidance from 1.3.
- The keynote example remains visible between scenes. Only captions fade and move according to navigation direction; reduced motion uses a short opacity transition.

This release also publishes the previously local 1.4 and 1.5 work: Container/Stack/Cluster/Columns, inherited-surface themes, configurable surfaces, font inheritance and PlaybackControls with theme-aware progress colors.
