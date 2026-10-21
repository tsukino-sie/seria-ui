import { useState } from 'react';
import {
  ThemeProvider,
  ThemePicker,
  PanelShell,
  SiteShell,
  Hero,
  BlockGrid,
  FeatureBlock,
  MetricStrip,
  NavItem,
  PageHeader,
  Grid,
  Section,
  Surface,
  Badge,
  Button,
  Field,
  Input,
  Select,
  Toggle,
  Table,
  Segmented,
  EmptyState,
  Dialog,
  Dropdown,
} from '../src/index';

const pages = [
  {
    id: 'overview',
    label: '대시보드',
    description: '연결 상태와 최근 활동을 확인해요.',
    icon: 'grid',
  },
  {
    id: 'components',
    label: '컴포넌트',
    description: '입력과 상태, 작업 버튼을 확인해요.',
    icon: 'layers',
  },
  { id: 'members', label: '사용자', description: '사용자와 접근 권한을 관리해요.', icon: 'users' },
  { id: 'settings', label: '설정', description: '연결과 화면 설정을 변경해요.', icon: 'settings' },
];
const members = [
  ['Sie', '소유자', '사용 중'],
  ['Haru', '관리자', '사용 중'],
  ['Namu', '멤버', '승인 대기'],
];
const activity = [
  ['새 게시물을 동기화했어요.', '커뮤니티 소식', '방금'],
  ['새 멤버가 합류했어요.', '사용자 관리 · 1명', '12분 전'],
  ['권한 설정을 저장했어요.', '접근 관리 · 소유자', '38분 전'],
];

function Icon({ kind = 'grid' }: { kind?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {kind === 'grid' ? (
        <>
          <rect x="3" y="3" width="7" height="7" rx="2" />
          <rect x="14" y="3" width="7" height="7" rx="2" />
          <rect x="3" y="14" width="7" height="7" rx="2" />
          <rect x="14" y="14" width="7" height="7" rx="2" />
        </>
      ) : kind === 'layers' ? (
        <>
          <path d="m12 3 10 5-10 5L2 8Zm-9 10 9 5 9-5M3 18l9 5 9-5" />
        </>
      ) : kind === 'users' ? (
        <>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20v-2a6 6 0 0 1 12 0v2m3-14a3 3 0 0 1 0 6m1 3a5 5 0 0 1 3 5" />
        </>
      ) : (
        <>
          <path d="M5 6h14M5 12h14M5 18h14" />
          <circle cx="9" cy="6" r="2" fill="var(--pui-sidebar)" />
          <circle cx="15" cy="12" r="2" fill="var(--pui-sidebar)" />
          <circle cx="9" cy="18" r="2" fill="var(--pui-sidebar)" />
        </>
      )}
    </svg>
  );
}

