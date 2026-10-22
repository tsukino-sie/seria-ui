import { useState, useEffect, type ReactNode, type CSSProperties } from 'react';
import KeynoteHero from './KeynoteHero';
import PlaybackGallery from './PlaybackGallery';
import StarterPage from '../examples/StarterPage';
import starterSource from '../examples/StarterPage.tsx?raw';
import spacesSource from '../examples/Spaces.tsx?raw';
import spacesStyles from '../examples/spaces.css?raw';
import themeSource from '../examples/theme.ts?raw';
import { SERIA_VERSION } from '../src/index';
import { studioAccents, studioThemes } from './palette';
import { ThemeProvider, Stack, Button, Field, Input, Dialog, type ThemeTokens } from '../src/index';

type Composition = 'intro' | 'journal' | 'workspace';
type Finish = 'ambient' | 'plain' | 'transparent';
const compositions = [
  { id: 'intro', label: '서비스 소개', icon: 'spark' },
  { id: 'journal', label: '콘텐츠·기록', icon: 'book' },
  { id: 'workspace', label: '업무·도구', icon: 'grid' },
] as const;
const colors = studioAccents;
const shapes = [
  { label: '정돈된', value: 12 },
  { label: '부드러운', value: 24 },
  { label: '둥근', value: 36 },
];
function Icon({ name = 'arrow', size = 20 }: { name?: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4Z" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    book: (
      <>
        <path d="M12 5v15M3 4c4-1 6 0 9 2 3-2 5-3 9-2v14c-4-1-6 0-9 2-3-2-5-3-9-2Z" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
      </>
    ),
    moon: <path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10Z" />,
    copy: (
      <>
        <rect x="8" y="8" width="12" height="13" rx="2" />
        <path d="M16 8V3H3v13h5" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    desktop: (
      <>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M12 17v4m-4 0h8" />
      </>
    ),
    mobile: (
      <>
        <rect x="6" y="2" width="12" height="20" rx="2" />
        <path d="M10 18h4" />
      </>
    ),
    layers: (
      <>
        <path d="m12 3 9 5-9 5-9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] ?? paths.arrow}
    </svg>
  );
}
function Mark() {
  return (
    <span className="seria-mark" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}
function Choices({ label, children }: { label: string; children: ReactNode }) {
  return (
    <fieldset className="control-group">
      <legend>{label}</legend>
      {children}
    </fieldset>
  );
}
export default function App() {
  const [dark, setDark] = useState(false);
  const [composition, setComposition] = useState<Composition>('intro');
  const [finish, setFinish] = useState<Finish>('ambient');
  const [accent, setAccent] = useState<string>(colors[0].value);
  const [radius, setRadius] = useState(24);
  const [spacious, setSpacious] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const [sourceFile, setSourceFile] = useState('Page.tsx');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.studioTheme = dark ? 'dark' : 'light';
  }, [dark]);
  const tokens = {
    '--pui-radius': `${radius}px`,
    '--pui-radius-control': `${Math.max(8, Math.round(radius / 2))}px`,
  } as ThemeTokens;
  const pageCode = `import { useState } from 'react';
import { ThemeProvider } from 'seria-ui';
import 'seria-ui/styles.css';
import StarterPage from './StarterPage';
import { exampleThemes } from './theme';

// StarterPage.tsx, Spaces.tsx, spaces.css를 같은 폴더에 두세요.
// 서체와 내용은 프로젝트에서 직접 정합니다.
export default function Page() {
  const [saved, setSaved] = useState(false);
  return (
    <ThemeProvider surface="inherit" defaultTheme="${dark ? 'dark' : 'light'}"
      themes={exampleThemes} storageKey="my-page-theme" accent="${accent}"
      style={{ '--pui-radius': '${radius}px', '--pui-radius-control': '${Math.max(8, Math.round(radius / 2))}px' }}>
      <StarterPage composition="${composition}" finish="${finish}" spacious={${spacious}}
        saved={saved} onSave={() => setSaved(!saved)}
        onAction={() => { /* 이동, 저장 등 프로젝트 동작을 연결하세요. */ }} />
    </ThemeProvider>
  );
}`;
  const sourceFiles: Record<string, string> = {
    'Page.tsx': pageCode,
    'StarterPage.tsx': starterSource,
    'Spaces.tsx': spacesSource,
    'spaces.css': spacesStyles,
    'theme.ts': themeSource,
  };
  const code = sourceFiles[sourceFile];
  const reset = () => {
    setComposition('intro');
    setFinish('ambient');
    setAccent(colors[0].value);
    setRadius(24);
    setSpacious(true);
    setMobile(false);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  };
  useEffect(() => {
    setCopied(false);
    setCopyError(false);
  }, [code]);
  const action = () => {
    setActionOpen(true);
    setSubmitted(false);
  };
  return (
    <div className="studio">
      <a className="studio-skip" href="#main">
        본문으로 건너뛰기
      </a>
      <header className="studio-header">
        <div className="studio-nav">
          <a href="#" className="wordmark" aria-label="Seria UI 처음으로">
            <Mark />
            <span>
              seria<span className="wordmark-ui"> ui</span>
            </span>
          </a>
          <nav aria-label="주 메뉴">
            <a href="#playground">플레이그라운드</a>
            <a href="#principles">설계 원칙</a>
            <a href="#start">시작하기</a>
          </nav>
          <div className="header-actions">
            <button
              className="theme-toggle"
              onClick={() => setDark(!dark)}
              aria-label={dark ? '라이트 모드로 전환' : '다크 모드로 전환'}
            >
              <Icon name={dark ? 'sun' : 'moon'} size={19} />
            </button>
            <a className="header-cta" href="#playground">
              직접 만들어 보기 <Icon size={15} />
            </a>
          </div>
        </div>
      </header>
      <main id="main">
        <KeynoteHero />
        <section id="playground" className="playground-section section-wrap">
          <div className="section-heading">
            <div>
              <span className="eyebrow">01 / PLAYGROUND</span>
              <h2>같은 요소, 다른 가능성.</h2>
              <p>구성을 고르고, 색과 표면을 바꿔보세요. 페이지 전체가 함께 반응해요.</p>
            </div>
            <span className="live-label">
              <i /> LIVE PREVIEW
            </span>
          </div>
          <div className="playground">
            <aside className="playground-controls" aria-label="미리보기 설정">
              <div className="controls-title">
                <span>페이지 조합</span>
                <button onClick={reset} className="reset-button">
                  초기화 ↺
                </button>
              </div>
              <Choices label="01 구성">
                {compositions.map((item) => (
                  <button
                    key={item.id}
                    className="composition-button"
                    aria-pressed={composition === item.id}
                    onClick={() => setComposition(item.id)}
                  >
                    <Icon name={item.icon} size={18} />
                    <span>{item.label}</span>
                    <span className="choice-check">
                      {composition === item.id ? <Icon name="check" size={14} /> : <span />}
                    </span>
                  </button>
                ))}
              </Choices>
              <Choices label="02 표면 표현">
                <div className="finish-choices">
                  {[
                    { id: 'ambient', label: '은은한 빛' },
                    { id: 'plain', label: '단정한 면' },
                    { id: 'transparent', label: '열린 여백' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      aria-pressed={finish === item.id}
                      onClick={() => setFinish(item.id as Finish)}
                    >
                      <span className={`finish-swatch ${item.id}`} />
                      {item.label}
                    </button>
                  ))}
                </div>
              </Choices>
              <Choices label="03 강조색">
                <div className="color-choices">
                  {colors.map((item) => (
                    <button
                      key={item.value}
                      aria-label={item.label}
                      title={item.label}
                      aria-pressed={accent === item.value}
                      style={{ '--swatch': item.value, color: item.ink } as CSSProperties}
                      onClick={() => setAccent(item.value)}
                    >
                      {accent === item.value && <Icon name="check" size={17} />}
                    </button>
                  ))}
                </div>
              </Choices>
              <Choices label="04 모서리">
                <div className="shape-choices">
                  {shapes.map((item) => (
                    <button
                      key={item.value}
                      aria-pressed={radius === item.value}
                      onClick={() => setRadius(item.value)}
                    >
                      <span style={{ borderRadius: item.value / 3 }} />
                      {item.label}
                    </button>
                  ))}
                </div>
              </Choices>
              <Choices label="05 간격">
                <div className="spacing-choices">
                  {[
                    { label: '여유롭게', value: true },
                    { label: '촘촘하게', value: false },
                  ].map((item) => (
                    <button
                      key={item.label}
                      aria-pressed={spacious === item.value}
                      onClick={() => setSpacious(item.value)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </Choices>
              <p className="controls-note">
                <Icon name="spark" size={15} /> 선택은 가볍게.
                <br />
                균형은 함께 바뀌어요.
              </p>
            </aside>
            <div className="preview-panel">
              <div className="preview-toolbar">
                <div className="window-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
                <span>seria / {composition}</span>
                <div className="viewport-toggle" role="group" aria-label="미리보기 너비">
                  <button
                    aria-label="넓은 화면"
                    aria-pressed={!mobile}
                    onClick={() => setMobile(false)}
                  >
                    <Icon name="desktop" size={17} />
                  </button>
                  <button
                    aria-label="모바일 너비"
                    aria-pressed={mobile}
                    onClick={() => setMobile(true)}
                  >
                    <Icon name="mobile" size={17} />
                  </button>
                </div>
              </div>
              <div className="preview-bed">
                <div className={`preview-frame ${mobile ? 'is-mobile' : ''}`}>
                  <ThemeProvider
                    defaultTheme={dark ? 'dark' : 'light'}
                    key={String(dark)}
                    storageKey={`seria-studio-preview-${dark}`}
                    accent={accent}
                    themes={studioThemes}
                    style={tokens}
                    surface="inherit"
                  >
                    <div
                      className="recipe-preview"
                      data-composition={composition}
                      data-preview-theme={dark ? 'dark' : 'light'}
                    >
                      <StarterPage
                        key={composition}
                        composition={composition}
                        finish={finish}
                        spacious={spacious}
                        onAction={action}
                        saved={saved}
                        onSave={() => setSaved(!saved)}
                      />
                    </div>
                  </ThemeProvider>
                </div>
              </div>
              <div className="preview-status">
                <span>
                  <span /> 실제 Seria 컴포넌트로 렌더링해요
                </span>
                <button
                  onClick={() => setCodeOpen(!codeOpen)}
                  aria-expanded={codeOpen}
                  aria-controls="starter-code"
                >
                  {codeOpen ? '코드 닫기' : '시작 코드 보기'} <span>{codeOpen ? '−' : '↗'}</span>
                </button>
              </div>
            </div>
          </div>
          {codeOpen && (
            <div className="code-panel" id="starter-code">
              <div>
                <label>
                  예제 파일{' '}
                  <select
                    value={sourceFile}
                    onChange={(event) => setSourceFile(event.target.value)}
                  >
                    {Object.keys(sourceFiles).map((file) => (
                      <option key={file}>{file}</option>
                    ))}
                  </select>
                </label>
                <button onClick={copy}>
                  <Icon name={copied ? 'check' : 'copy'} size={16} />
                  {copied ? '복사 완료' : '코드 복사'}
                </button>
              </div>
              <p>전체 예시 화면의 복제 코드가 아닌, 직접 확장할 수 있는 최소 구성입니다.</p>
              <pre tabIndex={0}>
                <code>{code}</code>
              </pre>
              <p className="starter-note">
                미리보기와 같은 전체 소스입니다. Page.tsx에는 현재 설정이 반영됩니다. 이미지와 실행
                환경은 시작 파일에 포함되어 있어요.
              </p>
              <a
                className="text-link"
                href={`./downloads/seria-ui-starter-${SERIA_VERSION}.tar.gz`}
                download
              >
                전체 시작 파일 받기 ↗
              </a>
              <span className="sr-only" role="status">
                {copied ? '시작 코드를 복사했습니다.' : ''}
              </span>
              {copyError && (
                <p role="status">자동 복사를 사용할 수 없어요. 코드 영역을 선택해 복사해 주세요.</p>
              )}
            </div>
          )}
          <div className="playground-note">
            <span>YOUR TYPE, YOUR IDENTITY.</span>
            <p>
              Seria는 서체를 선택하거나 불러오지 않아요. 이 웹페이지의 글꼴도 사이트에서 직접
              지정했어요.
            </p>
          </div>
        </section>
        <PlaybackGallery />
        <section className="principles-section section-wrap" id="principles">
          <div className="section-heading">
            <div>
              <span className="eyebrow">02 / BUILT TO FIT</span>
              <h2>
                페이지를 덮어쓰지 않고,
                <br />
                좋은 구성을 뒷받침해요.
              </h2>
            </div>
            <p className="principles-lead">
              새로운 페이지에도, 이미 만든 페이지에도.
              <br />
              필요한 만큼 가져와서 나만의 방식으로 사용하세요.
            </p>
          </div>
          <div className="principles-grid">
            <article>
              <span className="principle-number">01</span>
              <div className="principle-visual visual-spacing">
                <i />
                <i />
                <i />
                <span>24</span>
              </div>
              <h3>여백에도 기준이 있으니까.</h3>
              <p>
                세로 묶음, 가로 묶음과 자동 열 배치. 요소를 추가해도 간격과 정렬은 같은 규칙으로
                이어져요.
              </p>
              <code>Stack · Cluster · Columns</code>
            </article>
            <article>
              <span className="principle-number">02</span>
              <div className="principle-visual visual-surfaces">
                <i />
                <i />
                <i />
              </div>
              <h3>단정함에, 필요한 깊이만.</h3>
              <p>
                은은한 배경, 강조 표면, 떠 있는 카드. 모든 곳에 효과를 더하지 않고 필요한 곳에
                표정을 주세요.
              </p>
              <code>Hero · Surface · Theme</code>
            </article>
            <article>
              <span className="principle-number">03</span>
              <div className="principle-visual visual-identity">
                <span>Aa</span>
                <span>가</span>
                <i />
              </div>
              <h3>나다운 모습은 그대로.</h3>
              <p>
                서체와 콘텐츠는 프로젝트의 몫. 기존 페이지에는 배경을 유지하는 모드로 필요한
                컴포넌트부터 적용해요.
              </p>
              <code>surface="inherit"</code>
            </article>
          </div>
        </section>
        <section className="start-section section-wrap" id="start">
          <div className="start-copy">
            <span className="eyebrow">03 / START SMALL</span>
            <h2>
              빈 화면에서,
              <br />첫 번째 조합까지.
            </h2>
            <p>
              React 프로젝트에 Seria를 연결하고
              <br />
              필요한 요소부터 하나씩 놓아보세요.
            </p>
            <a
              className="text-link"
              href="https://github.com/tsukino-sie/seria-ui"
              target="_blank"
              rel="noreferrer"
            >
              소스와 설치 안내 <span>↗</span>
            </a>
            <div className="start-details">
              <span>
                <Icon name="check" size={16} /> React 18.3 또는 19
              </span>
              <span>
                <Icon name="check" size={16} /> CSS 토큰으로 조정
              </span>
              <span>
                <Icon name="check" size={16} /> 키보드·모션 감소 대응
              </span>
            </div>
            <div className="install-package">
              <a href={`./downloads/seria-ui-starter-${SERIA_VERSION}.tar.gz`} download>
                바로 실행하는 시작 파일 <span aria-hidden="true">↓</span>
              </a>
              <p>압축을 푼 뒤 npm install, npm run dev. 세 가지 구성을 직접 바꿔보세요.</p>
              <a href={`./downloads/seria-ui-${SERIA_VERSION}.tgz`} download>
                Seria UI {SERIA_VERSION} 패키지 받기 <span aria-hidden="true">↓</span>
              </a>
              <code>{`npm install ./seria-ui-${SERIA_VERSION}.tgz`}</code>
              <p>
                받은 파일을 React 프로젝트에 설치하세요. 원작자 표기를 유지하면 상업적 사용도
                가능해요.
              </p>
            </div>
          </div>
          <div className="start-code">
            <div className="start-code-header">
              <span>
                <i /> MyFirstPage.tsx
              </span>
              <span>REACT + CSS</span>
            </div>
            <pre tabIndex={0}>
              <code>
                <span className="code-purple">import</span> {'{ Container, Stack, Hero, Button }'}
                <br /> <span className="code-purple">from</span>{' '}
                <span className="code-green">'seria-ui'</span>;<br />
                <br />
                <span className="code-muted">{'// ThemeProvider 안에서 자유롭게 조합하세요.'}</span>
                <br />
                {'<'}
                <span className="code-green">Container</span>
                {'>'}
                <br />
                {'  <'}
                <span className="code-green">Stack</span> gap={'{8}'}
                {'>'}
                <br />
                {'    <'}
                <span className="code-green">Hero</span>
                <br />
                {'      '}tone=<span className="code-sand">"ambient"</span>
                <br />
                {'      '}title=<span className="code-sand">"당신의 이야기를 시작하세요."</span>
                <br />
                {'      '}description=
                <span className="code-sand">"나만의 페이지, 나만의 방식으로."</span>
                <br />
                {'    />'}
                <br />
                {'  </Stack>'}
                <br />
                {'</Container>'}
              </code>
            </pre>
            <div className="code-footer">
              <span />
              작게 시작해도, 자연스럽게 확장할 수 있도록.
            </div>
          </div>
        </section>
        <section className="closing-section">
          <Mark />
          <h2>
            다음 페이지는,
            <br />
            <span>당신의 방식으로.</span>
          </h2>
          <a className="solid-link" href="#playground">
            지금 조합해 보기 <Icon size={18} />
          </a>
          <p>정해진 페이지보다, 열려 있는 가능성.</p>
        </section>
      </main>
      <footer className="studio-footer">
        <a href="#" className="wordmark">
          <Mark />
          <span>
            seria<span className="wordmark-ui"> ui</span>
          </span>
        </a>
        <span>Designed & built by Sie · © 2026</span>
        <div>
          <a href="https://github.com/tsukino-sie/seria-ui" target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <a
            href="https://github.com/tsukino-sie/seria-ui/blob/main/LICENSE"
            target="_blank"
            rel="noreferrer"
          >
            이용 조건 ↗
          </a>
        </div>
      </footer>
      <ThemeProvider
        surface="inherit"
        accent={accent}
        style={tokens}
        defaultTheme={dark ? 'dark' : 'light'}
        key={String(dark)}
        storageKey={`seria-studio-dialog-${dark}`}
      >
        <Dialog
          open={actionOpen}
          onClose={() => setActionOpen(false)}
          title={submitted ? '예시 작업을 완료했어요.' : '이곳에 나의 동작을 연결하세요.'}
          actions={
            <Button
              variant={submitted ? 'secondary' : 'primary'}
              onClick={() => {
                if (submitted) setActionOpen(false);
                else setSubmitted(true);
              }}
            >
              {submitted ? '닫기' : '예시 작업 완료'}
            </Button>
          }
        >
          <Stack gap={5}>
            <p className="dialog-explanation">
              {submitted
                ? '실제 서버에 저장하지 않는 미리보기입니다. 입력과 확인 흐름을 확인할 수 있어요.'
                : '미리보기 버튼의 예시 동작입니다. 실제 서비스에서는 이 자리에 이동, 저장 또는 신청 기능을 연결하세요.'}
            </p>
            {!submitted && (
              <Field label="나의 첫 페이지 이름" hint="예시 입력이에요. 서버로 전송하지 않아요.">
                {(props) => (
                  <Input
                    {...props}
                    placeholder="예: 나의 작은 스튜디오"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                )}
              </Field>
            )}
          </Stack>
        </Dialog>
      </ThemeProvider>
    </div>
  );
}
