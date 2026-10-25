import { useLayoutTransition } from 'seria-ui';
export default function usePreviewLayout(scene: number) {
  return useLayoutTransition(scene, {
    rootSelector: '.editorial-page',
    layoutSelector: '.editorial-composition',
    itemsSelector: '.editorial-copy, .editorial-visual, .editorial-lower > *',
  });
}
