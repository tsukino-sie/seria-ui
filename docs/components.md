# Component Primitives

모든 컴포넌트는 `seria-ui`에서 가져와요. `seria-ui/styles.css`는 한 번 불러와요.

| 구분        | 컴포넌트                                                             |
| ----------- | -------------------------------------------------------------------- |
| 기본 요소   | `Button`, `Input`, `Select`, `Card`, `Dialog`, `Dropdown`            |
| 입력과 상태 | `Field`, `Toggle`, `Segmented`, `Badge`                              |
| 정보        | `Table`, `Stat`, `MetricStrip`, `EmptyState`                         |
| 구역        | `PageHeader`, `Section`, `Grid`, `Hero`, `BlockGrid`, `FeatureBlock` |
| 탐색        | `PanelShell`, `SiteShell`, `NavItem`, `PlaybackControls`             |
| 테마        | `ThemeProvider`, `ThemePicker`, `useTheme`                           |

`Surface`는 `Card`, `Modal`은 `Dialog`와 같은 컴포넌트예요. 기존 이름도 사용할 수 있어요.

## 버튼과 입력

Button은 `primary`, `secondary`, `quiet`, `danger`를 지원해요.
한 구역에서 주요 작업 하나만 `primary`로 표시해요. 아이콘 버튼에는 `aria-label`을 넣어요.

```tsx
<Field label="연결 이름" hint="목록에 표시할 이름이에요.">
  {(props) => <Input {...props} value={name} onChange={(e) => setName(e.target.value)} />}
</Field>
```

`Field`는 입력의 id, 설명, 오류 문구를 연결해요. `error`를 전달하면 오류 상태가 적용돼요.
Select는 값 선택, Dropdown은 작업 메뉴에 사용해요.

```tsx
<Dropdown
  label="더 보기"
  items={[
    { id: 'edit', label: '이름 변경', onSelect: openEditor },
    { id: 'archive', label: '보관', disabled: true, onSelect: archive },
  ]}
/>
```

Dropdown은 방향키로 항목을 이동하고 Escape로 닫아요. 비활성 항목은 선택하지 않아요.

## 카드와 대화상자

```tsx
<Card glass="soft">내용</Card>
<Dialog open={open} onClose={() => setOpen(false)} title="변경할까요?"
  actions={<Button onClick={save}>저장</Button>}>
  <p>변경할 내용을 확인해요.</p>
</Dialog>
```

Dialog와 모바일 메뉴는 포커스를 내부에 유지해요. Escape로 닫히면 이전 버튼으로 돌아가요.
Card는 기본적으로 동작이 없는 구역이에요. 작업에는 별도의 버튼이나 링크를 넣어요.

## 레이아웃

`PanelShell`은 메뉴가 많은 관리 화면, `SiteShell`은 상단 탐색 화면에 사용해요.
모바일에서는 메뉴를 대화상자로 열어요. `NavItem`은 선택 후 모바일 메뉴를 닫아요.

Hero는 제목 아래에 `children`을 전체 너비로 배치해요. 이미지를 자동으로 옆에 두지 않아요.
`FeatureBlock`의 `span="wide"`는 그리드 두 칸을 사용하고, 모바일에서는 한 칸이 돼요.
Table은 좁은 화면에서 표 영역 안에서만 가로로 스크롤해요.

## 적용 범위

테마, 색상, 간격은 모듈이 담당해요. 인증, 권한 검사, 저장, API 요청은 사용하는 프로젝트에서 연결해요.
`Segmented`는 선택 버튼 묶음이에요. 패널을 전환하는 ARIA 탭 컴포넌트는 아니에요.

## 자유롭게 조합하기 (1.4)

정해진 페이지 대신 작은 배치 요소부터 조합할 수 있어요.

| 요소        | 역할                                | 주요 설정                                 |
| ----------- | ----------------------------------- | ----------------------------------------- |
| `Container` | 내용의 최대 너비와 가운데 정렬      | `width="reading / content / wide / full"` |
| `Stack`     | 세로 배치와 일정한 간격             | `gap={0…8}`, `align`                      |
| `Cluster`   | 줄바꿈 가능한 가로 배치             | `gap={0…8}`, `align`, `justify="between"` |
| `Columns`   | 주어진 너비에 맞춰 자동으로 열 배치 | `min="16rem"`, `gap={0…8}`                |

`gap`은 간격 토큰 번호예요. `0`은 간격 없음, `1…8`은 4…32px예요.
`align`은 `start`, `center`, `end`, `stretch`를 지원해요. `Cluster`의 `justify`는 `start`, `center`, `end`, `between`을 지원해요.
`Container`의 기본 최대 너비는 wide 1200px, content 960px, reading 680px예요. full은 제한이 없어요. 외부 여백은 프로젝트에서 지정해요.
`Columns`는 화면 전체가 아닌 실제 놓인 영역의 너비에 맞춰 줄바꿈해요. 모바일 미리보기나 좁은 사이드 패널에서도 같은 규칙을 사용해요.

