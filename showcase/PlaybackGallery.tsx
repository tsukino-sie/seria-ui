import { useState } from 'react';
import { PlaybackControls, ThemeProvider, usePlayback, type PlaybackControlsStyle } from 'seria-ui';
import { studioAccents, studioThemes } from './palette';

const items = [
  { id: 'start', label: '하나의 시작' },
  { id: 'layout', label: '유연한 레이아웃' },
  { id: 'surface', label: '표면과 깊이' },
  { id: 'identity', label: '나의 스타일' },
];
const swatches = studioAccents;

function PlaybackExample({
  theme,
  accent,
  custom = false,
}: {
  theme: 'light' | 'dark';
  accent: string;
  custom?: boolean;
}) {
  const playback = usePlayback<HTMLDivElement>({ items, duration: 4000, initialProgress: 0.58 });
  const { activeId, progress, playing, completed } = playback;
  const title = custom ? '개별 색상 지정' : theme === 'light' ? '라이트 테마' : '다크 테마';
  const customStyle: PlaybackControlsStyle | undefined = custom
    ? { '--pui-playback-fill': '#627c2d', '--pui-playback-track': '#e0e9c9' }
    : undefined;
  return (
    <ThemeProvider
      defaultTheme={theme}
      storageKey={`seria-playback-example-${custom ? 'custom' : theme}`}
      surface="inherit"
      accent={accent}
      themes={studioThemes}
    >
      <div
        className="playback-example"
        data-example={custom ? 'custom' : theme}
        ref={playback.regionRef}
      >
        <span className="playback-example-tag">{title}</span>
        <div className="playback-example-stage">
          <div className="playback-scene-label" key={activeId}>
            <span aria-hidden="true">0{items.findIndex((item) => item.id === activeId) + 1}</span>
            <h3>{items.find((item) => item.id === activeId)?.label}</h3>
          </div>
          <PlaybackControls
            items={items}
            activeId={activeId}
            playing={playing}
            completed={completed}
            onReplay={playback.replay}
            progress={progress}
            onPlayingChange={playback.setPlaying}
            onActiveChange={playback.select}
            onInteractionChange={playback.setInteracting}
            style={customStyle}
            aria-label={`${title} 재생 예시`}
          />
        </div>
        <code>{custom ? '--pui-playback-fill' : `theme="${theme}" · accent`}</code>
      </div>
    </ThemeProvider>
  );
}

export default function PlaybackGallery() {
  const [accent, setAccent] = useState<string>(swatches[0].value);
  return (
    <section
      className="playback-section section-wrap showcase-section"
      id="playback"
      aria-labelledby="playback-title"
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">PLAYBACK / MADE TO REUSE</span>
          <h2 id="playback-title">작은 컨트롤도, 당신의 색으로.</h2>
          <p>테마를 따라 자연스럽게. 필요할 때는 진행 바만 다른 색으로.</p>
        </div>
        <div className="playback-swatches" role="group" aria-label="재생 예시 강조색">
          {swatches.map((swatch) => (
            <button
              type="button"
              key={swatch.value}
              aria-label={`${swatch.label} 진행 색상`}
              aria-pressed={accent === swatch.value}
              style={{ background: swatch.value, color: swatch.ink }}
              onClick={() => setAccent(swatch.value)}
            >
              {accent === swatch.value ? '✓' : ''}
            </button>
          ))}
        </div>
      </div>
      <div className="playback-examples">
        <PlaybackExample theme="light" accent={accent} />
        <PlaybackExample theme="dark" accent={accent} />
        <PlaybackExample theme="light" accent={accent} custom />
      </div>
      <div className="playback-usage">
        <p>
          점 위에 머물면 제목이 보여요. 누르면 해당 구간으로 이동해요.
          <br />
          터치는 한 번으로 제목 확인, 한 번 더 누르면 이동.
        </p>
        <pre tabIndex={0} aria-label="PlaybackControls 사용 예시">
          <code>{`<ThemeProvider accent="${accent}" surface="inherit">
  <PlaybackControls
    items={chapters} activeId={activeId}
    playing={playing} progress={progress}
    completed={completed} onReplay={restartChapters}
    onActiveChange={selectChapter}
    onPlayingChange={setPlaying}
    onInteractionChange={setExploring}
  />
</ThemeProvider>`}</code>
        </pre>
      </div>
    </section>
  );
}
