# Seria UI maintenance

- Preserve the consuming project's typeface, content, assets and working interactions. The library must not choose or download fonts.
- Keep styling scoped to Seria components. Use `ThemeProvider surface="inherit"` for incremental adoption. Do not replace an existing page with repeated generic Hero panels.
- `examples/` is the editable source used by the showcase and distributed starter. Do not create a separate, simplified copy for the code panel.
- Put reusable layout and surface behavior in `src/`; put example branding, copy and artwork in `examples/` or `showcase/`.
- Check the actually installed package version in a consumer. A copied tgz or another checkout does not update when this repository changes.
- Keep package.json, package-lock.json and src/version.ts aligned. Run `npm run check`, `npm test`, `npm run format:check`, `npm run build:demo`, `npm run test:consumer`, and `npm run build:showcase` for a release. Consumer verification installs the generated package in isolated React 18.3 and React 19 projects.
- `npm run package:release` creates the package, runnable starter and release.json together. Prepare downloads before building the showcase. Preserve LICENSE, NOTICE and third-party notices.
- Preserve the hosted site's audience. Do not claim GitHub, package and site are synchronized until the source push and deployment have both succeeded.
