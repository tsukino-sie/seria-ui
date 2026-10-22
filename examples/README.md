# 편집 가능한 시작 구성

소개, 콘텐츠·기록, 업무·도구, 컴포넌트의 네 조합입니다. 쇼케이스가 이 파일을 직접 렌더링합니다.
미리보기에서만 사용하는 별도 구현을 복사할 필요가 없습니다.

[전체 시작 파일](https://seria-ui-studio.honey-puppy-6755.chatgpt.site/#start)을 받으면 React 실행 환경, 같은 버전의 Seria 패키지, 스타일과 이미지가 함께 들어 있습니다.
압축을 풀고 `npm install`, `npm run dev`를 실행하세요. 배포 파일은 `npm run build`로 만듭니다.

기존 프로젝트에는 `StarterPage.tsx`, `Spaces.tsx`, `ComponentPage.tsx`, `spaces.css`, `theme.ts`를 함께 복사하세요.
`seria-ui/styles.css`를 한 번 불러오고 ThemeProvider 안에 StarterPage를 배치합니다.
Spaces 예제의 `/images/seria-space.png` 경로에 자신의 이미지를 두세요. 제공된 이미지는 시작 파일에도 들어 있습니다.
`theme.ts`의 색상과 예제 내용은 선택 사항입니다. 실제 서비스의 이름, 문구와 이미지를 넣어주세요.

서체는 프로젝트에서 지정합니다. API, 인증, 라우팅과 서버 저장은 포함하지 않으며 `onAction`, `onSave`에 연결합니다.

예제의 기본 `material="glass"`를 `solid` 또는 `open`으로 바꿀 수 있어요. 소개 예제의 `layout="split | stack | cover"`는 내용 배치를 정해요. 전역 배경은 `example-backdrop` 클래스와 `data-backdrop="light | paper | grid"`로 문서 높이에 맞춰 이어집니다.
플레이그라운드는 전체 페이지를 축소해 보여주며, 복사한 페이지 자체는 본래 크기로 렌더링됩니다. 미리보기 전용 맞춤 배율은 페이지 소스에 강제하지 않아요.
기존 페이지를 옮길 때는 [적용 안내](../docs/adoption.md)를 먼저 읽어주세요.
