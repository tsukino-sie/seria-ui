import { memo } from 'react';
import { studioThemes } from './palette';
import {
  ThemeProvider,
  PlaybackControls,
  Presentation,
  BrowserFrame,
  CodeExample,
  usePlayback,
  useSceneTransition,
  type ThemeTokens,
} from 'seria-ui';
import EditorialPage from './EditorialPage';
import usePreviewLayout from './usePreviewLayout';

const scenes = [
  {
    label: '단순하게',
    title: '단순하게.',
    detail: '누구나 쉽게,\n깔끔한 페이지를.',
    setting: 'Stack',
    value: 'gap={6}',
    explanation: '요소 사이의 간격을 일정하게 맞춰요.',
    accent: '#68783e',
    focus: 'all',
  },
  {
    label: '유연하게',
    title: '유연하게.',
    detail: '내용과 화면에 맞춰\n유연하게 바뀌는 페이지.',
    setting: 'Columns',
    value: 'min="12rem"',
    explanation: '공간에 맞춰 열 수와 배치를 조절해요.',
    accent: '#68783e',
    focus: 'layout',
  },
  {
    label: '선명하게',
    title: '선명하게.',
    detail: '빛과 색은 은은하고 자연스럽게.\n중요한 부분은 또렷하게.',
    setting: 'Hero',
    value: 'tone="ambient"',
    explanation: '표면에 은은한 빛과 색을 더해요.',
    accent: '#68783e',
    focus: 'surface',
  },
  {
    label: '나답게',
    title: '나답게.',
    detail: '글씨도 내용도,\n나다운 모습 그대로.',
    setting: 'ThemeProvider',
    value: 'accent="#99b44a"',
    explanation: '강조색을 바꾸고, 글꼴과 내용은 그대로 둬요.',
    accent: '#99b44a',
    focus: 'brand',
  },
  {
    label: '자연스럽게',
    title: '자연스럽게.',
    detail: '어떤 화면에서도,\n자유롭고 자연스럽게 이어지도록.',
    setting: 'Columns',
    value: 'min="12rem"',
    explanation: '좁은 화면에서는 한 열로 자연스럽게 이어져요.',
    accent: '#99b44a',
    focus: 'responsive',
  },
] as const;
const duration = 6200;

const DemoPage = memo(function DemoPage({ scene, dark }: { scene: number; dark: boolean }) {
  const preview = usePreviewLayout(scene);
  const slide = scenes[scene];
  const tokens = {
    '--pui-radius': scene >= 3 ? '18px' : '8px',
    '--pui-radius-control': scene >= 3 ? '12px' : '8px',
  } as ThemeTokens;
  return (
    <div ref={preview} className="keynote-demo" data-scene={scene} data-focus={slide.focus}>
      <BrowserFrame
        className="keynote-browser-window"
        label="seria / spaces — page preview"
        viewportLabel="스크롤하며 읽는 소개 페이지"
        toolbar={<span aria-hidden="true">↗</span>}
        classNames={{
          bar: 'keynote-browser-bar',
          dots: 'keynote-browser-dots',
          viewport: 'keynote-page',
        }}
      >
        <ThemeProvider
          key={String(dark)}
          defaultTheme={dark ? 'dark' : 'light'}
          storageKey={`seria-keynote-v18-${dark}`}
          surface="inherit"
          accent={slide.accent}
          themes={studioThemes}
          style={tokens}
        >
          <div className="example-backdrop" data-backdrop="light">
            <EditorialPage
              layout={scene === 1 ? 'cover' : 'split'}
              finish={scene >= 2 ? 'ambient' : 'plain'}
              material="glass"
              spacious={false}
            />
          </div>
        </ThemeProvider>
      </BrowserFrame>
      <span className="keynote-preview-hint">안에서 스크롤해보세요 ↓</span>
    </div>
  );
});

const chapters = scenes.map((item) => ({ id: item.focus, label: item.label }));
export default function KeynoteHero({ dark = false }: { dark?: boolean }) {
  const playback = usePlayback({
    items: chapters,
    duration,
    autoPlay: true,
    respectReducedMotion: false,
  });
  const { presentedIndex, leaving, direction } = useSceneTransition(playback.index);
  const scene = playback.index;
  const slide = scenes[scene];
  const presentedSlide = scenes[presentedIndex];
  return (
    <Presentation
      ref={playback.regionRef}
      className="keynote showcase-section"
      id="introduction"
      aria-labelledby="keynote-title"
      data-scene={scene}
      data-target-scene={scene}
      data-playing={playback.running}
      data-completed={playback.completed}
      classNames={{
        body: 'keynote-presentation',
        footer: 'keynote-footer',
        controls: 'keynote-controls',
        actions: 'keynote-bottom',
      }}
      heading={
        <div className="keynote-heading">
          <p>Seria UI</p>
          <h1 id="keynote-title">단순하게, 깔끔하게.</h1>
          <span>누구나 쉽게, 나다운 페이지를.</span>
        </div>
      }
      controls={
        <ThemeProvider
          key={String(dark)}
          defaultTheme={dark ? 'dark' : 'light'}
          storageKey={'seria-keynote-controls-v18-' + dark}
          surface="inherit"
          accent={slide.accent}
          themes={studioThemes}
        >
          <PlaybackControls
            items={chapters}
            activeId={playback.activeId}
            progress={playback.progress}
            playing={playback.playing}
            completed={playback.completed}
            onReplay={playback.replay}
            respectReducedMotion={false}
            onPlayingChange={playback.setPlaying}
            onActiveChange={playback.select}
            onInteractionChange={playback.setInteracting}
            aria-label="자동 소개 재생과 장면 이동"
          />
        </ThemeProvider>
      }
      actions={
        <>
          <a href="#playground">
            직접 조합해 보기 <span aria-hidden="true">↗</span>
          </a>
          <a href="#start">
            Seria 시작하기 <span aria-hidden="true">↓</span>
          </a>
        </>
      }
    >
      <div
        className="keynote-stage"
        data-transition={leaving ? 'leaving' : 'visible'}
        data-direction={direction}
        role="group"
        aria-label="자동으로 변화하는 Seria 페이지 소개"
      >
        <div className="keynote-stage-glow" aria-hidden="true" />
        <DemoPage scene={scene} dark={dark} />
        <div
          key={presentedIndex}
          className={'keynote-callout keynote-callout-' + presentedSlide.focus}
        >
          <span className="keynote-callout-index">0{presentedIndex + 1} / 05</span>
          <h2>{presentedSlide.title}</h2>
          <span className="keynote-callout-line" aria-hidden="true" />
          <p>{presentedSlide.detail}</p>
          <CodeExample
            inline
            description={presentedSlide.explanation}
            classNames={{ description: 'keynote-setting-note' }}
          >
            &lt;{presentedSlide.setting} <strong>{presentedSlide.value}</strong> /&gt;
          </CodeExample>
        </div>
      </div>
    </Presentation>
  );
}
