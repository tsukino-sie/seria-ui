import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { studioThemes } from './palette';
import { ThemeProvider, PlaybackControls, type ThemeTokens } from '../src/index';
import EditorialPage from './EditorialPage';

const scenes = [
  {
    label: '단순하게',
    title: '단순하게.',
    detail: '누구나 쉽게,\n깔끔한 페이지를.',
    setting: 'Stack',
    value: 'gap={6}',
    accent: '#68783e',
    focus: 'all',
  },
  {
    label: '유연하게',
    title: '유연하게.',
    detail: '내용과 화면에 맞춰\n유연하게 바뀌는 페이지.',
    setting: 'Columns',
    value: 'min="12rem"',
    accent: '#68783e',
    focus: 'layout',
  },
  {
    label: '선명하게',
    title: '선명하게.',
    detail: '빛과 색은 은은하고 자연스럽게.\n중요한 부분은 또렷하게.',
    setting: 'Hero',
    value: 'tone="ambient"',
    accent: '#68783e',
    focus: 'surface',
  },
  {
    label: '나답게',
    title: '나답게.',
    detail: '글씨도 내용도,\n나다운 모습 그대로.',
    setting: 'ThemeProvider',
    value: 'accent="#99b44a"',
    accent: '#99b44a',
    focus: 'brand',
  },
  {
    label: '자연스럽게',
    title: '자연스럽게.',
    detail: '어떤 화면에서도,\n자유롭고 자연스럽게 이어지도록.',
    setting: 'Columns',
    value: 'min="12rem"',
    accent: '#99b44a',
    focus: 'responsive',
  },
] as const;
const duration = 6200;

const DemoPage = memo(function DemoPage({ scene }: { scene: number }) {
  const slide = scenes[scene];
  const tokens = {
    '--pui-radius': scene >= 3 ? '18px' : '8px',
    '--pui-radius-control': scene >= 3 ? '12px' : '8px',
  } as ThemeTokens;
  return (
    <div className="keynote-demo" data-scene={scene} data-focus={slide.focus}>
      <div className="keynote-browser-bar">
        <span className="keynote-browser-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>seria / spaces — page preview</span>
        <span aria-hidden="true">↗</span>
      </div>
      <ThemeProvider
        defaultTheme="light"
        storageKey="seria-keynote-light"
        surface="inherit"
        accent={slide.accent}
        themes={studioThemes}
        style={tokens}
      >
        <div className="keynote-page">
          <EditorialPage
            layout={scene === 1 ? 'cover' : 'split'}
            finish={scene >= 2 ? 'ambient' : 'plain'}
          />
        </div>
      </ThemeProvider>
    </div>
  );
});

export default function KeynoteHero() {
  const [scene, setScene] = useState(0);
  const [presentedScene, setPresentedScene] = useState(0);
  const [fading, setFading] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [requested, setRequested] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inView, setInView] = useState(true);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exploring, setExploring] = useState(false);
  const elapsed = useRef(0);
  const region = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motion = () => {
      setReducedMotion(media.matches);
    };
    const visibility = () => setVisible(!document.hidden);
    motion();
    visibility();
    setReady(true);
    media.addEventListener('change', motion);
    document.addEventListener('visibilitychange', visibility);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.2,
    });
    if (region.current) observer.observe(region.current);
    return () => {
      media.removeEventListener('change', motion);
      document.removeEventListener('visibilitychange', visibility);
      observer.disconnect();
    };
  }, []);
  const playing = ready && requested && !completed && inView && visible && !exploring;
  useLayoutEffect(() => {
    if (scene === presentedScene) {
      setFading(false);
      return;
    }
    setFading(true);
    // Keep the outgoing content mounted until its fade finishes. Rapid selections
    // cancel this swap so only the latest requested chapter is shown.
    const swap = window.setTimeout(
      () => {
        setPresentedScene(scene);
        setFading(false);
      },
      reducedMotion ? 280 : 360,
    );
    return () => window.clearTimeout(swap);
  }, [scene, presentedScene, reducedMotion]);
  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      elapsed.current += now - last;
      last = now;
      if (elapsed.current >= duration) {
        if (scene === scenes.length - 1) {
          elapsed.current = duration;
          setProgress(1);
          setCompleted(true);
          setRequested(false);
          return;
        }
        elapsed.current = 0;
        setDirection('forward');
        setScene(scene + 1);
      }
      setProgress(Math.min(1, elapsed.current / duration));
    }, 80);
    return () => window.clearInterval(timer);
  }, [playing, scene]);
  const choose = (index: number) => {
    if (index < 0 || index >= scenes.length) return;
    setDirection(index >= scene ? 'forward' : 'backward');
    setRequested(false);
    setCompleted(false);
    elapsed.current = 0;
    setProgress(0);
    setScene(index);
  };
  const replay = () => {
    elapsed.current = 0;
    setProgress(0);
    setCompleted(false);
    setDirection('forward');
    setScene(0);
    setRequested(true);
  };
  const slide = scenes[scene];
  const presentedSlide = scenes[presentedScene];
  return (
    <section
      ref={region}
      className="keynote"
      id="introduction"
      aria-labelledby="keynote-title"
      data-scene={scene}
      data-target-scene={scene}
      data-playing={playing}
      data-completed={completed}
    >
      <div className="keynote-heading">
        <p>Seria UI</p>
        <h1 id="keynote-title">단순하게, 깔끔하게.</h1>
        <span>누구나 쉽게, 나다운 페이지를.</span>
      </div>
      <div
        className="keynote-stage"
        data-transition={fading ? 'leaving' : 'visible'}
        data-direction={direction}
        role="group"
        aria-label="자동으로 변화하는 Seria 페이지 소개"
      >
        <div className="keynote-stage-glow" aria-hidden="true" />
        <DemoPage scene={scene} />
        <div
          key={presentedScene}
          className={`keynote-callout keynote-callout-${presentedSlide.focus}`}
        >
          <span className="keynote-callout-index">0{presentedScene + 1} / 05</span>
          <h2>{presentedSlide.title}</h2>
          <span className="keynote-callout-line" aria-hidden="true" />
          <p>{presentedSlide.detail}</p>
          <code>
            &lt;{presentedSlide.setting} <strong>{presentedSlide.value}</strong> /&gt;
          </code>
        </div>
      </div>
      <div className="keynote-controls">
        <ThemeProvider
          defaultTheme="dark"
          storageKey="seria-keynote-controls"
          surface="inherit"
          accent={slide.accent}
          themes={studioThemes}
        >
          <PlaybackControls
            items={scenes.map((item) => ({ id: item.focus, label: item.label }))}
            activeId={slide.focus}
            progress={progress}
            playing={requested}
            completed={completed}
            onReplay={replay}
            respectReducedMotion={false}
            onPlayingChange={setRequested}
            onActiveChange={(id) => choose(scenes.findIndex((item) => item.focus === id))}
            onInteractionChange={setExploring}
            aria-label="자동 소개 재생과 장면 이동"
          />
        </ThemeProvider>
      </div>
      <div className="keynote-bottom">
        <a href="#playground">
          직접 조합해 보기 <span aria-hidden="true">↗</span>
        </a>
        <a href="#start">
          Seria 시작하기 <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
