import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Cluster,
  Columns,
  Dialog,
  Dropdown,
  Field,
  Input,
  PageSection,
  Select,
  Stack,
  Toggle,
} from 'seria-ui';

/** Live components, using the same theme tokens as the page compositions. */
export default function ComponentPage({
  material = 'glass',
}: {
  material?: 'glass' | 'solid' | 'open';
}) {
  const [name, setName] = useState('나의 작은 공간');
  const [enabled, setEnabled] = useState(true);
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState('직접 누르고 입력해보세요.');
  const glass = material === 'glass' ? 'clear' : false;
  return (
    <PageSection
      className="example-page"
      data-material={material}
      title="작은 요소까지, 같은 균형."
      headingLevel={3}
      spacing="compact"
      description={notice}
    >
      <Columns min="18rem" gap={5}>
        <Card glass={glass}>
          <Stack gap={5}>
            <strong>버튼과 상태</strong>
            <Cluster>
              <Button variant="primary" onClick={() => setNotice('주요 버튼을 눌렀어요.')}>
                주요 작업
              </Button>
              <Button onClick={() => setOpen(true)}>대화상자</Button>
              <Button variant="quiet" onClick={() => setNotice('보조 작업을 눌렀어요.')}>
                가볍게 ↗
              </Button>
            </Cluster>
            <Cluster>
              <Badge tone="accent">진행 중</Badge>
              <Badge tone="success">완료</Badge>
              <Badge tone="warning">확인</Badge>
              <Badge tone="danger">오류</Badge>
            </Cluster>
            <Dropdown
              label="메뉴 열기"
              items={[
                {
                  id: 'save',
                  label: '저장하기',
                  onSelect: () => setNotice('메뉴에서 저장을 선택했어요.'),
                },
                {
                  id: 'share',
                  label: '공유 준비',
                  onSelect: () => setNotice('공유 준비를 선택했어요.'),
                },
              ]}
            />
          </Stack>
        </Card>
        <Card glass={glass}>
          <Stack gap={5}>
            <strong>입력과 선택</strong>
            <Field label="페이지 이름" hint="서체는 프로젝트에서 그대로 상속해요.">
              {(props) => (
                <Input {...props} value={name} onChange={(event) => setName(event.target.value)} />
              )}
            </Field>
            <Field label="공개 범위">
              {(props) => (
                <Select {...props} defaultValue="team">
                  <option value="team">함께하는 사람</option>
                  <option value="private">나만 보기</option>
                </Select>
              )}
            </Field>
            <Toggle label="알림 받기" checked={enabled} onChange={setEnabled} />
          </Stack>
        </Card>
      </Columns>
      <Dialog
        glass={glass}
        open={open}
        onClose={() => setOpen(false)}
        title="같은 테마로 이어지는 대화상자"
        actions={
          <Button variant="primary" onClick={() => setOpen(false)}>
            확인했어요
          </Button>
        }
      >
        <p>
          색상, 유리 재질과 모서리 설정이 대화상자에도 이어집니다. Escape 또는 확인 버튼으로 닫을 수
          있어요.
        </p>
      </Dialog>
    </PageSection>
  );
}
