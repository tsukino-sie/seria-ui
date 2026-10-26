# 소개 페이지와 같은 도구로 구성하기 · 1.9

소개 사이트에서 사용한 UI와 동작을 같은 패키지로 가져올 수 있어요.
**Seria는 글꼴을 선택하거나 다운로드하지 않아요. 글꼴과 문구, 이미지, 실제 서비스 동작은 프로젝트가 관리해요.**

## 전체 페이지 그대로 시작

[소개 페이지의 시작하기](https://seria-ui-studio.honey-puppy-6755.chatgpt.site/#start)에서 **이 소개 페이지 그대로 시작하기**를 받으세요.
`seria-ui-studio-1.9.2.tar.gz`에는 현재 사이트와 같은 App, 자동 소개, 플레이그라운드, 재생 예시, 모든 섹션의 레이아웃·스타일·예제 이미지가 들어 있어요.

```sh
npm install
npm run dev
# 배포할 때
npm run build
```

Node.js 22.12 이상이 필요해요. React 18.3과 19에서 실행할 수 있어요.
다운로드한 패키지를 설치하며 저장소의 src 별칭이나 특정 호스팅에 의존하지 않아요.
다운로드 링크는 기본적으로 원래 소개 사이트를 가리켜요. 자신의 파일을 배포하면 `src/showcase/main.tsx`의 `downloadBase`를 바꾸세요.

## 구성 요소와 원본 위치

| 화면에서 사용한 기능                                | 가져오는 API 또는 편집할 원본                                                 |
| --------------------------------------------------- | ----------------------------------------------------------------------------- |
| 화면 높이에 맞는 소개, 하단 재생부                  | `Presentation` · `KeynoteHero.tsx`                                            |
| 예시 창 하나, 독립적인 내부 스크롤                  | `BrowserFrame`                                                                |
| 장면별 코드 태그와 짧은 설명                        | `CodeExample`                                                                 |
| 한 번 자동 재생·정지·구간 선택·다시 보기            | `usePlayback` + `PlaybackControls`                                            |
| 방향에 따른 설명의 나가기·들어오기                  | `useSceneTransition` · `studio.css`의 keynote 전환                            |
| 페이지를 유지하며 부드럽게 배치 변경                | `useLayoutTransition`                                                         |
| 읽기·전체 보기·실제 크기, 너비·배율 계산            | `PreviewCanvas`                                                               |
| 섹션 내부 자유 스크롤, 경계의 자동 이동             | `useSectionScroll`                                                            |
| 전체 순서, 상단 메뉴, 마무리와 푸터                 | `src/showcase/App.tsx`                                                        |
| 올리브 빛, 배경, 80% 데스크톱 표시, 모바일 레이아웃 | `src/showcase/studio.css`                                                     |
| 조절 패널, 코드 복사·파일 저장, 모바일 설정 패널    | `src/showcase/StudioPlayground.tsx`                                           |
| 소개·콘텐츠·업무·컴포넌트 예제                      | `src/examples/StarterPage.tsx`, `Spaces.tsx`, `ComponentPage.tsx`             |
| 간격·정렬·자동 열 배치·미디어                       | `Container`, `Stack`, `Cluster`, `Columns`, `PageSection`, `MediaFrame`       |
| 유리·표면·강조색·테마·간격·모서리·텍스트 크기       | `ThemeProvider`, `Card`/`Surface`, `Hero`, CSS 토큰                           |
| 버튼·폼·상태·대화상자·메뉴                          | `Button`, `Field`, `Input`, `Select`, `Toggle`, `Badge`, `Dialog`, `Dropdown` |

플레이그라운드가 내보내는 예제와 실제 렌더링은 같은 `examples/` 소스를 사용해요.
새로운 섹션은 App에서 조합하고, 기존 섹션의 배치·문구·이미지는 해당 파일에서 직접 바꿔보세요.
아이콘과 로고의 SVG·CSS도 원본에 들어 있어요. 다른 제품의 에셋이나 글꼴을 불러오지 않아요.

## 필요한 도구만 기존 프로젝트에 추가

```tsx
import {
  ThemeProvider,
  Presentation,
  BrowserFrame,
  CodeExample,
  PlaybackControls,
  usePlayback,
} from 'seria-ui';
import 'seria-ui/styles.css';

const chapters = [
  { id: 'layout', label: '구성' },
  { id: 'color', label: '색상' },
];

export function Introduction() {
  const playback = usePlayback({ items: chapters, autoPlay: true, duration: 6200 });
  return (
    <ThemeProvider surface="inherit" accent="#68783e">
      <Presentation
        ref={playback.regionRef}
        aria-label="내 서비스 소개"
        headerOffset="64px"
        heading={<h1>나의 페이지를 시작하세요.</h1>}
        controls={
          <PlaybackControls
            items={chapters}
            activeId={playback.activeId}
            progress={playback.progress}
            playing={playback.playing}
            completed={playback.completed}
            onPlayingChange={playback.setPlaying}
            onActiveChange={playback.select}
            onReplay={playback.replay}
            onInteractionChange={playback.setInteracting}
          />
        }
        actions={<a href="#start">시작하기</a>}
      >
        <BrowserFrame label="내 페이지" viewportLabel="내 페이지 미리보기">
          <p>{playback.activeId === 'layout' ? '나의 구성' : '나의 색상'}</p>
        </BrowserFrame>
        <CodeExample inline description="요소 사이의 간격을 일정하게 맞춰요.">
          {'<Stack gap={6} />'}
        </CodeExample>
      </Presentation>
    </ThemeProvider>
  );
}
```

`Presentation`은 내용이 짧으면 남는 화면 높이를 사용해 재생부를 하단으로 보내요.
작은 화면이나 확대 상태에서 내용이 길어지면 섹션도 늘어나며 내용을 가리지 않아요.
`heading`, `controls`, `actions`와 본문을 원하는 UI로 바꿀 수 있어요.
`BrowserFrame`은 기본 높이 `28rem`이며 `height`, `toolbar`와 `classNames`로 조정해요.
`CodeExample`은 인라인 태그 또는 여러 줄 코드를 받고 설명을 접근성 속성으로 연결해요.
`annotations={[{ name: '<Stack>', description: '내용을 세로로 묶는 레이아웃이에요.' }]}`로 태그 자체의 역할도 설명할 수 있어요. 설정값 설명은 `description`에 따로 적어요.
코드는 텍스트로 전달하며 HTML 실행이나 임의 구문 변환을 하지 않아요.

### 재생과 설명 전환

`usePlayback`의 `playing`은 재생 요청 상태, `running`은 실제 시계가 진행 중인 상태예요.
`regionRef`를 표시 영역에 붙이면 화면 밖에서 멈추며 비활성 탭과 컨트롤 조작 중에도 시간을 소비하지 않아요.
마지막 장면에서 멈추고 `completed=true`가 되며 `replay()`로 처음부터 다시 볼 수 있어요.
`select(id)`는 해당 장면으로 이동하고 정지해요. 항목 id 순서를 바꾸면 첫 장면으로 돌아가요.
항목 id는 중복 없이 지정하세요. 빈 목록은 재생하지 않아요.

기본은 수동 재생이며 `autoPlay: true`로 자동 시작을 선택해요.
모션 감소 설정에서는 자동 시작을 생략하지만 사용자가 직접 재생할 수 있어요.
소개 사이트처럼 자동 순차 설명을 유지하려면 `respectReducedMotion: false`를 명시하고 공간 이동은 CSS에서 줄이세요.

```tsx
const caption = useSceneTransition(playback.index);
// caption.presentedIndex의 문구를 렌더링해요.
// caption.leaving, caption.direction, caption.reducedMotion으로 CSS 전환을 연결해요.
```

기본 나가기 시간은 360ms, 모션 감소 환경에서는 280ms예요.
`exitDuration`, `reducedExitDuration`으로 CSS와 시간을 맞추세요.
빠르게 장면을 고르면 오래된 예약 전환을 취소하고 가장 최근 선택만 표시해요.
전체 소개 프로젝트에는 이 상태에 연결된 실제 페이드·이동 스타일이 들어 있어요.

### 배치 변경과 미리보기

```tsx
const layoutRef = useLayoutTransition(layout);
// <div ref={layoutRef}><div data-layout-root><div data-layout-grid>
//   <article data-layout-item>...</article>
// </div></div></div>

<div style={{ height: 500, display: 'flex' }}>
  <PreviewCanvas width={900} responsive mode="width" comfortable>
    <MyPage />
  </PreviewCanvas>
</div>;
```

`useLayoutTransition`은 같은 노드를 유지하고 위치 차이를 900ms 동안 보간해요.
다른 HTML 구조에는 `rootSelector`, `layoutSelector`, `itemsSelector`, `duration`을 전달하세요.
소개 예제의 첫 배치 변경은 `Spaces layout="reverse"`로 좌우를 바꿔요. Spaces는 Seria 요소를 조합한 예제 페이지이며 라이브러리의 별도 기본 태그는 아니에요. 글과 사진을 계속 유지해 위치만 보간하고 투명도는 바꾸지 않아요. 좁은 화면에서는 제목부터 읽는 한 열 순서를 유지해요.
모션 감소 환경에서는 이 추가 이동을 생략해요. 이미지를 불러오거나 요소를 자동으로 추가하지 않아요.

`PreviewCanvas`의 부모에는 높이를 지정하세요. `responsive`는 현재 공간에서 다시 배치하며,
`mode="width"`는 너비에 맞춰 읽기, `mode="page"`는 전체 맞춤, `mode="actual"`은 실제 크기예요.
`zoom`으로 배율을 정하고 `onMetricsChange`로 실제 너비·배율·전체 보기 여부를 받아요.
`comfortable`은 충분히 크게 볼 수 있을 때만 전체를 맞추고 그 외에는 읽기 크기를 유지해요.
미리보기 배율은 사용자가 내보내는 페이지에 강제하지 않아요.

### 섹션 이동

```tsx
useSectionScroll({
  sectionSelector: '[data-pui-section]',
  headerSelector: '.my-header',
});
// <section data-pui-section id="intro">...</section>
// <section data-pui-section id="start">...</section>
```

페이지 소유 컴포넌트에서 한 번만 사용하세요. 명시한 섹션만 대상으로 해요.
`enabled: false`로 끄거나 `headerOffset`으로 고정 오프셋을 줄 수 있어요.
기본 전환 시간은 950ms, 모션 감소에서는 즉시 이동하며 `duration`, `reducedDuration`으로 바꿀 수 있어요.
PC에서는 휠과 PageUp·PageDown이 같은 정렬 위치를 사용해요. 작은 높이 초과 때문에 자동 이동이 풀리지 않으며, 긴 섹션은 화면 단위의 읽기 위치를 거쳐 다음 섹션으로 이어져요.
긴 모바일 섹션 안에서는 자유롭게 읽고 경계에서 다음 섹션으로 이어져요.
`compactQuery`의 기본값은 `(max-width: 1000px)`이며, 이 화면 범위에서 모바일 읽기 방식을 사용해요.
반대 방향 입력·직접 스크롤바 조작·방향키는 이동을 중단할 수 있어요.
입력 요소·모달·내부 스크롤은 그대로 유지해요. 전역 CSS 스냅과 함께 사용하지 마세요.

## 기술과 적용 범위

React와 React DOM, Headless UI, TypeScript, Vite를 사용해요. Tailwind나 Catalyst는 필요하지 않아요.
크기 관찰은 ResizeObserver, 화면 진입은 IntersectionObserver, 위치 전환은 Web Animations,
스크롤은 브라우저 이벤트와 requestAnimationFrame, 파일 저장은 Blob과 다운로드 링크를 사용해요.
별도 AI·플랫폼 API나 원격 UI 서비스에 연결하지 않아요.

전체 소개 디자인의 `studio.css`는 페이지용 스타일이라 body·html·사이트 서체를 포함해요.
기존 서비스에는 이 파일을 통째로 적용하지 말고 `seria-ui/styles.css`와 필요한 API만 가져오세요.
현재 라이브러리는 React 웹용이고 CSS 토큰은 다른 웹 환경에서도 사용할 수 있어요.
네이티브 앱용 컴포넌트를 제공하는 것은 아니에요.

색상과 유리·간격 등 전체 토큰은 [토큰 안내](./tokens.md), 기존 프로젝트 적용은 [적용 안내](./adoption.md)를 보세요.
라이선스와 원작자 Sie 표기는 전체 시작 프로젝트에도 포함돼요.
