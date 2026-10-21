# Motion Guidelines

움직임은 조작 결과를 알리는 데 사용해요. 장식용 반복 애니메이션은 기본으로 넣지 않아요.

| 토큰                | 시간  | 용도                           |
| ------------------- | ----- | ------------------------------ |
| `--pui-motion-fast` | 120ms | 버튼 눌림, 입력 경계, Dropdown |
| `--pui-motion-base` | 180ms | hover 배경, 토글               |
| `--pui-motion-slow` | 260ms | 새 화면이나 카드의 등장        |

기본 easing은 `--pui-ease`, 등장은 `--pui-ease-enter`를 사용해요.
이동량은 `--pui-motion-distance`, 기본 4px예요.

## Hover와 Focus

- Hover는 배경과 테두리로 표시해요. 버튼이나 카드 전체를 확대하지 않아요.
- 버튼은 누르는 동안 1px 내려가요. 클릭 이후에 계속 떠 있지 않아요.
- Focus 표시는 바로 나타나요. 기본 두께는 3px, 간격은 3px예요.
- 작업이 없는 카드는 hover로 움직이지 않아요.

## 화면과 카드 전환

```tsx
<div key={page} data-motion="enter">
  <CurrentPage />
</div>
```

새로 표시되는 구역에만 `data-motion="enter"`를 붙여요.
같은 구역의 값이 바뀔 때마다 다시 실행하지 않도록 키를 안정적으로 유지해요.
카드가 여러 개라도 순차 등장으로 읽기를 지연시키지 않아요.

Dropdown은 열고 닫을 때 짧게 전환해요. 애니메이션이 끝나기를 기다려야 조작할 수 있는 구조는 사용하지 않아요.

## 모션 감소

`prefers-reduced-motion: reduce`에서는 등장 효과와 전환을 제거해요.
초점 표시, 상태 변화, 메뉴 열기와 닫기 자체는 그대로 동작해요.
투명도 감소 설정과 모션 감소는 별개로 처리해요.
