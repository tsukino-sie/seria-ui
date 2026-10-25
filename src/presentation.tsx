/* Seria UI · Copyright (c) 2026 Sie · See LICENSE. */
import { forwardRef, useId, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';

const cx = (base: string, extra?: string) => `${base}${extra ? ` ${extra}` : ''}`;
export type PresentationProps = HTMLAttributes<HTMLElement> & {
  heading?: ReactNode;
  controls?: ReactNode;
  actions?: ReactNode;
  headerOffset?: string;
  classNames?: Partial<Record<'body' | 'footer' | 'controls' | 'actions', string>>;
};

/** One viewport when it fits; grows for reading, with controls at the section bottom. */
export const Presentation = forwardRef<HTMLElement, PresentationProps>(function Presentation(
  {
    heading,
    controls,
    actions,
    children,
    className,
    classNames = {},
    headerOffset = '0px',
    style,
    ...props
  },
  ref,
) {
  return (
    <section
      {...props}
      ref={ref}
      className={cx('pui-presentation', className)}
      style={{ '--pui-presentation-offset': headerOffset, ...style } as CSSProperties}
    >
      <div className={cx('pui-presentation-body', classNames.body)}>
        {heading}
        {children}
      </div>
      {(controls || actions) && (
        <footer className={cx('pui-presentation-footer', classNames.footer)}>
          {controls && (
            <div className={cx('pui-presentation-controls', classNames.controls)}>{controls}</div>
          )}
          {actions && (
            <div className={cx('pui-presentation-actions', classNames.actions)}>{actions}</div>
          )}
        </footer>
      )}
    </section>
  );
});

export type BrowserFrameProps = HTMLAttributes<HTMLDivElement> & {
  label?: ReactNode;
  toolbar?: ReactNode;
  viewportLabel: string;
  height?: string;
  classNames?: Partial<Record<'bar' | 'dots' | 'viewport', string>>;
};
/** A single framed, scrollable preview. Does not shrink its contents or load a font. */
export function BrowserFrame({
  label,
  toolbar,
  viewportLabel,
  height = '28rem',
  children,
  className,
  classNames = {},
  style,
  ...props
}: BrowserFrameProps) {
  return (
    <div
      {...props}
      className={cx('pui-browser-frame', className)}
      style={{ '--pui-frame-height': height, ...style } as CSSProperties}
    >
      <div className={cx('pui-browser-bar', classNames.bar)}>
        <span className={cx('pui-browser-dots', classNames.dots)} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>{label}</span>
        <span>{toolbar}</span>
      </div>
      <div
        className={cx('pui-browser-viewport', classNames.viewport)}
        role="region"
        aria-label={viewportLabel}
        tabIndex={0}
      >
        {children}
      </div>
    </div>
  );
}

export type CodeExampleProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  children: ReactNode;
  description?: ReactNode;
  inline?: boolean;
  classNames?: { description?: string };
};
/** Display caller-owned code with a connected plain-language explanation. */
export function CodeExample({
  children,
  description,
  inline = false,
  classNames = {},
  className,
  ...props
}: CodeExampleProps) {
  const id = useId();
  return (
    <div {...props} className={cx('pui-code-example', className)} data-inline={inline || undefined}>
      {inline ? (
        <code aria-describedby={description ? id : undefined}>{children}</code>
      ) : (
        <pre tabIndex={0}>
          <code aria-describedby={description ? id : undefined}>{children}</code>
        </pre>
      )}
      {description && (
        <p id={id} className={cx('pui-code-description', classNames.description)}>
          {description}
        </p>
      )}
    </div>
  );
}
