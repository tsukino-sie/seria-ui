/* Seria UI · Copyright (c) 2026 Sie · See LICENSE. */
import { useEffect, useId, useRef, useState, type CSSProperties, type HTMLAttributes } from 'react';

export type PlaybackItem = {
  /** Unique, stable identifier; independent of the display label. */
  id: string;
  label: string;
  disabled?: boolean;
};

export type PlaybackControlsLabels = {
  group: string;
  play: string;
  pause: string;
  replay?: string;
  reducedMotion: string;
  touchHint: string;
  goTo: (label: string) => string;
};

export type PlaybackControlsStyle = CSSProperties & {
  [key: `--pui-playback-${string}`]: string | number | undefined;
};

export type PlaybackControlsProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'style'> & {
  items: readonly PlaybackItem[];
  activeId: string;
  onActiveChange: (id: string) => void;
  playing: boolean;
  onPlayingChange: (playing: boolean) => void;
  /** Fraction of the active item's duration, clamped to 0…1. */
  progress?: number;
  /** Pause the host's timer while the user explores chapter labels. */
  onInteractionChange?: (interacting: boolean) => void;
  disabled?: boolean;
  /** Defaults to true. Suppress automatic start; an explicit play remains available. */
  respectReducedMotion?: boolean;
  labels?: Partial<PlaybackControlsLabels>;
  style?: PlaybackControlsStyle;
} & ({ completed?: false; onReplay?: () => void } | { completed: boolean; onReplay: () => void });

const defaultLabels: PlaybackControlsLabels = {
  group: '재생과 구간 이동',
  play: '자동 재생',
  pause: '자동 재생 일시 정지',
  replay: '처음부터 다시 보기',
  reducedMotion: '모션 감소 설정으로 자동 시작하지 않아요. 직접 재생할 수 있어요.',
  touchHint: '다시 터치하면 이동 ↗',
  goTo: (label) => `${label} 구간으로 이동`,
};

