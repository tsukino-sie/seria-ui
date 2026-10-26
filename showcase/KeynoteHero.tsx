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
import { describeTags } from './codeGuide';

const scenes = [
  {
    label: '단순하게',
    title: '단순하게.',
    detail: '제목·설명·버튼을 한 묶음으로.\n필요한 내용을 채워 넣으세요.',
    setting: 'Hero',
    value: 'align="start"',
    explanation: 'align="start"는 내용을 왼쪽에 맞춰요.',
    accent: '#68783e',
    focus: 'all',
  },
  {
    label: '유연하게',
    title: '유연하게.',
    detail: '같은 사진과 글, 다른 배치.\n넓은 화면에서는 사진을 왼쪽으로.',
    setting: 'Spaces',
    value: 'layout="reverse"',
    explanation: 'reverse는 좌우 위치만 바꿔요. 내용과 버튼은 그대로예요.',
    accent: '#68783e',
    focus: 'layout',
  },
  {
    label: '선명하게',
    title: '선명하게.',
    detail: '소개 블록에 은은한 빛을.\n내용을 가리지 않고 깊이만 더해요.',
    setting: 'Hero',
    value: 'tone="ambient"',
    explanation: 'tone="ambient"는 소개 블록의 배경에 은은한 색을 더해요.',
    accent: '#68783e',
    focus: 'surface',
  },
  {
    label: '나답게',
    title: '나답게.',
    detail: '강조색 하나로 버튼과 표시를 함께.\n글꼴과 내용은 내 것 그대로.',
    setting: 'ThemeProvider',
    value: 'accent="#99b44a"',
    explanation: 'accent는 강조색이에요. 지금은 연두색(#99b44a)을 써요.',
    accent: '#99b44a',
    focus: 'brand',
  },
  {
    label: '자연스럽게',
    title: '자연스럽게.',
    detail: '화면이 좁아지면 한 열로.\n글씨를 줄이지 않고 아래로 이어져요.',
    setting: 'Columns',
    value: 'min="12rem"',
    explanation: 'min="12rem"은 열 하나의 최소 너비예요. 더 좁으면 한 열로 배치해요.',
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
              layout={scene >= 1 ? 'reverse' : 'split'}
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
          <span>버튼부터 레이아웃까지, 직접 조합하는 React UI.</span>
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
            annotations={describeTags(`<${presentedSlide.setting} />`)}
            classNames={{ description: 'keynote-setting-note' }}
          >
            &lt;{presentedSlide.setting} <strong>{presentedSlide.value}</strong> /&gt;
          </CodeExample>
        </div>
      </div>
    </Presentation>
  );
}
