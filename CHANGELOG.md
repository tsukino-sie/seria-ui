# Changes

## 1.6.0

- Reusable responsive Hero split layout, explicit glass surface, token-based title and spacing controls.
- Transparent PageSection with reading width, heading hierarchy and shared section spacing; MediaFrame with aspect ratio and captions.
- The three showcase compositions now use the editable examples shipped in the package. Code preview exposes the same TSX, CSS and theme files.
- A runnable starter includes the exact library package, React project, styles and example image. Release metadata includes both archive hashes.
- Separate consumer builds verify the installed package and examples with React 18.3 and React 19. CI packages downloads before building the showcase.
- Existing page adoption guide, inherited fonts, preserved content and explicit migration guidance from 1.3.
- The keynote example remains visible between scenes. Only captions fade and move according to navigation direction; reduced motion uses a short opacity transition.

This release also publishes the previously local 1.4 and 1.5 work: Container/Stack/Cluster/Columns, inherited-surface themes, configurable surfaces, font inheritance and PlaybackControls with theme-aware progress colors.
