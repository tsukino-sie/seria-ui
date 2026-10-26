# Changes

## 1.9.1

- Explain visible code tags as named UI roles, separately from setting values. Add tag and file help to the exported-source viewer, setup example and playback examples.
- Make the first layout demonstration slide the existing text and image into opposite columns instead of merging a glass card over the photograph. Keep that arrangement during later surface and color chapters.
- Offer the same reverse layout in the editable example and playground, preserving the mobile reading order. Keep preview content fully visible; only the external chapter explanation fades.
- Add optional, accessible annotations to CodeExample and include these changes in both downloadable starters.

## 1.9.0

- Publish the Studio's actual presentation, single browser frame, explained code sample and responsive preview as font-inheriting library components.
- Share playback timing, single-pass completion/replay, caption transitions, layout animation and configurable section navigation between consumers and the Studio.
- Generate a complete editable Studio starter from the production source, including all layouts, customization controls, exports, examples, styles and artwork. Preserve the smaller page starter.
- Build both downloaded starters with the installed package under React 18.3 and 19; verify Studio source parity and retain license notices. Document the full tool and layout inventory.

## 1.8.2

- Present one showcase section at a time with viewport-based minimum height and native scroll snapping. Section backgrounds vary subtly within the olive palette, without divider lines.
- Replace the shrunken default preview with automatic responsive width and a readable, scrollable page. Keep whole-page overview, exact-size inspection and manual viewport widths available.
- Increase example body text to 16px and small presentation labels to 12px. Make mobile preview controls fit on one row and preserve manually selected widths during responsive changes.

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