```tsx
import { ThemeProvider, Container, Stack, Cluster, Columns, Hero, Card, Button } from 'seria-ui';
import 'seria-ui/styles.css';

<ThemeProvider surface="inherit" accent="#26745d">
  <Container>
    <Stack gap={8}>
      <Hero
        tone="ambient"
        align="start"
        title="나만의 첫 페이지"
        description="이곳에 당신의 이야기를 담으세요."
        actions={
          <Button size="lg" variant="primary">
            시작하기
          </Button>
        }
      />
      <Columns min="16rem" gap={4}>
        <Card>
          <Stack gap={3}>
            <h2>발견한 순간</h2>
            <p>나의 콘텐츠를 넣어요.</p>
          </Stack>
        </Card>
        <Card tone="accent" elevation="raised">
          <Cluster justify="between">
            <strong>다음 이야기</strong>
            <span>↗</span>
          </Cluster>
        </Card>
      </Columns>
    </Stack>
  </Container>
</ThemeProvider>;
```

Hero의 `tone`은 `plain`(기본), `ambient`, `transparent`, `align`은 `center`(기본), `start`예요. `headingLevel={1 | 2 | 3}`으로 문서 위계에 맞춰 선택해요.
1.6부터 `layout="split"`과 `visual`을 함께 전달하면 제목과 미디어가 좌우로 배치돼요. 화면 전체가 아닌 실제 가용 공간이 좁아지면 세로로 이어져요. 기본 `layout="stack"`은 기존 상하 구성을 유지해요.
`glass="soft | clear"`는 배경 재질을 명시적으로 선택해요. tone과 함께 사용하면 glass 재질을 우선하고, 투명도 감소·효과 끄기 설정에서는 불투명 배경을 사용해요.
Hero 제목은 전달한 span이나 로고의 색상을 강제하지 않아요. 서체는 프로젝트에서 상속해요.
Card/Surface는 `tone="default | subtle | accent"`, `elevation="flat | raised"`를 지원해요. `glass`는 별도로 선택해요.
Button의 `size="sm | md | lg"`는 최소 높이 36·44·52px을 제공해요. 기본은 md예요.

## 페이지 간격과 미디어 (1.6)

```tsx
<PageSection title="새로운 이야기" description="나의 내용을 담으세요." spacing="comfortable">
  <Hero
    layout="split"
    tone="transparent"
    align="start"
    headingLevel={3}
    title="여백이 만드는 좋은 구성."
    visual={
      <MediaFrame ratio="4 / 3" caption="이미지에 대한 나의 설명">
        <img src="/my-image.jpg" alt="이미지의 내용을 설명하세요." />
      </MediaFrame>
    }
  />
</PageSection>
```

PageSection은 투명한 페이지 구역이에요. `width`는 Container와 같으며, `spacing="compact | comfortable | spacious"`는 여백의 크기를 정해요. 연속된 PageSection은 경계에서 여백을 중복하지 않아요.
`title`, `eyebrow`, `description`, `actions`는 선택 사항이며 `headingLevel={2 | 3}`으로 제목 위계를 정해요. 제목이 있으면 구역의 접근성 이름으로 연결해요. 제목 없이 사용하면 필요에 따라 `aria-label`을 전달하세요.
MediaFrame은 이미지·영상·SVG를 넣는 figure예요. `ratio="4 / 3"`, `fit="cover | contain"`, 선택적인 `caption`을 지원해요. 캡션은 미디어 아래에 표시해서 사진 밝기에 따라 읽기 어려워지지 않아요. img의 alt나 video의 자막은 프로젝트에서 제공하세요.
공개 타입은 `HeroProps`, `PageSectionProps`, `MediaFrameProps`, `Space`예요.
[편집 가능한 세 가지 구성](../examples/README.md) · [기존 페이지 적용 안내](./adoption.md)

## 기존 페이지에 적용하기

`ThemeProvider surface="inherit"`는 기존 배경·본문 색상·본문 크기·행간·네이티브 색상 체계를 유지하면서 Seria 토큰과 컴포넌트만 추가하는 방식이에요.
기본 `surface="canvas"`는 새 화면에 배경·본문 기본값과 최소 높이를 적용해요. `PanelShell`과 `SiteShell`은 자체 레이아웃과 배경을 가진 완성형 셸이므로 기존 레이아웃을 유지할 때는 배치 요소부터 사용해요.
일반 제목·문단·링크의 여백과 색상을 일괄 초기화하지 않아요. Seria 컴포넌트가 직접 렌더링하는 제목과 설명에는 해당 요소의 스타일을 적용해요.
`Stack`은 묶음의 간격을 관리하기 위해 바로 아래 자식의 위아래 margin을 0으로 만들어요. 기존 마진을 그대로 유지해야 하는 콘텐츠는 내부 div로 감싸세요.

