// Browser verification fixture. This entry is excluded from the showcase production build.
import { createRoot } from 'react-dom/client';
import { ThemeProvider, Card, Button, Columns } from '../src/index';
import '../src/styles.css';
const content = (
  <>
    <h1>기존 페이지 제목</h1>
    <p>문단의 여백과 글꼴을 유지합니다.</p>
    <a href="#example">기존 링크</a>
    <input aria-label="기존 입력" defaultValue="프로젝트 서체" />
  </>
);
createRoot(document.getElementById('root')!).render(
  <>
    <section id="before" className="existing-page">
      {content}
    </section>
    <ThemeProvider surface="inherit" accent="#795cc0" style={{ '--pui-radius': '17px' }}>
      <section id="after" className="existing-page">
        {content}
      </section>
      <Columns min="14rem">
        <Card>
          <Button variant="primary">추가한 Seria 버튼</Button>
        </Card>
        <Card>새 컴포넌트만 지정한 스타일을 사용합니다.</Card>
      </Columns>
    </ThemeProvider>
  </>,
);
