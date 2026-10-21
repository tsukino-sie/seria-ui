# Seria UI

개인 웹 패널에서 공통으로 쓰려고 만든 React UI 모듈이에요.
화면마다 따로 정하던 색상, 간격, 컴포넌트와 움직임을 한곳에 모았어요.

라이트·다크·시스템 테마, 상단 메뉴·사이드바 레이아웃을 제공해요.
라이트 배경은 회색에 하늘빛을 조금 더하고 흰 카드로 구분했어요.
기본 카드는 불투명하고, 유리 효과는 필요한 곳에만 켤 수 있어요.
Tailwind나 별도 UI 키트 스타일 없이 사용할 수 있어요.

## 미리보기

| 라이트                                  | 다크                                 |
| --------------------------------------- | ------------------------------------ |
| ![라이트 모드](./screenshots/light.png) | ![다크 모드](./screenshots/dark.png) |

[모바일](./screenshots/mobile.png) · [컴포넌트](./screenshots/components.png) · [사용자](./screenshots/members.png) · [설정](./screenshots/settings.png)

예제의 사용자와 처리 내역은 모두 샘플 데이터예요. 실제 인증이나 서비스 연동은 포함하지 않아요.

## 실행

Node.js 22.12 이상이 필요해요.

```sh
git clone https://github.com/tsukino-sie/seria-ui.git
cd seria-ui
npm ci
npm run dev
```

미리보기는 http://127.0.0.1:5206 에서 열려요.

## 내 프로젝트에 사용

이 저장소에서 빌드한 뒤 패키지 파일을 만들어요.

```sh
npm run build
npm pack
```

사용할 React 프로젝트에서 생성된 `seria-ui-1.3.0.tgz`를 설치해요.
React 18.3 이상 또는 19, Headless UI 2.2 이상과 함께 사용해요.

```sh
npm install /path/to/seria-ui-1.3.0.tgz
```

```tsx
import { ThemeProvider, ThemePicker, Card, Button } from 'seria-ui';
import 'seria-ui/styles.css';

export function App() {
  return (
    <ThemeProvider>
      <Card>
        <h1>내 패널</h1>
        <ThemePicker />
        <Button onClick={() => console.log('저장')}>저장</Button>
      </Card>
    </ThemeProvider>
  );
}
```

유리는 `glass="soft"` 또는 `glass="clear"`로 선택해요.
일반 HTML에도 `data-glass="soft"`를 붙일 수 있어요.

## 색상 바꾸기

`<ThemeProvider accent="#794de8">`처럼 강조색을 전달해요.
사용자·플랫폼별 설정과 라이트·다크 토큰을 따로 연결할 수 있어요. [설정 방법](./docs/tokens.md) · [강조색 예시](./screenshots/theme-purple.png)

## 구성

- **Design Tokens** — 색상, 간격, 곡률, 그림자, 글꼴 크기를 CSS 변수로 관리해요. [토큰](./docs/tokens.md)
- **Component Primitives** — Button, Input, Card, Dialog, Dropdown 등 기본 요소와 레이아웃을 제공해요. [컴포넌트](./docs/components.md)
- **Motion Guidelines** — hover, focus, 전환과 등장 효과의 시간·이동량을 통일해요. 모션 감소 설정도 따라가요. [움직임](./docs/motion.md)

`src/`가 소스이고 `demo/`가 예제예요. 빌드한 모듈은 `dist/`, 정적 예제는 `preview/`에 생성돼요.

```sh
npm run check       # 타입과 기본 색상 대비
npm run build       # 모듈
npm run build:demo  # 정적 예제
npm run format     # 코드 정리
```

## 참고

[Apple](https://www.apple.com/)의 여백과 재질 표현,
[AWS](https://aws.amazon.com/)의 정보 구분,
[Microsoft](https://www.microsoft.com/)의 블록 정렬을 참고했어요.
스타일과 컴포넌트는 별도로 구현했어요. [설계 기준](./DESIGN-REFERENCES.md)

## 이용 조건

원작자는 **Sie**예요. **Sie 원작자 표기를 유지하면 비상업적·상업적 사용, 수정, 재배포가 가능해요.**
원작자 표기는 프로젝트 문서와 소개·크레딧·라이선스 화면처럼 확인할 수 있는 곳에 남겨 주세요.
자세한 조건은 [LICENSE](./LICENSE), 표기 방법은 [NOTICE](./NOTICE)를 확인해 주세요.
외부 라이브러리는 [각 라이선스](./THIRD-PARTY-NOTICES.md)를 따라요.
출처 정보는 패키지와 화면 구조에도 포함해요. [출처 표기](./docs/provenance.md)
