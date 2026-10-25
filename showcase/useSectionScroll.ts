import { useSectionScroll as usePageScroll } from 'seria-ui';
export default function useSectionScroll() {
  usePageScroll({
    sectionSelector: '.showcase-section',
    headerSelector: '.studio-header',
    reducedDuration: 760,
  });
}
