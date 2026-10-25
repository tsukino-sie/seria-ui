import { useState, useEffect, type ReactNode } from 'react';
import KeynoteHero from './KeynoteHero';
import PlaybackGallery from './PlaybackGallery';
import StudioPlayground from './StudioPlayground';
import useSectionScroll from './useSectionScroll';
import { SERIA_VERSION } from 'seria-ui';

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
export default function App({ downloadBase = './downloads' }: { downloadBase?: string }) {
  const [dark, setDark] = useState(false);
  useSectionScroll();
  useEffect(() => {
    document.documentElement.dataset.studioTheme = dark ? 'dark' : 'light';
  }, [dark]);
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
        <KeynoteHero dark={dark} />
        <StudioPlayground dark={dark} onDarkChange={setDark} />
        <PlaybackGallery />
        <section className="principles-section section-wrap showcase-section" id="principles">
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
        <section className="start-section section-wrap showcase-section" id="start">
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
              <a href={`${downloadBase}/seria-ui-studio-${SERIA_VERSION}.tar.gz`} download>
                이 소개 페이지 그대로 시작하기 <span aria-hidden="true">↓</span>
              </a>
              <p>자동 소개·플레이그라운드·모든 레이아웃과 소스를 함께 받아 수정하세요.</p>
              <a href={`${downloadBase}/seria-ui-starter-${SERIA_VERSION}.tar.gz`} download>
                바로 실행하는 시작 파일 <span aria-hidden="true">↓</span>
              </a>
              <p>압축을 푼 뒤 npm install, npm run dev. 네 가지 구성을 직접 바꿔보세요.</p>
              <a href={`${downloadBase}/seria-ui-${SERIA_VERSION}.tgz`} download>
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
      </main>
      <div className="closing-section showcase-section" id="closing">
        <section className="closing-copy" aria-labelledby="closing-title">
          <Mark />
          <h2 id="closing-title">
            다음 페이지는,
            <br />
            <span>당신의 방식으로.</span>
          </h2>
          <a className="solid-link" href="#playground">
            지금 조합해 보기 <Icon size={18} />
          </a>
          <p>정해진 페이지보다, 열려 있는 가능성.</p>
        </section>
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
      </div>
    </div>
  );
}