1.4부터 기존 제목·문단의 기본 브라우저 여백이 보일 수 있어요. 이전의 일괄 초기화에 의존했다면 프로젝트의 스타일이나 Stack에서 간격을 지정하세요.
Seria가 임의의 기존 CSS와 충돌하지 않는다고 보장할 수는 없어요. 처음에는 한 구역에 적용한 뒤 배경, 기존 폼, 포털과 좁은 화면을 확인하세요.

## 재생과 구간 이동 (1.5)

`PlaybackControls`는 진행 바, 구간 선택과 재생/일시 정지를 하나의 캡슐에 배치해요. 상위 테마의 라이트·다크와 강조색을 따르고 글꼴은 프로젝트에서 상속해요.

```tsx
import { useState } from 'react';
import { ThemeProvider, PlaybackControls, type PlaybackItem } from 'seria-ui';
import 'seria-ui/styles.css';

const chapters = [
  { id: 'intro', label: '하나의 시작' },
  { id: 'layout', label: '레이아웃' },
  { id: 'style', label: '나의 스타일' },
] satisfies readonly PlaybackItem[];

export function ChapterNavigation({ progress }: { progress: number }) {
  const [activeId, setActiveId] = useState('intro');
  const [playing, setPlaying] = useState(false);
  const [exploring, setExploring] = useState(false);

  // 프로젝트의 타이머는 playing && !exploring일 때 진행하세요.
  // 화면 밖·비활성 탭에서는 타이머를 멈추고, 구간 변경 시 진행률을 초기화하세요.
  return (
    <ThemeProvider accent="#795cc0" surface="inherit">
      <PlaybackControls
        items={chapters}
        activeId={activeId}
        playing={playing}
        progress={progress}
        onPlayingChange={setPlaying}
        onInteractionChange={setExploring}
        onActiveChange={(id) => {
          setActiveId(id);
          setPlaying(false);
          // 필요한 콘텐츠 전환이나 scrollIntoView를 여기서 연결하세요.
        }}
      />
    </ThemeProvider>
  );
}
```

| 설정                                   | 의미                                                                                            |
| -------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `items`                                | 고유하고 안정적인 `id`, 표시할 `label`, 선택적인 `disabled` 목록                                |
| `activeId` / `onActiveChange(id)`      | 현재 구간과 사용자가 선택한 구간. 콘텐츠 전환·스크롤은 프로젝트에서 연결                        |
| `playing` / `onPlayingChange(boolean)` | 재생 의도와 재생/정지 요청. 컴포넌트는 자체 타이머를 실행하지 않음                              |
| `progress`                             | 현재 구간의 0…1 진행률. 범위를 벗어나면 제한하고 유효하지 않은 숫자는 0으로 표시                |
| `onInteractionChange(boolean)`         | 제목을 탐색하는 동안 true. 이때 타이머를 일시 정지할 수 있음                                    |
| `disabled`                             | 전체 조작 비활성화                                                                              |
| `respectReducedMotion`                 | 기본 true. 시스템 모션 감소 시 자동 시작을 억제하고 재생 정지를 요청함. 직접 누르는 재생은 허용 |
| `labels`                               | 그룹 이름, 재생·정지·모션 감소·터치 안내, `goTo(label)` 접근성 이름을 번역                      |
| `style` / `className`                  | 개별 색상 토큰과 프로젝트 스타일. [색상 설정](./tokens.md#재생-컨트롤-15)                       |

호버나 키보드 포커스로 제목을 표시하고 주변 간격을 넓혀요. 클릭은 구간 선택, 터치는 첫 번째에 제목 표시·두 번째에 구간 선택이에요. 방향키는 비활성 항목을 건너뛰며 순환하고 Home/End는 처음/끝, Escape는 제목 닫기예요.
빈 목록은 표시하지 않아요. `activeId`가 목록에 없으면 첫 활성 항목을 표시해요. 모든 항목이 비활성이면 첫 항목을 표시하고 전체 재생을 비활성화해요. 선택 항목이 많거나 놓인 곳이 좁으면 줄바꿈하므로 간단한 구간 탐색에 권장해요.

공개 타입은 `PlaybackItem`, `PlaybackControlsProps`, `PlaybackControlsLabels`, `PlaybackControlsStyle`이에요. 기본 라벨은 한국어이며 `labels={{ play: 'Play', pause: 'Pause', goTo: (label) => 'Go to ' + label }}`처럼 필요한 값만 바꿀 수 있어요.
