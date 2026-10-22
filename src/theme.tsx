/* Seria UI · Copyright (c) 2026 Sie · See LICENSE. */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  type CSSProperties,
} from 'react';
import { createAccentTokens } from './brand.js';
import { SERIA_VERSION } from './version.js';
export type Theme = 'light' | 'dark' | 'system';
export type ThemeTokens = CSSProperties & { [key: `--pui-${string}`]: string | number };
const valid = (value: unknown): Theme => (value === 'light' || value === 'dark' ? value : 'system');
const Context = createContext<{
  theme: Theme;
  resolved: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  style?: CSSProperties;
} | null>(null);
export function ThemeProvider({
  children,
  storageKey = 'panel-ui.theme',
  defaultTheme = 'system',
  accent,
  themes,
  style,
  surface = 'canvas',
}: {
  children: ReactNode;
  storageKey?: string;
  defaultTheme?: Theme;
  accent?: string;
  themes?: Partial<Record<'light' | 'dark', ThemeTokens>>;
  style?: ThemeTokens;
  /** Use inherit when adding components to an existing page. */
  surface?: 'canvas' | 'inherit';
}) {
  const [theme, setPreference] = useState<Theme>(() => {
    try {
      return valid(localStorage.getItem(storageKey) || defaultTheme);
    } catch {
      return defaultTheme;
    }
  });
  const [dark, setDark] = useState(
    () =>
      typeof window !== 'undefined' &&
      !!window.matchMedia?.('(prefers-color-scheme: dark)').matches,
  );
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!media) return;
    const update = () => setDark(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key === storageKey || e.key === null) setPreference(valid(e.newValue));
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [storageKey]);
  const setTheme = (next: Theme) => {
    setPreference(next);
    try {
      localStorage.setItem(storageKey, next);
    } catch {
      /* Session preference still works. */
    }
  };
  const resolved = theme === 'system' ? (dark ? 'dark' : 'light') : theme;
  const mergedStyle = {
    ...(accent ? createAccentTokens(accent, resolved) : {}),
    ...themes?.[resolved],
    ...style,
  };
  return (
    <Context.Provider value={{ theme, resolved, setTheme, style: mergedStyle }}>
      <div
        className="pui-theme"
        data-pui-surface={surface}
        data-pui-theme={resolved}
        data-seria-ui={SERIA_VERSION}
        data-seria-author="Sie"
        style={mergedStyle}
      >
        {children}
      </div>
    </Context.Provider>
  );
}
export function useTheme() {
  const value = useContext(Context);
  if (!value) throw new Error('ThemeProvider 안에서 사용해 주세요.');
  return value;
}
export function ThemePicker() {
  const { theme, setTheme } = useTheme();
  return (
    <label className="pui-theme-picker">
      <span className="pui-sr-only">화면 테마</span>
      <select value={theme} onChange={(e) => setTheme(valid(e.target.value))}>
        <option value="system">시스템 설정</option>
        <option value="light">라이트 모드</option>
        <option value="dark">다크 모드</option>
      </select>
    </label>
  );
}

export function useThemeScope() {
  return useContext(Context);
}
