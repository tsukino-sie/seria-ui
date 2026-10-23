import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Button,
  Dialog,
  Field,
  Input,
  Stack,
  ThemeProvider,
  SERIA_VERSION,
  type ThemeTokens,
} from '../src/index';
import StarterPage, { type StarterPageProps } from '../examples/StarterPage';
import starterSource from '../examples/StarterPage.tsx?raw';
import spacesSource from '../examples/Spaces.tsx?raw';
import componentSource from '../examples/ComponentPage.tsx?raw';
import spacesStyles from '../examples/spaces.css?raw';
import themeSource from '../examples/theme.ts?raw';
import { studioAccents, studioThemes } from './palette';
import PreviewCanvas, { type PreviewMetrics } from './PreviewCanvas';

const defaults = {
  opacity: 58,
  blur: 22,
  saturation: 125,
  radius: 22,
  space: 100,
  font: 100,
  border: 15,
  width: 900,
};
type Material = 'glass' | 'solid' | 'open';
function DeviceIcon({ device }: { device: 'auto' | 'desktop' | 'tablet' | 'phone' }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {device === 'auto' ? (
        <path d="M4 12h16m-4-4 4 4-4 4M8 8l-4 4 4 4" />
      ) : device === 'desktop' ? (
        <>
          <rect x="3" y="4" width="18" height="13" rx="2" />
          <path d="M8 21h8m-4-4v4" />
        </>
      ) : (
        <>
          <rect
            x={device === 'phone' ? 7 : 5}
            y="3"
            width={device === 'phone' ? 10 : 14}
            height="18"
            rx="2"
          />
          <path d="M11 18h2" />
        </>
      )}
    </svg>
  );
}
function Setting({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="studio-setting">
      <legend>{title}</legend>
      {children}
    </fieldset>
  );
}
export default function StudioPlayground({
  dark,
  onDarkChange,
}: {
  dark: boolean;
  onDarkChange: (value: boolean) => void;
}) {
  const [composition, setComposition] =
    useState<NonNullable<StarterPageProps['composition']>>('intro');
  const [material, setMaterial] = useState<Material>('glass');
  const [layout, setLayout] = useState<NonNullable<StarterPageProps['layout']>>('split');
  const [settings, setSettings] = useState(() => ({
    ...defaults,
    width: window.matchMedia('(max-width: 700px)').matches ? 360 : defaults.width,
  }));
  const automaticWidth = useRef(true);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 700px)');
    const updateWidth = () => {
      if (automaticWidth.current)
        setSettings((previous) => ({ ...previous, width: media.matches ? 360 : defaults.width }));
    };
    media.addEventListener('change', updateWidth);
    return () => media.removeEventListener('change', updateWidth);
  }, []);
  const [accent, setAccent] = useState<string>('#68783e');
  const [shadow, setShadow] = useState('soft');
  const [backdrop, setBackdrop] = useState('light');
  const [motion, setMotion] = useState(true);
  const [effects, setEffects] = useState(true);
  const [view, setView] = useState<'auto' | '85' | '75' | 'width' | 'page' | 'actual'>('auto');
  const [tab, setTab] = useState('layout');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [previewMetrics, setPreviewMetrics] = useState<PreviewMetrics>({
    width: 900,
    scale: 1,
    overview: false,
  });
  const [widthDraft, setWidthDraft] = useState(String(settings.width));
  useEffect(() => setWidthDraft(String(settings.width)), [settings.width]);
  const [codeOpen, setCodeOpen] = useState(false);
  const [file, setFile] = useState('main.tsx');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [saved, setSaved] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const update = (key: keyof typeof defaults, value: number) => {
    if (key === 'width') automaticWidth.current = false;
    setSettings((previous) => ({ ...previous, [key]: value }));
  };
  const useAutomaticWidth = () => {
    automaticWidth.current = true;
    setSettings((previous) => ({
      ...previous,
      width: window.matchMedia('(max-width: 700px)').matches ? 360 : defaults.width,
    }));
  };
  const tokens = useMemo(() => {
    const s = settings,
      ratio = s.space / 100,
      font = s.font / 100;
    const result: ThemeTokens = {
      '--pui-radius': `${s.radius}px`,
      '--pui-radius-control': `${Math.max(4, Math.round(s.radius / 2))}px`,
      '--pui-glass-clear': effects
        ? `color-mix(in srgb, var(--pui-panel) ${s.opacity}%, transparent)`
        : 'var(--pui-panel)',
      '--pui-glass-soft': effects
        ? `color-mix(in srgb, var(--pui-panel) ${Math.min(95, s.opacity + 15)}%, transparent)`
        : 'var(--pui-panel)',
      '--pui-glass-blur': `${effects ? s.blur : 0}px`,
      '--pui-glass-saturation': `${effects ? s.saturation : 100}%`,
      '--pui-line': `color-mix(in srgb, var(--pui-ink) ${s.border}%, transparent)`,
      '--pui-text-base': `${16 * font}px`,
      '--pui-text-sm': `${14 * font}px`,
      '--pui-text-lg': `${18 * font}px`,
      '--pui-text-heading': `${20 * font}px`,
      '--pui-text-title': `${32 * font}px`,
      '--pui-hero-title-size': `${44 * font}px`,
      '--pui-example-space': ratio,
      '--pui-example-font': font,
      '--pui-section-space': `${56 * ratio}px`,
      '--pui-section-inset': `${28 * ratio}px`,
      '--pui-shadow':
        shadow === 'none'
          ? 'none'
          : shadow === 'deep'
            ? '0 16px 38px -16px #23351b50'
            : '0 8px 26px -16px #23351b30',
      '--pui-shadow-raised':
        shadow === 'none'
          ? 'none'
          : shadow === 'deep'
            ? '0 24px 54px -22px #23351b55'
            : '0 14px 40px -24px #23351b35',
    };
    for (let n = 1; n <= 8; n++) result[`--pui-space-${n}`] = `${n * 4 * ratio}px`;
    return result;
  }, [settings, shadow, effects]);
  const pageCode = `import { useState } from 'react';
import { ThemeProvider } from 'seria-ui';
import 'seria-ui/styles.css';
import StarterPage from './StarterPage';
import { exampleThemes } from './theme';

// 예제 파일과 spaces.css를 함께 가져오세요. 서체는 프로젝트에서 정합니다.
export default function Page() {
  const [saved,setSaved] = useState(false);
  return <ThemeProvider surface="inherit" defaultTheme="${dark ? 'dark' : 'light'}"
    storageKey="my-page-theme" accent="${accent}" themes={exampleThemes}
    style={${JSON.stringify(tokens, null, 6)}}>
    <div className="example-backdrop" data-backdrop="${backdrop}" data-motion="${motion ? 'on' : 'off'}" data-pui-effects="${effects ? 'on' : 'off'}">
      <StarterPage composition="${composition}" material="${material}" layout="${layout}"
        spacious={${settings.space >= 100}} saved={saved} onSave={()=>setSaved(!saved)}
        onAction={()=>{ /* 프로젝트의 동작을 연결하세요. */ }} />
    </div>
  </ThemeProvider>;
}`;
  const files: Record<string, string> = {
    'main.tsx':
      pageCode.replace(
        "import { useState } from 'react';",
        "import { useState } from 'react';\nimport { createRoot } from 'react-dom/client';",
      ) + "\ncreateRoot(document.getElementById('root')!).render(<Page />);\n",
    'Page.tsx': pageCode,
    'StarterPage.tsx': starterSource,
    'Spaces.tsx': spacesSource,
    'ComponentPage.tsx': componentSource,
    'spaces.css': spacesStyles,
    'theme.ts': themeSource,
  };
  const choose = (items: string[][], value: string, onChange: (id: string) => void) => (
    <div className="segmented-choices">
      {items.map(([id, label]) => (
        <button type="button" key={id} aria-pressed={value === id} onClick={() => onChange(id)}>
          {label}
        </button>
      ))}
    </div>
  );
  const range = (
    key: keyof typeof defaults,
    label: string,
    min: number,
    max: number,
    unit: string,
    step = 1,
  ) => (
    <label className="studio-range">
      <span>
        {label}
        <output>
          {settings[key]}
          {unit}
        </output>
      </span>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={settings[key]}
        onChange={(event) => update(key, Number(event.target.value))}
      />
    </label>
  );
  const reset = () => {
    automaticWidth.current = true;
    onDarkChange(false);
    setComposition('intro');
    setMaterial('glass');
    setLayout('split');
    setSettings({
      ...defaults,
      width: window.matchMedia('(max-width: 700px)').matches ? 360 : defaults.width,
    });
    setAccent('#68783e');
    setShadow('soft');
    setBackdrop('light');
    setMotion(true);
    setEffects(true);
    setView('auto');
  };
  const commitWidth = () => {
    const value = Number(widthDraft);
    if (widthDraft.trim() && Number.isFinite(value)) {
      const width = Math.max(280, Math.min(1440, Math.round(value / 10) * 10));
      update('width', width);
      setWidthDraft(String(width));
    } else setWidthDraft(String(settings.width));
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(files[file]);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([files[file]], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = file;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <section
      id="playground"
      className="playground-section showcase-section"
      data-settings-open={settingsOpen}
    >
      <div className="playground-content">
        <header className="playground-heading">
          <div>
            <span className="eyebrow">01 / PLAYGROUND</span>
            <h2>같은 요소, 다른 가능성.</h2>
            <p>유리의 깊이부터 작은 간격까지. 바꾸는 순간, 페이지에도 그대로.</p>
          </div>
          <span className="live-label">
            <i />
            LIVE
          </span>
        </header>
        <div className="studio-workbench" data-settings-open={settingsOpen}>
          <aside className="studio-controls" id="playground-settings" aria-label="미리보기 설정">
            <div className="studio-controls-title">
              <strong>페이지 설정</strong>
              <button type="button" onClick={reset} aria-label="설정 초기화">
                초기화 ↺
              </button>
            </div>
            <div className="settings-tabs" role="group" aria-label="설정 분류">
              {[
                ['layout', '구성'],
                ['surface', '표면·색'],
                ['details', '세부'],
              ].map(([id, label]) => (
                <button type="button" key={id} aria-pressed={tab === id} onClick={() => setTab(id)}>
                  {label}
                </button>
              ))}
            </div>
            <div className="settings-body">
              {tab === 'layout' && (
                <>
                  <Setting title="페이지 구성">
                    <div className="composition-choices">
                      {[
                        ['intro', '서비스 소개', '↗'],
                        ['journal', '콘텐츠·기록', '▤'],
                        ['workspace', '업무·도구', '▦'],
                        ['components', '컴포넌트', '⊞'],
                      ].map(([id, label, mark]) => (
                        <button
                          type="button"
                          key={id}
                          aria-pressed={composition === id}
                          onClick={() => setComposition(id as typeof composition)}
                        >
                          <span aria-hidden="true">{mark}</span>
                          {label}
                        </button>
                      ))}
                    </div>
                  </Setting>
                  {(composition === 'intro' || composition === 'journal') && (
                    <Setting title="내용 배치">
                      {choose(
                        [
                          ['split', '좌우'],
                          ['stack', '세로'],
                          ...(composition === 'intro' ? [['cover', '겹침']] : []),
                        ],
                        layout,
                        (id) => setLayout(id as typeof layout),
                      )}
                    </Setting>
                  )}
                  <Setting title="배경">
                    <div className="background-choices">
                      {[
                        ['light', '은은한 빛'],
                        ['paper', '차분한 면'],
                        ['grid', '작은 격자'],
                      ].map(([id, label]) => (
                        <button
                          type="button"
                          key={id}
                          data-backdrop={id}
                          aria-pressed={backdrop === id}
                          onClick={() => setBackdrop(id)}
                        >
                          <i />
                          {label}
                        </button>
                      ))}
                    </div>
                  </Setting>
                  <Setting title="테마">
                    {choose(
                      [
                        ['light', '라이트'],
                        ['dark', '다크'],
                      ],
                      dark ? 'dark' : 'light',
                      (id) => onDarkChange(id === 'dark'),
                    )}
                  </Setting>
                  <p className="settings-hint">
                    배경 위로 빛과 형태가 은은하게 비칩니다. 모든 예시는 같은 설정을 함께 사용해요.
                  </p>
                </>
              )}
              {tab === 'surface' && (
                <>
                  <Setting title="표면">
                    {choose(
                      [
                        ['glass', '유리'],
                        ['solid', '불투명'],
                        ['open', '열린 면'],
                      ],
                      material,
                      (id) => setMaterial(id as Material),
                    )}
                  </Setting>
                  <fieldset
                    className="glass-settings"
                    disabled={!effects || material !== 'glass'}
                    aria-label="유리 질감 조정"
                  >
                    {range('opacity', '표면 농도', 20, 95, '%')}
                    {range('blur', '흐림', 0, 40, 'px')}
                    {range('saturation', '색의 깊이', 80, 180, '%')}
                  </fieldset>
                  {(!effects || material !== 'glass') && (
                    <p className="settings-hint">
                      유리 표면과 효과를 켜면 질감을 조정할 수 있어요.
                    </p>
                  )}
                  <Setting title="강조색">
                    <div className="studio-color-choices">
                      {studioAccents.map((color) => (
                        <button
                          type="button"
                          key={color.value}
                          aria-label={color.label}
                          aria-pressed={accent === color.value}
                          onClick={() => setAccent(color.value)}
                          style={{ background: color.value, color: color.ink }}
                        >
                          {accent === color.value ? '✓' : ''}
                        </button>
                      ))}
                      <label className="custom-color" title="직접 색상 선택">
                        <span>＋</span>
                        <input
                          type="color"
                          aria-label="사용자 강조색"
                          value={accent}
                          onChange={(event) => setAccent(event.target.value)}
                        />
                      </label>
                    </div>
                    <code className="color-value">{accent.toUpperCase()}</code>
                  </Setting>
                  <label className="studio-check">
                    <input
                      type="checkbox"
                      checked={effects}
                      onChange={(event) => setEffects(event.target.checked)}
                    />
                    유리 효과 사용
                  </label>
                </>
              )}
              {tab === 'details' && (
                <>
                  {range('radius', '모서리', 0, 40, 'px')}
                  {range('space', '간격', 75, 125, '%', 5)}
                  {range('font', '글자 크기', 85, 120, '%', 5)}
                  {range('border', '경계선', 5, 30, '%')}
                  <Setting title="그림자">
                    {choose(
                      [
                        ['none', '없음'],
                        ['soft', '은은하게'],
                        ['deep', '깊게'],
                      ],
                      shadow,
                      setShadow,
                    )}
                  </Setting>
                  <label className="studio-check">
                    <input
                      type="checkbox"
                      checked={motion}
                      onChange={(event) => setMotion(event.target.checked)}
                    />
                    부드러운 전환
                  </label>
                  <label className="width-field">
                    페이지 너비
                    <input
                      type="number"
                      aria-label="페이지 너비"
                      min={280}
                      max={1440}
                      step={10}
                      value={widthDraft}
                      onChange={(event) => setWidthDraft(event.target.value)}
                      onBlur={commitWidth}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') event.currentTarget.blur();
                      }}
                    />
                    <span>px</span>
                  </label>
                </>
              )}
            </div>
            <div className="settings-footnote">글꼴은 프로젝트의 선택 그대로.</div>
          </aside>
          <div className="preview-panel">
            <div className="preview-toolbar">
              <span className="preview-name">
                <i />
                미리보기
              </span>
              <div className="viewport-toggle" role="group" aria-label="미리보기 너비">
                <button
                  type="button"
                  aria-label="자동 너비"
                  title="화면에 맞는 자동 너비"
                  aria-pressed={automaticWidth.current}
                  onClick={useAutomaticWidth}
                >
                  <DeviceIcon device="auto" />
                </button>
                {[
                  [900, '넓은 화면', 'desktop'],
                  [640, '태블릿 너비', 'tablet'],
                  [360, '모바일 너비', 'phone'],
                ].map(([value, label, device]) => (
                  <button
                    type="button"
                    key={value}
                    aria-label={String(label)}
                    title={String(label)}
                    aria-pressed={!automaticWidth.current && settings.width === value}
                    onClick={() => update('width', Number(value))}
                  >
                    <DeviceIcon device={device as 'desktop' | 'tablet' | 'phone'} />
                  </button>
                ))}
              </div>
              <label className="mobile-preview-width">
                <span className="sr-only">미리보기 너비</span>
                <select
                  aria-label="미리보기 너비"
                  value={automaticWidth.current ? 'auto' : String(settings.width)}
                  onChange={(event) => {
                    if (event.target.value === 'auto') useAutomaticWidth();
                    else update('width', Number(event.target.value));
                  }}
                >
                  <option value="auto">자동 너비</option>
                  <option value="900">넓게</option>
                  <option value="640">태블릿</option>
                  <option value="360">모바일</option>
                  {![900, 640, 360].includes(settings.width) && (
                    <option value={settings.width}>{settings.width}px</option>
                  )}
                </select>
              </label>
              <label className="preview-view">
                <span className="sr-only">미리보기 배율</span>
                <select
                  aria-label="미리보기 배율"
                  value={view}
                  onChange={(event) => setView(event.target.value as typeof view)}
                >
                  <option value="auto">자동 맞춤</option>
                  <option value="85">85%</option>
                  <option value="75">75%</option>
                  <option value="width">읽기</option>
                  <option value="page">전체 보기</option>
                  <option value="actual">100%</option>
                </select>
              </label>
              <button
                type="button"
                className="mobile-settings-toggle"
                aria-expanded={settingsOpen}
                aria-controls="playground-settings"
                onClick={() => setSettingsOpen(!settingsOpen)}
              >
                {settingsOpen ? '닫기' : '설정'}
              </button>
            </div>
            <PreviewCanvas
              width={settings.width}
              mode={view === 'page' || view === 'actual' ? view : 'width'}
              zoom={view === '85' ? 0.85 : view === '75' ? 0.75 : 1}
              comfortable={view === 'auto'}
              responsive={automaticWidth.current && view !== 'page' && view !== 'actual'}
              onMetricsChange={setPreviewMetrics}
            >
              <ThemeProvider
                key={String(dark)}
                defaultTheme={dark ? 'dark' : 'light'}
                storageKey={`seria-preview-v18-${dark}`}
                surface="inherit"
                accent={accent}
                themes={studioThemes}
                style={tokens}
              >
                <div
                  className="example-backdrop recipe-preview"
                  data-backdrop={backdrop}
                  data-motion={motion ? 'on' : 'off'}
                  data-composition={composition}
                  data-pui-effects={effects ? 'on' : 'off'}
                >
                  <StarterPage
                    composition={composition}
                    material={material}
                    layout={layout}
                    spacious={settings.space >= 100}
                    saved={saved}
                    onSave={() => setSaved(!saved)}
                    onAction={() => {
                      setSubmitted(false);
                      setActionOpen(true);
                    }}
                  />
                </div>
              </ThemeProvider>
            </PreviewCanvas>
            <footer className="preview-status">
              <span
                className="preview-metrics"
                aria-label={`미리보기 ${Math.round(previewMetrics.width)}픽셀, 배율 ${Math.round(previewMetrics.scale * 100)}퍼센트`}
              >
                <i />
                <span className="preview-mode">
                  {previewMetrics.overview ? '전체 보기' : '읽기'}
                </span>
                <span className="preview-size">
                  {Math.round(previewMetrics.scale * 100)}%<b aria-hidden="true">·</b>
                  {Math.round(previewMetrics.width)}px
                </span>
              </span>
              <button type="button" onClick={() => setCodeOpen(true)}>
                코드 가져가기 <span aria-hidden="true">↗</span>
              </button>
            </footer>
          </div>
        </div>
        <p className="playground-caption">글꼴은 프로젝트 그대로. 구성은 나답게.</p>
      </div>
      <ThemeProvider
        key={`dialogs-${dark}`}
        defaultTheme={dark ? 'dark' : 'light'}
        storageKey={`seria-studio-dialog-v18-${dark}`}
        surface="inherit"
        accent={accent}
        themes={studioThemes}
        style={tokens}
      >
        <Dialog
          open={actionOpen}
          onClose={() => setActionOpen(false)}
          glass={material === 'glass' ? 'clear' : false}
          title={submitted ? '예시 작업을 완료했어요.' : '나의 페이지를 시작해볼까요?'}
          actions={
            <Button
              variant="primary"
              onClick={() => (submitted ? setActionOpen(false) : setSubmitted(true))}
            >
              {submitted ? '닫기' : '예시 작업 완료'}
            </Button>
          }
        >
          <Stack gap={5}>
            <p>실제 서비스에서는 이 자리에 이동·저장·신청 기능을 연결하세요.</p>
            {!submitted && (
              <Field label="나의 페이지 이름">
                {(props) => (
                  <Input
                    {...props}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="이곳에 나의 이름을"
                  />
                )}
              </Field>
            )}
          </Stack>
        </Dialog>
        <Dialog
          open={codeOpen}
          onClose={() => setCodeOpen(false)}
          glass="soft"
          title="지금의 구성을 가져가세요."
          actions={
            <>
              <Button onClick={download}>파일 받기</Button>
              <Button onClick={copy} variant="primary">
                {copied ? '복사 완료' : '코드 복사'}
              </Button>
              <Button onClick={() => setCodeOpen(false)}>닫기</Button>
            </>
          }
        >
          <label className="source-selector">
            예제 파일
            <select
              value={file}
              onChange={(event) => {
                setFile(event.target.value);
                setCopied(false);
              }}
            >
              {Object.keys(files).map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>
          <pre className="source-code" tabIndex={0}>
            <code>{files[file]}</code>
          </pre>
          <p className="source-note">
            새 시작 파일에는 main.tsx를 덮어쓰세요. 기존 프로젝트에는 Page.tsx를 사용하세요. 두 파일
            모두 현재 설정이 반영됩니다.
          </p>
          <a
            className="text-link"
            href={`./downloads/seria-ui-starter-${SERIA_VERSION}.tar.gz`}
            download
          >
            전체 시작 파일 받기 ↓
          </a>
          {copyError && <p role="status">코드 영역을 직접 선택해 복사해주세요.</p>}
        </Dialog>
      </ThemeProvider>
    </section>
  );
}
