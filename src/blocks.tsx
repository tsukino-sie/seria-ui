/* Seria UI · Copyright (c) 2026 Sie · See LICENSE. */
import {
  useId,
  useState,
  useEffect,
  type ReactNode,
  type HTMLAttributes,
  type CSSProperties,
} from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, CloseButton } from '@headlessui/react';
import { useThemeScope } from './theme.js';

type Glass = 'soft' | 'clear' | false;
export type HeroProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  visual?: ReactNode;
  headingLevel?: 1 | 2 | 3;
  align?: 'start' | 'center';
  tone?: 'plain' | 'ambient' | 'transparent';
  /** Split reflows using the available space, including inside a narrow panel. */
  layout?: 'stack' | 'split';
  glass?: Glass;
};
export function Hero({
  eyebrow,
  title,
  description,
  actions,
  visual,
  children,
  headingLevel = 1,
  align = 'center',
  tone = 'plain',
  layout = 'stack',
  glass = false,
  className = '',
  ...props
}: HeroProps) {
  const Heading = headingLevel === 1 ? 'h1' : headingLevel === 2 ? 'h2' : 'h3';
  return (
    <section
      {...props}
      data-align={align}
      data-tone={tone}
      data-layout={visual ? layout : 'stack'}
      data-glass={glass || undefined}
      className={`pui-hero ${className}`}
    >
      <div className="pui-hero-body">
        <div className="pui-hero-copy">
          {eyebrow && <p className="pui-eyebrow">{eyebrow}</p>}
          <Heading>{title}</Heading>
          {description && <p className="pui-hero-description">{description}</p>}
          {actions && <div className="pui-actions">{actions}</div>}
        </div>
        {children && <div className="pui-hero-content">{children}</div>}
      </div>
      {visual && <div className="pui-hero-visual">{visual}</div>}
    </section>
  );
}
export function BlockGrid({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={`pui-block-grid ${className}`} />;
}
export function FeatureBlock({
  eyebrow,
  title,
  description,
  actions,
  children,
  span = 'normal',
  tone = 'neutral',
  glass = false,
  headingLevel = 2,
  className = '',
  ...props
}: Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  span?: 'normal' | 'wide';
  tone?: 'neutral' | 'accent' | 'inset';
  glass?: Glass;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 3 ? 'h3' : 'h2';
  return (
    <article
      {...props}
      className={`pui-feature-block ${className}`}
      data-span={span}
      data-tone={tone}
      data-glass={glass || undefined}
    >
      <div className="pui-feature-heading">
        {eyebrow && <p className="pui-eyebrow">{eyebrow}</p>}
        <Heading>{title}</Heading>
        {description && <p className="pui-muted">{description}</p>}
      </div>
      {children && <div className="pui-feature-content">{children}</div>}
      {actions && <div className="pui-feature-actions">{actions}</div>}
    </article>
  );
}
export function MetricStrip({
  items,
}: {
  items: readonly { label: string; value: ReactNode; detail?: string }[];
}) {
  return (
    <dl
      className="pui-metric-strip"
      data-count={items.length}
      style={{ '--pui-metric-columns': Math.min(Math.max(items.length, 1), 4) } as CSSProperties}
    >
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
          {item.detail && <small>{item.detail}</small>}
        </div>
      ))}
    </dl>
  );
}
export function SiteShell({
  brand,
  navigation,
  actions,
  children,
  glass = false,
  mainId,
}: {
  brand: ReactNode;
  navigation: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  glass?: Glass;
  mainId?: string;
}) {
  const [open, setOpen] = useState(false),
    id = useId(),
    generated = useId(),
    target = mainId || `site-${generated}`,
    scope = useThemeScope();
  useEffect(() => {
    const media = window.matchMedia('(min-width:900px)'),
      close = () => {
        if (media.matches) setOpen(false);
      };
    media.addEventListener('change', close);
    return () => media.removeEventListener('change', close);
  }, []);
  return (
    <div className="pui-site">
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
      <header className="pui-site-header" data-glass={glass || undefined}>
        <div className="pui-site-nav">
          <div className="pui-site-brand">{brand}</div>
          <nav className="pui-site-links" aria-label="주 메뉴">
            {navigation}
          </nav>
          <div className="pui-site-actions">{actions}</div>
          <button
            type="button"
            className="pui-button pui-site-menu"
            aria-label="메뉴 열기"
            aria-expanded={open}
            aria-controls={open ? id : undefined}
            onClick={() => setOpen(true)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M4 8h16M4 16h16" />
            </svg>
          </button>
        </div>
      </header>
      <Dialog
        open={open}
        onClose={setOpen}
        className="pui-drawer-layer"
        data-pui-theme={scope?.resolved}
        style={scope?.style}
      >
        <DialogBackdrop className="pui-backdrop" />
        <DialogPanel id={id} className="pui-drawer">
          <DialogTitle className="pui-sr-only">패널 메뉴</DialogTitle>
          <CloseButton type="button" className="pui-menu-close pui-button">
            메뉴 닫기
          </CloseButton>
          <nav aria-label="모바일 주 메뉴">{navigation}</nav>
        </DialogPanel>
      </Dialog>
      <main id={target} tabIndex={-1} className="pui-site-main">
        <div className="pui-content">{children}</div>
      </main>
    </div>
  );
}