function Demo({
  accent,
  onAccentChange,
}: {
  accent: string;
  onAccentChange: (value: string) => void;
}) {
  const [page, setPage] = useState('overview');
  const [glass, setGlass] = useState(true);
  const [layout, setLayout] = useState('site');
  const [alerts, setAlerts] = useState(true);
  const [mode, setMode] = useState('soft');
  const [dialog, setDialog] = useState<'connection' | 'invite' | null>(null);
  const [notice, setNotice] = useState('');
  const activePage = pages.find((item) => item.id === page)!;
  const material = glass ? (mode as 'soft' | 'clear') : false;
  const navigate = (next: string) => {
    setPage(next);
    setNotice('');
  };
  const sidebar = (
    <div className="demo-nav">
      <a
        href="#"
        className="demo-brand"
        onClick={(event) => {
          event.preventDefault();
          navigate('overview');
        }}
      >
        <span className="demo-mark">
          <Icon kind="layers" />
        </span>
        <span>
          <strong>Seria</strong>
          <small>UI COMPONENTS</small>
        </span>
      </a>
      <div className="demo-workspace">
        <span className="demo-workspace-icon">P</span>
        <div>
          <strong>개인 워크스페이스</strong>
          <small>미리보기</small>
        </div>
        <Badge>예시</Badge>
      </div>
      <nav aria-label="주 메뉴">
        {pages.map((item) => (
          <NavItem
            key={item.id}
            current={page === item.id}
            icon={<Icon kind={item.icon} />}
            onClick={() => navigate(item.id)}
          >
            {item.label}
          </NavItem>
        ))}
      </nav>
      <div className="demo-nav-bottom">
        <p className="pui-muted">설정에서 테마와 탐색 방식을 바꿀 수 있어요.</p>
        <div className="demo-profile">
          <span>SI</span>
          <div>
            <strong>Sie</strong>
            <small>워크스페이스 소유자</small>
          </div>
          <span className="demo-status" aria-label="온라인" />
        </div>
      </div>
    </div>
  );
  const brand = (
    <button className="demo-top-brand" type="button" onClick={() => navigate('overview')}>
      <span className="demo-mark">
        <Icon kind="layers" />
      </span>
      <strong>Seria</strong>
    </button>
  );
  const navigation = pages.map((item) => (
    <NavItem key={item.id} current={page === item.id} onClick={() => navigate(item.id)}>
      {item.label}
    </NavItem>
  ));
  const Shell = layout === 'site' ? SiteShell : PanelShell;
  const showConnection = () => setDialog('connection');
  const appearance = (
    <div className="demo-fields">
      <Field label="강조색" hint="버튼과 상태 색상에 함께 적용돼요.">
        {(props) => (
          <div className="demo-color">
            <Input
              {...props}
              type="color"
              value={accent}
              onChange={(e) => onAccentChange(e.target.value)}
            />
            <code>{accent.toUpperCase()}</code>
            <Button variant="quiet" onClick={() => onAccentChange('#6ccdee')}>
              기본값
            </Button>
          </div>
        )}
      </Field>
      <div className="demo-palette" role="group" aria-label="강조색 예시">
        {[
          ['#6ccdee', '하늘색'],
          ['#794de8', '보라색'],
          ['#19885b', '민트색'],
          ['#ed886b', '코랄색'],
        ].map(([color, label]) => (
          <button
            key={color}
            type="button"
            aria-label={label}
            aria-pressed={accent === color}
            onClick={() => onAccentChange(color)}
          >
            <span style={{ background: color }} />
          </button>
        ))}
      </div>
      <Toggle
        checked={glass}
        onChange={setGlass}
        label="유리 효과"
        description="헤더와 선택한 카드에 적용해요."
      />
      <Segmented
        label="유리 효과 강도"
        value={mode}
        onChange={setMode}
        options={[
          { value: 'soft', label: '은은하게' },
          { value: 'clear', label: '투명하게' },
        ]}
      />
      <Field label="탐색 방식">
        {(props) => (
          <Select {...props} value={layout} onChange={(event) => setLayout(event.target.value)}>
            <option value="site">상단 메뉴</option>
            <option value="panel">사이드바</option>
          </Select>
        )}
      </Field>
    </div>
  );
  const connectionForm = (
    <div className="demo-fields">
      <Field label="연결 이름" hint="목록에 표시할 이름이에요.">
        {(props) => <Input {...props} placeholder="예: 커뮤니티 소식" />}
      </Field>
      <Field label="대상 게시판">
        {(props) => (
          <Select {...props}>
            <option>커뮤니티 소식</option>
            <option>작업 기록</option>
          </Select>
        )}
      </Field>
      <Toggle
        checked={alerts}
        onChange={setAlerts}
        label="자동 동기화"
        description="새 글을 연결된 채널에 보내요."
      />
      <div className="pui-actions">
        <Button variant="primary" onClick={() => setNotice('예시 설정을 저장했어요.')}>
          변경사항 저장
        </Button>
        <Button variant="quiet" onClick={() => setNotice('변경을 취소했어요.')}>
          취소
        </Button>
      </div>
    </div>
  );
  return (
    <Shell
      brand={brand}
      navigation={navigation}
      actions={<ThemePicker />}
      sidebar={sidebar}
      navbar={
        <strong>
          Seria <span className="pui-muted">/ {activePage.label}</span>
        </strong>
      }
      glass={material}
      headerGlass={material}
    >
      <div key={page} className="demo-page" data-motion="enter">
        {page !== 'overview' && (
          <PageHeader
            title={activePage.label}
            description={activePage.description}
            actions={
              <>
                {layout === 'panel' && <ThemePicker />}
                {page === 'members' && (
                  <Button onClick={() => setDialog('invite')}>
                    사용자 초대 <span aria-hidden="true">＋</span>
                  </Button>
                )}
              </>
            }
          />
        )}
        {notice && (
          <p role="status" className="demo-notice">
            {notice}
          </p>
        )}
        {page === 'overview' && (
          <>
            <Hero title="워크스페이스" description={pages[0].description}>
              <MetricStrip
                items={[
                  { label: '연결된 서비스', value: 8, detail: '모두 정상이에요' },
                  { label: '이번 주 처리', value: '1,284', detail: '지난주보다 12% 늘었어요' },
                  { label: '함께하는 멤버', value: 246, detail: '이번 주 8명이 합류했어요' },
                  { label: '확인할 항목', value: 3, detail: '새로운 권한 요청이 있어요' },
                ]}
              />
              <div className="demo-overview-tools">
                <span className="demo-health">
                  <span aria-hidden="true" />
                  모든 연결이 정상이에요
                </span>
                <div className="pui-actions">
                  {layout === 'panel' && <ThemePicker />}
                  <Button onClick={showConnection}>
                    연결 추가 <span aria-hidden="true">＋</span>
                  </Button>
                </div>
              </div>
            </Hero>
            <div className="demo-section-title">
              <h2>관리</h2>
              <span className="pui-muted">활동과 설정을 확인해요.</span>
            </div>
            <BlockGrid>
              <FeatureBlock
                span="wide"
                title="최근 활동"
                description="최근 작업을 순서대로 확인해요."
              >
                <div className="demo-activity">
                  {activity.map(([title, detail, time], index) => (
                    <div key={title}>
                      <span className="demo-activity-icon">
                        <Icon kind={index === 1 ? 'users' : 'layers'} />
                      </span>
                      <div>
                        <strong>{title}</strong>
                        <small>{detail}</small>
                      </div>
                      <time>{time}</time>
                    </div>
                  ))}
                </div>
              </FeatureBlock>
              <FeatureBlock
                title="접근 권한"
                description="관리자와 멤버의 접근 범위를 구분해요."
                tone="accent"
                actions={
                  <Button onClick={() => navigate('members')}>
                    사용자 관리 <span aria-hidden="true">→</span>
                  </Button>
                }
              >
                <div className="demo-access-visual">
                  <div>
                    <span>SI</span>
                    <span>HA</span>
                    <span>NA</span>
                  </div>
                  <Badge tone="success">설정 완료</Badge>
                </div>
              </FeatureBlock>
              <FeatureBlock
                title="화면 소재"
                description="유리는 원하는 영역에만 적용해요."
                glass={material}
              >
                <Toggle
                  checked={glass}
                  onChange={setGlass}
                  label="유리 효과"
                  description="헤더와 이 카드에 적용해요."
                />
                <Segmented
                  label="유리 효과 강도"
                  value={mode}
                  onChange={setMode}
                  options={[
                    { value: 'soft', label: '은은하게' },
                    { value: 'clear', label: '투명하게' },
                  ]}
                />
                <p className="demo-code">{'<Surface glass="soft">'}</p>
              </FeatureBlock>
              <FeatureBlock
                title="알림과 동기화"
                description="새 소식을 연결된 채널에 보내요."
                tone="inset"
                actions={
                  <Button variant="quiet" onClick={() => navigate('settings')}>
                    연결 설정 <span aria-hidden="true">→</span>
                  </Button>
                }
              >
                <Toggle
                  checked={alerts}
                  onChange={setAlerts}
                  label="작업 알림"
                  description="변경이 있을 때 알려드려요."
                />
                <div className="demo-small-row">
                  <span>마지막 동기화</span>
                  <Badge tone="success">방금 완료</Badge>
                </div>
              </FeatureBlock>
              <FeatureBlock title="탐색 방식" description="화면에 맞는 메뉴를 선택해요.">
                <Segmented
                  label="레이아웃 종류"
                  value={layout}
                  onChange={setLayout}
                  options={[
                    { value: 'site', label: '상단 메뉴' },
                    { value: 'panel', label: '사이드바' },
                  ]}
                />
                <p className="demo-layout-note">메뉴가 많으면 사이드바가 편해요.</p>
              </FeatureBlock>
            </BlockGrid>
          </>
        )}
        {page === 'members' && (
          <>
            <Surface>
              <MetricStrip
                items={[
                  { label: '전체 사용자', value: 3 },
                  { label: '사용 중', value: 2 },
                  { label: '승인 대기', value: 1 },
                ]}
              />
            </Surface>
            <Section title="등록된 사용자">
              <Table label="예시 사용자 목록">
                <thead>
                  <tr>
                    <th>사용자</th>
                    <th>권한</th>
                    <th>상태</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map(([name, role, state]) => (
                    <tr key={name}>
                      <td>
                        <strong>{name}</strong>
                        <p className="pui-muted">워크스페이스 계정</p>
                      </td>
                      <td>{role}</td>
                      <td>
                        <Badge tone={state === '사용 중' ? 'success' : 'warning'}>{state}</Badge>
                      </td>
                      <td>
                        <Button
                          variant="quiet"
                          onClick={() => setNotice(`${name}의 예시 권한을 확인했어요.`)}
                        >
                          권한 보기
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Section>
          </>
        )}
        {page === 'settings' && (
          <Grid>
            <Section title="연결 설정" description="새 글을 받을 위치를 설정해요.">
              {connectionForm}
            </Section>
            <Section title="화면 설정" description="변경하면 바로 적용돼요." glass={material}>
              {appearance}
            </Section>
          </Grid>
        )}
        {page === 'components' && (
          <>
            <Grid>
              <Section title="버튼" description="한 화면의 기본 작업은 하나만 강조해요.">
                <div className="demo-fields">
                  <div className="pui-actions">
                    <Button variant="primary" onClick={showConnection}>
                      추가
                    </Button>
                    <Button onClick={() => setNotice('예시 작업을 선택했어요.')}>편집</Button>
                    <Button variant="quiet" onClick={() => setNotice('변경을 취소했어요.')}>
                      취소
                    </Button>
                  </div>
                  <div className="pui-actions">
                    <Button
                      variant="danger"
                      onClick={() => setNotice('삭제 버튼의 예시예요. 데이터는 바뀌지 않아요.')}
                    >
                      삭제
                    </Button>
                    <Button disabled>사용 불가</Button>
                    <Dropdown
                      label="더 보기"
                      items={[
                        {
                          id: 'edit',
                          label: '이름 변경',
                          onSelect: () => setNotice('이름 변경을 선택했어요.'),
                        },
                        {
                          id: 'copy',
                          label: '복사',
                          onSelect: () => setNotice('복사를 선택했어요.'),
                        },
                        { id: 'archive', label: '보관', disabled: true, onSelect: () => {} },
                        {
                          id: 'delete',
                          label: '삭제',
                          tone: 'danger',
                          onSelect: () => setNotice('삭제 메뉴의 예시예요.'),
                        },
                      ]}
                    />
                  </div>
                </div>
              </Section>
              <Section title="상태">
                <div className="pui-actions">
                  <Badge tone="success">완료</Badge>
                  <Badge tone="warning">확인 필요</Badge>
                  <Badge tone="danger">연결 오류</Badge>
                  <Badge tone="accent">새 항목</Badge>
                </div>
                <EmptyState
                  title="연결된 항목이 없어요"
                  description="연결을 추가하면 여기에 표시돼요."
                  action={<Button onClick={showConnection}>연결 추가</Button>}
                />
              </Section>
            </Grid>
            <Grid>
              <Section title="입력과 설명">{connectionForm}</Section>
              <Section title="선택과 전환" glass={material}>
                {appearance}
              </Section>
            </Grid>
          </>
        )}
      </div>
      <footer className="demo-footer">
        <span>Seria UI · by Sie</span>
        <span>표시된 데이터는 모두 예시예요.</span>
      </footer>
      <Dialog
        open={dialog !== null}
        onClose={() => setDialog(null)}
        title={dialog === 'invite' ? '사용자를 초대할까요?' : '새 연결을 만들까요?'}
        description="디자인 확인용이에요. 실제 데이터는 바뀌지 않아요."
        actions={
          <>
            <Button variant="quiet" onClick={() => setDialog(null)}>
              취소
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setNotice(
                  dialog === 'invite' ? '예시 초대를 만들었어요.' : '예시 연결을 만들었어요.',
                );
                setDialog(null);
              }}
            >
              {dialog === 'invite' ? '초대 만들기' : '연결 만들기'}
            </Button>
          </>
        }
      />
    </Shell>
  );
}
function Preview() {
  const [accent, setAccent] = useState<string | undefined>(() => {
    try {
      const value = localStorage.getItem('seria.demo.accent');
      return value && /^#[\da-f]{6}$/i.test(value) ? value : undefined;
    } catch {
      return undefined;
    }
  });
  const changeAccent = (value: string) => {
    setAccent(value === '#6ccdee' ? undefined : value);
    try {
      if (value === '#6ccdee') localStorage.removeItem('seria.demo.accent');
      else localStorage.setItem('seria.demo.accent', value);
    } catch {
      /* Preview changes also work without persistence. */
    }
  };
  return (
    <ThemeProvider accent={accent}>
      <Demo accent={accent || '#6ccdee'} onAccentChange={changeAccent} />
    </ThemeProvider>
  );
}
export default Preview;
