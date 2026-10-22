/* Seria UI · Example composition · Copyright (c) 2026 Sie · See LICENSE. */
import {
  Button,
  Card,
  Cluster,
  Columns,
  FeatureBlock,
  Hero,
  MediaFrame,
  PageSection,
  Stack,
  Stat,
  Badge,
} from 'seria-ui';
import Spaces from './Spaces';
import ComponentPage from './ComponentPage';

export type StarterPageProps = {
  composition?: 'intro' | 'journal' | 'workspace' | 'components';
  material?: 'glass' | 'solid' | 'open';
  layout?: 'split' | 'stack' | 'cover';
  finish?: 'ambient' | 'plain' | 'transparent';
  spacious?: boolean;
  onAction?: () => void;
  saved?: boolean;
  onSave?: () => void;
};

/** Copy and edit these example contents. No API, router or service is required. */
export default function StarterPage({
  composition = 'intro',
  finish = 'ambient',
  spacious = true,
  onAction,
  saved = false,
  onSave,
  material = 'glass',
  layout = 'split',
}: StarterPageProps) {
  if (composition === 'components') return <ComponentPage material={material} />;
  if (composition === 'intro')
    return (
      <Spaces
        finish={finish}
        spacious={spacious}
        onAction={onAction}
        material={material}
        layout={layout}
      />
    );
  const spacing = spacious ? 'comfortable' : 'compact';
  return (
    <div className="example-page" data-material={material}>
      <PageSection spacing="compact" aria-label="예시 페이지 소개">
        <Cluster justify="between">
          <strong>{composition === 'journal' ? 'Seria / Journal' : 'Seria / Work'}</strong>
          <Badge tone="accent">
            {composition === 'journal' ? '일상의 기록' : '나의 작업 공간'}
          </Badge>
        </Cluster>
      </PageSection>
      {composition === 'journal' ? (
        <>
          <PageSection spacing={spacing}>
            <Hero
              layout={layout === 'stack' ? 'stack' : 'split'}
              glass={material === 'glass' ? 'clear' : false}
              tone={finish}
              align="start"
              headingLevel={3}
              eyebrow="NOTES ON EVERYDAY LIFE"
              title={
                <>
                  서두르지 않아도,
                  <br />
                  좋은 것은 남아요.
                </>
              }
              description="창가에 스며든 빛, 잠깐의 산책, 오랜만에 꺼낸 노트. 일상에서 발견한 작은 장면을 모았어요."
              actions={
                <>
                  <Button variant="primary" onClick={onAction}>
                    기록 읽기 ↗
                  </Button>
                  <Button onClick={onSave} aria-pressed={saved}>
                    {saved ? '저장됨' : '저장하기'}
                  </Button>
                </>
              }
              visual={
                <MediaFrame ratio="1 / 1" caption="느린 오후에 발견한 빛과 균형.">
                  <svg
                    viewBox="0 0 400 400"
                    role="img"
                    aria-label="올리브와 모래색 곡선으로 표현한 창가의 햇빛"
                  >
                    <rect width="400" height="400" fill="#e7e1d0" />
                    <circle cx="290" cy="100" r="130" fill="#bac697" />
                    <path d="M0 280Q150 170 400 240V400H0Z" fill="#68783e" />
                    <path d="M0 350Q230 220 400 310V400H0Z" fill="#a4b47a" />
                    <path
                      d="M65 0V400M195 0V400M0 170H400"
                      stroke="#f9f7ef"
                      strokeWidth="12"
                      opacity=".65"
                    />
                  </svg>
                </MediaFrame>
              }
            />
          </PageSection>
          <PageSection
            title="최근 이야기"
            headingLevel={3}
            spacing={spacing}
            description="평범한 하루의 다른 표정을 담았어요."
          >
            <Columns min="16rem">
              <FeatureBlock
                glass={material === 'glass' ? 'clear' : false}
                headingLevel={3}
                eyebrow="01 / 일상"
                title="나만의 속도를 찾는 일"
                description="계획을 조금 비워두니, 미처 보지 못했던 풍경이 보이기 시작했어요."
                actions={
                  <Button variant="quiet" onClick={onAction}>
                    이야기 읽기 ↗
                  </Button>
                }
              />
              <FeatureBlock
                glass={material === 'glass' ? 'clear' : false}
                headingLevel={3}
                eyebrow="02 / 공간"
                title="비워 두어도 좋은 공간"
                tone={finish === 'ambient' ? 'accent' : 'neutral'}
                description="모든 자리를 채우지 않아도 좋아요. 여유가 머무는 자리도 필요하니까요."
                actions={
                  <Button variant="quiet" onClick={onAction}>
                    이야기 읽기 ↗
                  </Button>
                }
              />
            </Columns>
          </PageSection>
        </>
      ) : (
        <>
          <PageSection spacing={spacing}>
            <Hero
              glass={material === 'glass' ? 'clear' : false}
              tone={finish}
              align="start"
              headingLevel={3}
              eyebrow="WORKSPACE / OVERVIEW"
              title="차근차근, 오늘의 작업."
              description="해야 할 일과 최근의 흐름을 한곳에서 확인해요."
              actions={
                <Button variant="primary" onClick={onAction}>
                  작업 추가 ＋
                </Button>
              }
            />
          </PageSection>
          <PageSection spacing={spacing} aria-label="작업 현황">
            <Columns min="12rem">
              <Stat
                glass={material === 'glass' ? 'clear' : false}
                label="진행 중인 작업"
                value="08"
                detail="지금 집중하고 있어요"
              />
              <Stat
                glass={material === 'glass' ? 'clear' : false}
                label="이번 주 완료"
                value="12"
                detail="하나씩 쌓아가고 있어요"
              />
              <Stat
                glass={material === 'glass' ? 'clear' : false}
                label="함께하는 사람"
                value="04"
                detail="서로의 생각을 나눠요"
              />
            </Columns>
          </PageSection>
          <PageSection
            title="최근 작업"
            headingLevel={3}
            spacing={spacing}
            actions={
              <Button variant="quiet" onClick={onAction}>
                모든 작업 보기 ↗
              </Button>
            }
          >
            <Card glass={material === 'glass' ? 'clear' : false}>
              <Stack gap={6}>
                {[
                  { title: '새로운 페이지 구성하기', time: '오늘', status: '진행 중' },
                  { title: '팀의 아이디어 모으기', time: '내일', status: '예정' },
                  { title: '첫 번째 초안 확인하기', time: '어제', status: '완료' },
                ].map((item) => (
                  <Cluster key={item.title} justify="between">
                    <strong>{item.title}</strong>
                    <Cluster>
                      <span>{item.time}</span>
                      <Badge>{item.status}</Badge>
                    </Cluster>
                  </Cluster>
                ))}
              </Stack>
            </Card>
          </PageSection>
        </>
      )}
      <PageSection spacing="compact" aria-label="예시 페이지 안내">
        <Cluster justify="between">
          <small>SERIA UI / EXAMPLE</small>
          <small>내용과 동작은 프로젝트에 맞게 바꿔주세요.</small>
        </Cluster>
      </PageSection>
    </div>
  );
}
