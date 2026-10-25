/* Seria UI · Copyright (c) 2026 Sie · See LICENSE. */
import {
  useEffect,
  useId,
  useState,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type CSSProperties,
} from 'react';
import {
  Dialog as HeadlessDialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Description,
  CloseButton,
} from '@headlessui/react';
import { useThemeScope } from './theme.js';
export { ThemeProvider, ThemePicker, useTheme } from './theme.js';
export { createAccentTokens } from './brand.js';
export { SERIA_VERSION } from './version.js';
export type { Theme, ThemeTokens } from './theme.js';
export { Hero, BlockGrid, FeatureBlock, MetricStrip, SiteShell } from './blocks.js';
export type { HeroProps } from './blocks.js';
export { Dropdown } from './dropdown.js';
export { PlaybackControls } from './playback.js';
export type {
  PlaybackItem,
  PlaybackControlsProps,
  PlaybackControlsLabels,
  PlaybackControlsStyle,
} from './playback.js';
export { Container, Stack, Cluster, Columns, PageSection, MediaFrame } from './layout.js';
export type { PageSectionProps, MediaFrameProps, Space } from './layout.js';
export type { DropdownItem } from './dropdown.js';
export { Presentation, BrowserFrame, CodeExample } from './presentation.js';
export type { PresentationProps, BrowserFrameProps, CodeExampleProps } from './presentation.js';
export { PreviewCanvas } from './preview.js';
export type { PreviewMetrics, PreviewCanvasProps } from './preview.js';
export { usePlayback } from './usePlayback.js';
export type { UsePlaybackOptions } from './usePlayback.js';
export { useSceneTransition } from './useSceneTransition.js';
export type { SceneTransitionOptions } from './useSceneTransition.js';
export { useLayoutTransition } from './useLayoutTransition.js';
export type { LayoutTransitionOptions } from './useLayoutTransition.js';
export { useSectionScroll } from './useSectionScroll.js';
export type { SectionScrollOptions } from './useSectionScroll.js';
export { Surface as Card, Modal as Dialog };
export type Glass = 'soft' | 'clear' | false;
const classes = (...values: (string | undefined | false)[]) => values.filter(Boolean).join(' ');
type SurfaceProps = HTMLAttributes<HTMLElement> & {
  as?: 'section' | 'article' | 'div';
  glass?: Glass;
  tone?: 'default' | 'subtle' | 'accent';
  elevation?: 'flat' | 'raised';
};
export function Surface({
  as: Tag = 'section',
  glass = false,
  tone = 'default',
  elevation = 'flat',
  className,
  ...props
}: SurfaceProps) {
  return (
    <Tag
      {...props}
      data-tone={tone}
      data-elevation={elevation}
      data-glass={glass || undefined}
      className={classes('pui-surface', className)}
    />
  );
}
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="pui-page-header">
      <div>
        {eyebrow && <p className="pui-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="pui-muted">{description}</p>}
      </div>
      {actions && <div className="pui-actions">{actions}</div>}
    </header>
  );
}
export function Section({
  title,
  description,
  actions,
  children,
  glass = false,
  className,
  ...props
}: SurfaceProps & { title: string; description?: string; actions?: ReactNode }) {
  return (
    <Surface {...props} glass={glass} className={className}>
      <div className="pui-section-heading">
        <div>
          <h2>{title}</h2>
          {description && <p className="pui-muted">{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </Surface>
  );
}
export function Grid({
  children,
  columns = 2,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { columns?: 1 | 2 | 3 | 4 }) {
  return (
    <div
      {...props}
      className={classes('pui-grid', className)}
      data-columns={columns}
      style={{ ...props.style, '--pui-columns': columns } as CSSProperties}
    >
      {children}
    </div>
  );
}
export function Stat({
  label,
  value,
  detail,
  glass = false,
}: {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  glass?: Glass;
}) {
  return (
    <Surface className="pui-stat" glass={glass}>
      <span className="pui-muted">{label}</span>
      <strong>{value}</strong>
      {detail && <small className="pui-muted">{detail}</small>}
    </Surface>
  );
}
export function Badge({
  tone = 'neutral',
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger';
}) {
  return <span {...props} className={classes('pui-badge', className)} data-tone={tone} />;
}
export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'quiet' | 'danger';
    size?: 'sm' | 'md' | 'lg';
  }
>(function Button(
  { variant = 'secondary', size = 'md', className, type = 'button', ...props },
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      data-variant={variant}
      data-size={size}
      className={classes('pui-button', className)}
    />
  );
});
export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: (props: {
    id: string;
    'aria-describedby'?: string;
    'aria-invalid'?: true;
  }) => ReactNode;
}) {
  const id = useId(),
    note = error || hint;
  return (
    <div className="pui-field">
      <label htmlFor={id}>{label}</label>
      {children({
        id,
        'aria-describedby': note ? `${id}-note` : undefined,
        'aria-invalid': error ? true : undefined,
      })}
      {note && (
        <p
          id={`${id}-note`}
          className={error ? 'pui-error' : 'pui-muted'}
          role={error ? 'alert' : undefined}
        >
          {note}
        </p>
      )}
    </div>
  );
}
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input {...props} ref={ref} className={classes('pui-input', className)} />;
  },
);
export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, ...props }, ref) {
    return <select {...props} ref={ref} className={classes('pui-input pui-select', className)} />;
  },
);
export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="pui-setting">
      <div>
        <span id={id}>{label}</span>
        {description && (
          <p id={`${id}-note`} className="pui-muted">
            {description}
          </p>
        )}
      </div>
      <button
        className="pui-switch"
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={id}
        aria-describedby={description ? `${id}-note` : undefined}
        disabled={disabled}
        onClick={() => onChange(!checked)}
      >
        <span />
      </button>
    </div>
  );
}
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="pui-empty">
      <h3>{title}</h3>
      {description && <p className="pui-muted">{description}</p>}
      {action}
    </div>
  );
}
export function Table({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="pui-table-scroll" role="region" aria-label={label} tabIndex={0}>
      <table className="pui-table">
        <caption className="pui-sr-only">{label}</caption>
        {children}
      </table>
    </div>
  );
}
export function Segmented({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div role="group" aria-label={label} className="pui-segmented">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  actions,
  glass = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  actions?: ReactNode;
  glass?: Glass;
}) {
  const scope = useThemeScope();
  return (
    <HeadlessDialog
      open={open}
      onClose={onClose}
      className="pui-modal"
      data-pui-theme={scope?.resolved}
      style={scope?.style}
    >
      <DialogBackdrop className="pui-backdrop" />
      <div className="pui-modal-viewport">
        <DialogPanel className="pui-modal-panel" data-glass={glass || undefined}>
          <DialogTitle className="pui-modal-title">{title}</DialogTitle>
          {description && <Description className="pui-muted">{description}</Description>}
          {children}
          {actions && <div className="pui-modal-actions">{actions}</div>}
        </DialogPanel>
      </div>
    </HeadlessDialog>
  );
}
function MenuIcon({ close = false }: { close?: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d={close ? 'M6 6l12 12M18 6L6 18' : 'M4 8h16M4 16h16'} />
    </svg>
  );
}
export function PanelShell({
  sidebar,
  navbar,
  children,
  className,
  mainId,
  headerGlass = false,
  menuLabel = '패널 메뉴',
}: {
  sidebar: ReactNode;
  navbar: ReactNode;
  children: ReactNode;
  className?: string;
  mainId?: string;
  headerGlass?: Glass;
  menuLabel?: string;
}) {
  const scope = useThemeScope(),
    [open, setOpen] = useState(false),
    id = useId(),
    generated = useId(),
    target = mainId || `panel-${generated}`;
  useEffect(() => {
    const media = window.matchMedia('(min-width:1024px)'),
      close = () => {
        if (media.matches) setOpen(false);
      };
    media.addEventListener('change', close);
    return () => media.removeEventListener('change', close);
  }, []);
  return (
    <div className={classes('pui-shell', className)}>
      <a
        className="pui-skip"
        href={`#${target}`}
        onClick={(e) => {
          e.preventDefault();
          document.getElementById(target)?.focus();
        }}
      >
        본문으로 건너뛰기
      </a>
      <aside className="pui-sidebar">{sidebar}</aside>
      <HeadlessDialog
        open={open}
        onClose={setOpen}
        className="pui-drawer-layer"
        data-pui-theme={scope?.resolved}
        style={scope?.style}
      >
        <DialogBackdrop className="pui-backdrop" />
        <DialogPanel id={id} className="pui-drawer">
          <DialogTitle className="pui-sr-only">{menuLabel}</DialogTitle>
          <CloseButton className="pui-menu-close pui-button" aria-label="메뉴 닫기">
            <MenuIcon close />
          </CloseButton>
          {sidebar}
        </DialogPanel>
      </HeadlessDialog>
      <div className="pui-workspace">
        <header className="pui-mobile-header" data-glass={headerGlass || undefined}>
          <button
            type="button"
            className="pui-button"
            aria-label="메뉴 열기"
            aria-expanded={open}
            aria-controls={open ? id : undefined}
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </button>
          <div>{navbar}</div>
        </header>
        <main tabIndex={-1} id={target} className="pui-main">
          <div className="pui-content">{children}</div>
        </main>
      </div>
    </div>
  );
}
export function NavItem({
  current = false,
  icon,
  children,
  onClick,
}: {
  current?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <CloseButton
      type="button"
      className="pui-nav-item"
      aria-current={current ? 'page' : undefined}
      onClick={onClick}
    >
      {icon && (
        <span className="pui-nav-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{children}</span>
      {current && <span className="pui-nav-dot" aria-hidden="true" />}
    </CloseButton>
  );
}
