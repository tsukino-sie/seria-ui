import type { ThemeTokens } from 'seria-ui';

// Optional example palette. The library does not require these colors.
export const exampleThemes = {
  light: {
    '--pui-bg': '#f3f5ec',
    '--pui-panel': '#ffffff',
    '--pui-inset': '#ebefdf',
    '--pui-ink': '#29321f',
    '--pui-muted': '#626e53',
    '--pui-line': '#dce3d0',
    '--pui-control-line': '#879674',
  },
  dark: {
    '--pui-bg': '#141a0f',
    '--pui-panel': '#1e2816',
    '--pui-inset': '#29351e',
    '--pui-ink': '#eef3e2',
    '--pui-muted': '#b3bfa1',
    '--pui-line': '#3b4a2b',
    '--pui-control-line': '#82966e',
  },
} satisfies Record<'light' | 'dark', ThemeTokens>;
