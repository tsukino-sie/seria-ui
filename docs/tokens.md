# Design Tokens

토큰의 원본은 `src/tokens.css`예요. `styles.css`를 불러오면 함께 적용돼요.
토큰만 필요하면 `seria-ui/tokens.css`를 가져와요.

## 색상

| 토큰                 | 라이트    | 다크      | 용도            |
| -------------------- | --------- | --------- | --------------- |
| `--pui-bg`           | `#f0f3f5` | `#10191f` | 페이지          |
| `--pui-panel`        | `#ffffff` | `#19262f` | 카드와 대화상자 |
| `--pui-inset`        | `#edf2f4` | `#202f39` | 안쪽 구역       |
| `--pui-ink`          | `#203641` | `#edf4f8` | 본문            |
| `--pui-muted`        | `#536975` | `#adbec9` | 설명            |
| `--pui-line`         | `#d6e2e8` | `#344752` | 구역 경계       |
| `--pui-control-line` | `#8096a2` | `#718b9a` | 입력 경계       |
| `--pui-accent`       | `#6ccdee` | `#6ccdee` | 강조 배경       |
| `--pui-accent-ink`   | `#125a73` | `#9fe0f6` | 강조 글자       |

상태는 `success`, `warning`, `danger`와 해당 `*-bg` 쌍을 사용해요.
색상을 바꾸면 글자와 배경을 함께 확인해요. `npm run check:contrast`는 제공 토큰 기준의 대비를 검사해요.

## 간격과 곡률

- 간격: `--pui-space-1`부터 `--pui-space-8`까지 4px 단위로 4–32px예요.
- 구역 사이: `--pui-space-section`, 기본 28px, 모바일 24px예요.
- 카드 안쪽: `--pui-space-card`, 기본 24px, 모바일 20px예요.
- 카드: `--pui-radius`, 기본 28px, 모바일 24px예요.
- 입력: `--pui-radius-control`, 14px예요.
- 작은 요소: `--pui-radius-compact`, 12px예요.
- 둥근 버튼: `--pui-radius-pill`, 999px예요.

그림자는 `--pui-shadow`와 `--pui-shadow-raised`를 제공해요.
기본 카드는 경계로 구분하고, 높은 그림자는 메뉴나 대화상자에 사용해요.

## 글꼴

`--pui-font`는 시스템 글꼴을 기본으로 사용해요. 외부 폰트를 요청하지 않아요.

| 토큰                 | 기본 크기 |
| -------------------- | --------- |
| `--pui-text-xs`      | 11px      |
| `--pui-text-sm`      | 13px      |
| `--pui-text-base`    | 14px      |
| `--pui-text-lg`      | 16px      |
| `--pui-text-heading` | 20px      |
| `--pui-text-title`   | 36px      |
| `--pui-text-hero`    | 40px      |

페이지 제목과 메인 제목은 화면 너비에 따라 작아져요.

## 사용자·플랫폼별 변경

강조색을 전달하면 버튼 글자색, hover 색상, 옅은 배경과 강조 글자색을 함께 계산해요.
강조색은 #RGB 또는 #RRGGBB 형식이에요. 기본 색상에 고정되어 있지 않아요.

```tsx
<ThemeProvider
  accent={userSettings.accent}
  storageKey={`seria:${platform.id}:${user.id}`}
  themes={{
    light: { '--pui-bg': '#f2f1f5' },
    dark: { '--pui-bg': '#18151d' },
  }}
>
  <App />
</ThemeProvider>
```

테마별 토큰은 themes, 두 테마에 공통으로 덮어쓸 값은 style에 넣어요.
값은 해당 ThemeProvider 안에만 적용되고 Dialog와 Dropdown 포털에도 전달돼요.
인증이나 사용자 설정의 저장은 사용하는 서비스에서 연결해요.
예제의 설정 화면에서는 강조색을 직접 고르고 기본값으로 되돌릴 수 있어요.

강조색 자동 계산은 기본 표면을 기준으로 해요. 배경과 글자까지 직접 바꾸면 대비를 다시 확인해요.

전체 유리 효과를 끄려면 상위 영역에 data-pui-effects="off"를 지정해요.
브라우저가 blur를 지원하지 않거나 투명도 감소 설정이면 불투명 배경을 사용해요.
