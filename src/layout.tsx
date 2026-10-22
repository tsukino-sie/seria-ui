/* Seria UI · Copyright (c) 2026 Sie · See LICENSE. */
import { useId, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';

export type Space = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type Props = HTMLAttributes<HTMLDivElement>;
const gapStyle = (gap: Space) => (gap === 0 ? '0px' : `var(--pui-space-${gap})`);
const classes = (base: string, custom?: string) => `${base}${custom ? ` ${custom}` : ''}`;

export function Container({
  width = 'wide',
  className,
  ...props
}: Props & { width?: 'reading' | 'content' | 'wide' | 'full' }) {
  return <div {...props} data-width={width} className={classes('pui-container', className)} />;
}

export function Stack({
  gap = 6,
  align = 'stretch',
  className,
  style,
  ...props
}: Props & { gap?: Space; align?: 'start' | 'center' | 'end' | 'stretch' }) {
  return (
    <div
      {...props}
      className={classes('pui-stack', className)}
      data-align={align}
      style={{ '--pui-layout-gap': gapStyle(gap), ...style } as CSSProperties}
    />
  );
}

export function Cluster({
  gap = 3,
  justify = 'start',
  align = 'center',
  className,
  style,
  ...props
}: Props & {
  gap?: Space;
  justify?: 'start' | 'center' | 'end' | 'between';
  align?: 'start' | 'center' | 'end' | 'stretch';
}) {
  return (
    <div
      {...props}
      className={classes('pui-cluster', className)}
      data-justify={justify}
      data-align={align}
      style={{ '--pui-layout-gap': gapStyle(gap), ...style } as CSSProperties}
    />
  );
}

/** Reflows according to the space available, including inside a narrow container. */
export function Columns({
  min = '16rem',
  gap = 6,
  className,
  style,
  ...props
}: Props & { min?: string; gap?: Space }) {
  return (
    <div
      {...props}
      className={classes('pui-columns', className)}
      style={
        { '--pui-column-min': min, '--pui-layout-gap': gapStyle(gap), ...style } as CSSProperties
      }
    />
  );
}

export type PageSectionProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  title?: ReactNode;
  eyebrow?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  headingLevel?: 2 | 3;
  width?: 'reading' | 'content' | 'wide' | 'full';
  spacing?: 'compact' | 'comfortable' | 'spacious';
};

/** A transparent page section; the project's background and typeface stay intact. */
export function PageSection({
  title,
  eyebrow,
  description,
  actions,
  children,
  headingLevel = 2,
  width = 'wide',
  spacing = 'comfortable',
  className,
  ...props
}: PageSectionProps) {
  const generatedId = useId();
  const titleId = `${generatedId}-title`;
  const Heading = headingLevel === 3 ? 'h3' : 'h2';
  return (
    <section
      aria-labelledby={title ? titleId : undefined}
      {...props}
      data-spacing={spacing}
      className={classes('pui-page-section', className)}
    >
      <Container width={width}>
        {(title || eyebrow || description || actions) && (
          <header className="pui-page-section-heading">
            <div>
              {eyebrow && <p className="pui-eyebrow">{eyebrow}</p>}
              {title && <Heading id={titleId}>{title}</Heading>}
              {description && <p className="pui-muted">{description}</p>}
            </div>
            {actions && <div className="pui-actions">{actions}</div>}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}

export type MediaFrameProps = HTMLAttributes<HTMLElement> & {
  ratio?: string;
  fit?: 'cover' | 'contain';
  caption?: ReactNode;
};

/** Accepts an image, video or illustration without requiring an asset provider. */
export function MediaFrame({
  ratio = '4 / 3',
  fit = 'cover',
  caption,
  children,
  className,
  style,
  ...props
}: MediaFrameProps) {
  return (
    <figure
      {...props}
      className={classes('pui-media', className)}
      style={{ '--pui-media-ratio': ratio, '--pui-media-fit': fit, ...style } as CSSProperties}
    >
      <div className="pui-media-content">{children}</div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