/** Controlled navigation UI. The host owns timing, content changes and scrolling. */
export function PlaybackControls({
  items,
  activeId,
  onActiveChange,
  playing,
  onPlayingChange,
  progress = 0,
  completed = false,
  onReplay,
  onInteractionChange,
  disabled = false,
  respectReducedMotion = true,
  labels,
  className,
  style,
  onPointerLeave,
  onBlur,
  onKeyDown,
  'aria-label': ariaLabel,
  ...props
}: PlaybackControlsProps) {
  const instanceId = useId();
  const [peek, setPeek] = useState<string | null>(null);
  const [touchPeek, setTouchPeek] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [motionOptIn, setMotionOptIn] = useState(false);
  const inputType = useRef('mouse');
  const group = useRef<HTMLDivElement | null>(null);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const interactionCallback = useRef(onInteractionChange);
  const text = { ...defaultLabels, ...labels };
  const enabledItems = items.filter((item) => !item.disabled);
  const current = items.find((item) => item.id === activeId) ?? enabledItems[0] ?? items[0];
  const exploring = !disabled && items.some((item) => item.id === peek && !item.disabled);
  const motionBlocked = respectReducedMotion && reducedMotion && !motionOptIn;
  const isPlaying = playing && !completed && !motionBlocked;
  const replayLabel = text.replay ?? '처음부터 다시 보기';
  const fraction = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!media) return;
    const update = () => {
      setReducedMotion(media.matches);
      setMotionOptIn(false);
    };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (motionBlocked && playing) onPlayingChange(false);
  }, [motionBlocked, playing, onPlayingChange]);
  useEffect(() => {
    interactionCallback.current = onInteractionChange;
    onInteractionChange?.(exploring);
  }, [exploring, onInteractionChange]);
  useEffect(() => () => interactionCallback.current?.(false), []);
  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (!group.current?.contains(event.target as Node)) {
        setPeek(null);
        setTouchPeek(null);
      }
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, []);

  if (!items.length) return null;
  const select = (id: string) => {
    onActiveChange(id);
    setPeek(null);
    setTouchPeek(null);
  };
  return (
    <div
      {...props}
      className={['pui-playback', className].filter(Boolean).join(' ')}
      style={style}
      ref={group}
      data-exploring={exploring}
      data-reduced-motion={reducedMotion}
      data-playback-state={completed ? 'completed' : isPlaying ? 'playing' : 'paused'}
      role="group"
      aria-label={ariaLabel ?? text.group}
      aria-disabled={disabled || undefined}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        if (!event.defaultPrevented && inputType.current !== 'touch') setPeek(null);
      }}
      onBlur={(event) => {
        onBlur?.(event);
        if (!event.defaultPrevented && !event.currentTarget.contains(event.relatedTarget)) {
          setPeek(null);
          setTouchPeek(null);
        }
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (!event.defaultPrevented && event.key === 'Escape') {
          setPeek(null);
          setTouchPeek(null);
        }
      }}
    >
      {items.map((item, index) => {
        const active = item.id === current?.id;
        const shown = exploring && peek === item.id;
        const tip = `${instanceId}-chapter-${index}`;
        return (
          <div
            className="pui-playback-slot"
            key={item.id}
            data-active={active}
            data-peek={shown}
            data-edge={index === 0 ? 'start' : index === items.length - 1 ? 'end' : undefined}
          >
            <button
              type="button"
              className="pui-playback-stop"
              disabled={disabled || item.disabled}
              ref={(element) => {
                if (element) buttons.current.set(item.id, element);
                else buttons.current.delete(item.id);
              }}
              aria-current={active ? 'step' : undefined}
              aria-label={text.goTo(item.label)}
              aria-describedby={shown ? tip : undefined}
              onPointerDown={(event) => {
                inputType.current = event.pointerType;
              }}
              onPointerEnter={(event) => {
                if (event.pointerType !== 'touch' && !disabled && !item.disabled) setPeek(item.id);
              }}
              onFocus={(event) => {
                if (event.currentTarget.matches(':focus-visible')) inputType.current = 'keyboard';
                if (inputType.current !== 'touch') setPeek(item.id);
              }}
              onKeyDown={(event) => {
                if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
                event.preventDefault();
                const position = enabledItems.findIndex((entry) => entry.id === item.id);
                const targetIndex =
                  event.key === 'Home'
                    ? 0
                    : event.key === 'End'
                      ? enabledItems.length - 1
                      : (position + (event.key === 'ArrowRight' ? 1 : -1) + enabledItems.length) %
                        enabledItems.length;
                const target = enabledItems[targetIndex];
                if (!target) return;
                inputType.current = 'keyboard';
                onActiveChange(target.id);
                buttons.current.get(target.id)?.focus();
                setPeek(target.id);
                setTouchPeek(null);
              }}
              onClick={(event) => {
                if (inputType.current === 'touch' && event.detail !== 0 && touchPeek !== item.id) {
                  setTouchPeek(item.id);
                  setPeek(item.id);
                  return;
                }
                select(item.id);
              }}
            >
              {active ? (
                <span className="pui-playback-progress" aria-hidden="true">
                  <i style={{ transform: `scaleX(${completed ? 1 : fraction})` }} />
                </span>
              ) : (
                <span className="pui-playback-dot" aria-hidden="true" />
              )}
            </button>
            {shown && (
              <div className="pui-playback-tooltip" role="tooltip" id={tip}>
                <strong>{item.label}</strong>
                {touchPeek === item.id && <small>{text.touchHint}</small>}
              </div>
            )}
          </div>
        );
      })}
      <button
        type="button"
        className="pui-playback-toggle"
        disabled={disabled || !enabledItems.length || (completed && !onReplay)}
        onClick={() => {
          if (completed) {
            setMotionOptIn(true);
            onReplay?.();
            return;
          }
          setMotionOptIn(!isPlaying);
          onPlayingChange(!isPlaying);
        }}
        onPointerEnter={() => {
          setPeek(null);
          setTouchPeek(null);
        }}
        onFocus={() => {
          setPeek(null);
          setTouchPeek(null);
        }}
        aria-label={completed ? replayLabel : isPlaying ? text.pause : text.play}
        title={completed ? replayLabel : motionBlocked ? text.reducedMotion : undefined}
        aria-pressed={completed ? undefined : isPlaying}
      >
        {completed ? (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M13 6a5.2 5.2 0 1 0 .15 3.6M9.5 6H13V2.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : isPlaying ? (
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M4 3v6M8 3v6" stroke="currentColor" strokeWidth="1.7" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="m4 2 6 4-6 4Z" fill="currentColor" />
          </svg>
        )}
      </button>
    </div>
  );
}
