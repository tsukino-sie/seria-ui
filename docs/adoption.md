# 같은 품질로 시작하고, 기존 화면을 지키며 적용하기

Seria는 React 웹 UI 시스템입니다. 특정 서비스·기업의 화면을 강제하지 않으며, 다른 프레임워크에서는 CSS 토큰을 활용할 수 있습니다.
서체 선택·다운로드, 문구, 이미지, API, 인증과 라우팅은 프로젝트에서 관리합니다.

## 새 페이지

처음에는 [쇼케이스](https://seria-ui-studio.honey-puppy-6755.chatgpt.site/#start)의 전체 시작 파일을 받는 방법이 간단합니다.
React 실행 환경, 같은 버전의 Seria 패키지, 세 가지 구성과 소개 이미지가 함께 들어 있습니다.
압축을 풀고 `npm install`, `npm run dev`를 실행하세요. `npm run build`는 타입 검사와 정적 빌드를 실행합니다.

`src/StarterPage.tsx`에서 소개·콘텐츠·업무 구성을 바꾸고, `Spaces.tsx`와 `spaces.css`에서 소개 예제의 디자인을 편집합니다.
이 파일은 쇼케이스가 직접 사용하는 원본입니다. 별도로 축약한 예시 구현이 아닙니다.
`src/theme.ts`는 선택적인 예제 팔레트이며, 새로운 프로젝트에서 원하는 색으로 바꿔도 됩니다.
이미지와 서체, 예제의 이름은 실제 서비스의 것으로 바꾸세요. 특정 플랫폼 계정이나 호스팅은 필요하지 않습니다.

## 기존 페이지

원래 화면의 제목, 콘텐츠, 배경, 서체와 동작을 기준으로 놓고 컴포넌트를 하나씩 연결합니다.
Hero나 SiteShell로 기존 페이지 전체를 감싸는 것만으로 디자인이 자동으로 옮겨지지는 않습니다.

```tsx
import { ThemeProvider, Columns, FeatureBlock, Button } from 'seria-ui';
import 'seria-ui/styles.css';

// 기존 프로젝트가 선택한 서체와 배경을 유지합니다.
<ThemeProvider surface="inherit" accent="#3678b2" storageKey="my-service:theme">
  <Columns min="18rem" gap={8}>
    <FeatureBlock
      title={existingTitle}
      description={existingDescription}
      glass="soft"
      actions={<Button onClick={existingAction}>기존 작업</Button>}
    >
      {existingPreview}
    </FeatureBlock>
  </Columns>
</ThemeProvider>;
```

- `surface="inherit"`: 기존 배경·본문 크기·행간을 유지합니다. 새 화면의 배경까지 맡길 때만 기본 `canvas` 모드를 사용합니다.
- `Stack`·`Cluster`·`Columns`: 내용의 묶음과 배치에 사용합니다. 같은 간격을 자식마다 따로 지정하지 않습니다.
- `Hero layout="split"`: 제목과 이미지의 좌우 구성을 실제 가용 너비에 맞춰 세로로 바꿉니다. `visual`을 생략하면 제목 영역만 표시합니다.
- `Hero tone="transparent"`: 배경을 추가하지 않습니다. `ambient`는 은은한 색상, `glass`는 투명 재질을 명시적으로 선택합니다.
- `PageSection`: 페이지 단위의 안쪽 여백, 읽는 폭과 제목·본문 사이 간격을 함께 관리합니다.
- `MediaFrame`: 자신의 이미지·영상·SVG를 넣고 비율과 캡션을 지정합니다. 이미지 공급자나 서비스에 의존하지 않습니다.

기존 프로젝트의 모션을 Seria의 등장 효과로 바꾸지 마세요. 스크롤 카드 덱처럼 콘텐츠를 이해하는 데 필요한 동작은 그대로 연결하고, 장식적인 움직임만 모션 감소 설정에 맞춰 줄입니다.
기존 테마 토글이 있다면 Seria 테마 상태와 연결하고, 독립적인 토글을 하나 더 만들지 않습니다.
대화상자처럼 포털을 사용하는 요소는 ThemeProvider의 테마 토큰을 전달받습니다.

기존 CSS가 `.pui-*`를 덮어쓰고 있다면 먼저 어떤 이유로 추가되었는지 확인하세요.
제목·이미지 배치와 배경을 옵션으로 해결할 수 있으면 예전 버전용 우회 CSS를 중복 적용하지 않습니다.
조정 후 같은 콘텐츠로 넓은 화면·좁은 패널·모바일, 라이트·다크, 키보드 포커스와 원래 동작을 비교합니다.

## 버전이 어긋나지 않게 유지하기

`npm ls seria-ui`로 실제 설치 버전을 확인합니다. 로컬의 다른 Seria 폴더가 최신이어도 이미 복사한 tgz는 갱신되지 않습니다.
1.3에서 옮길 때는 서체 상속, `surface="inherit"`, 제목 내부 span의 색상 처리, 새 배치 요소가 달라집니다.
패키지와 스타일을 함께 교체하고 위의 기존 화면 비교를 진행하세요.

이 저장소의 `npm run package:release`는 라이브러리를 빌드하고 다음 파일을 같은 버전으로 만듭니다.

- `seria-ui-VERSION.tgz`: 라이브러리와 편집 가능한 examples 소스
- `seria-ui-starter-VERSION.tar.gz`: 실행 가능한 React 시작 프로젝트와 같은 패키지
- `release.json`: 버전과 두 파일의 SHA-256

쇼케이스를 빌드하기 전에 이 명령을 실행하세요. 다운로드 버전은 `SERIA_VERSION`을 사용하며, 패키지 버전이 다르면 생성이 실패합니다.
CI는 패키지를 새 소비자 프로젝트에 설치하고 예제 타입 검사와 빌드까지 실행합니다.
GitHub 소스와 사이트가 서로 다른 버전이면 최신 배포라고 안내하지 않습니다.
