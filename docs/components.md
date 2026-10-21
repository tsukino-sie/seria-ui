# Component Primitives

모든 컴포넌트는 `seria-ui`에서 가져와요. `seria-ui/styles.css`는 한 번 불러와요.

| 구분        | 컴포넌트                                                             |
| ----------- | -------------------------------------------------------------------- |
| 기본 요소   | `Button`, `Input`, `Select`, `Card`, `Dialog`, `Dropdown`            |
| 입력과 상태 | `Field`, `Toggle`, `Segmented`, `Badge`                              |
| 정보        | `Table`, `Stat`, `MetricStrip`, `EmptyState`                         |
| 구역        | `PageHeader`, `Section`, `Grid`, `Hero`, `BlockGrid`, `FeatureBlock` |
| 탐색        | `PanelShell`, `SiteShell`, `NavItem`                                 |
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
