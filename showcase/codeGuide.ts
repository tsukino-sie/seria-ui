import type { CodeAnnotation } from 'seria-ui';

/** Plain-language notes shared by the intro, tutorials and actual exported source viewer. */
export const codeTags: Record<string, string> = {
  ThemeProvider: '테마 범위 · 안의 요소에 같은 색과 표면을 적용해요.',
  Container: '페이지 너비 · 최대 너비와 좌우 여백을 맞춰요.',
  Stack: '세로 묶음 · 내용을 위에서 아래로 쌓고 간격을 맞춰요.',
  Cluster: '가로 묶음 · 요소를 나란히 놓고 공간이 부족하면 다음 줄로 넘겨요.',
  Columns: '자동 열 배치 · 공간에 맞춰 여러 열 또는 한 열로 놓아요.',
  Hero: '소개 블록 · 제목·설명·버튼을 함께 배치해요.',
  Button: '동작 버튼 · 눌렀을 때 이동·저장 등 프로젝트의 기능을 실행해요.',
  Card: '카드 표면 · 관련 내용을 배경과 여백이 있는 영역으로 묶어요.',
  Surface: '내용 표면 · 카드의 배경·유리·그림자 표현을 정해요.',
  PageSection: '페이지 구역 · 제목과 본문을 묶고 구역의 너비·여백을 맞춰요.',
  MediaFrame: '미디어 틀 · 이미지·영상의 비율과 설명을 함께 배치해요.',
  FeatureBlock: '기능 소개 카드 · 제목·설명·동작을 하나로 묶어요.',
  Stat: '수치 요약 · 이름, 숫자와 짧은 설명을 보여줘요.',
  Badge: '상태 표시 · 진행 중·완료 같은 상태를 짧게 보여줘요.',
  Field: '입력 항목 · 이름, 입력칸, 도움말과 오류 안내를 연결해요.',
  Input: '입력칸 · 사용자가 글이나 값을 입력해요.',
  Select: '선택 목록 · 여러 값 중 하나를 골라요.',
  Toggle: '켜기·끄기 · 설정 하나의 사용 여부를 바꿔요.',
  Dropdown: '펼침 메뉴 · 버튼 아래에 선택할 동작을 보여줘요.',
  Dialog: '대화상자 · 현재 화면 위에서 안내나 작업을 보여줘요.',
  PlaybackControls: '재생 컨트롤 · 진행 상태, 장면 선택과 재생·정지를 한곳에 모아요.',
  Presentation: '소개 화면 · 내용을 보여주고 재생부를 구역 하단에 놓아요.',
  BrowserFrame: '미리보기 창 · 페이지를 창 하나에 담고 안에서 스크롤해 읽어요.',
  PreviewCanvas: '미리보기 배율 · 지정한 너비에서 페이지를 읽거나 전체를 맞춰봐요.',
  CodeExample: '코드 안내 · 코드와 그 역할에 대한 설명을 함께 보여줘요.',
  Spaces: '소개 예제 · Seria 요소로 조합한 이 페이지예요.',
  StarterPage: '예제 선택 · 소개·콘텐츠·업무·컴포넌트 중 고른 구성을 보여줘요.',
  ComponentPage: '컴포넌트 예제 · 버튼·입력·메뉴·대화상자를 직접 써보는 페이지예요.',
  div: '일반 묶음 · 여러 요소를 하나의 배치 단위로 묶어요.',
  span: '짧은 글 묶음 · 문장 일부나 짧은 표시를 감싸요.',
  section: '내용 구역 · 주제가 같은 내용을 한 구역으로 묶어요.',
  article: '독립된 내용 · 카드나 글처럼 따로 읽을 수 있는 내용을 담아요.',
  h1: '페이지 제목 · 페이지의 가장 큰 제목이에요.',
  h2: '구역 제목 · 페이지 안의 주요 구역을 설명해요.',
  h3: '하위 제목 · 구역 안의 작은 내용을 설명해요.',
  p: '문단 · 설명이나 본문을 담아요.',
  a: '링크 · 누르면 다른 페이지나 구역으로 이동해요.',
  button: 'HTML 버튼 · 눌렀을 때 연결한 동작을 실행해요.',
  img: '이미지 · src의 그림을 보여주고 alt로 내용을 설명해요.',
  figure: '그림 묶음 · 이미지나 시각 자료를 설명과 함께 담아요.',
  figcaption: '그림 설명 · 이미지에 붙는 제목이나 설명이에요.',
  header: '머리 영역 · 페이지나 구역의 제목·메뉴를 담아요.',
  footer: '마무리 영역 · 구역의 관련 링크나 출처를 담아요.',
  nav: '탐색 메뉴 · 다른 페이지나 구역으로 이동하는 링크를 묶어요.',
  main: '주요 내용 · 페이지의 핵심 본문이에요.',
  label: '입력 이름 · 입력칸이 무엇을 받는지 알려줘요.',
  input: 'HTML 입력칸 · 글이나 수치를 입력하거나 조절해요.',
  select: 'HTML 선택 목록 · 제공된 값 중 하나를 골라요.',
  option: '선택 항목 · 선택 목록에 들어가는 값 하나예요.',
};

export function describeTags(source: string): CodeAnnotation[] {
  const names = new Set(Array.from(source.matchAll(/<\/?([A-Za-z][\w]*)\b/g), (match) => match[1]));
  return [...names]
    .filter((name) => Object.hasOwn(codeTags, name))
    .map((name) => ({ name: `<${name}>`, description: codeTags[name] }));
}

export function describeFile(file: string): string {
  const descriptions: Record<string, string> = {
    'main.tsx': '앱 시작 파일이에요. 현재 색상·유리·간격 설정과 선택한 예제 페이지를 연결해요.',
    'Page.tsx': '기존 React 프로젝트에서 사용할 페이지예요. 현재 설정과 선택한 구성을 담고 있어요.',
    'StarterPage.tsx': '소개·콘텐츠·업무·컴포넌트 구성을 고르고 실제 내용을 배치하는 원본이에요.',
    'Spaces.tsx': '소개 예제의 제목·설명·사진·카드와 좌우·세로·겹침 배치를 구성하는 원본이에요.',
    'ComponentPage.tsx': '버튼·입력·선택·상태·메뉴·대화상자의 실제 사용 예제예요.',
    'spaces.css': '예제의 배치·여백·이미지 크기·모바일 화면을 정하는 CSS예요.',
    'theme.ts': '예제에서 사용하는 라이트·다크 색상 값이에요. 원하는 색으로 바꿀 수 있어요.',
  };
  return descriptions[file] ?? '이 페이지를 구성하는 편집 가능한 원본 파일이에요.';
}
