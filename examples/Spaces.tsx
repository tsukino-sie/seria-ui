import './spaces.css';
import { Button, Card, Cluster, Columns, Hero, Stack } from 'seria-ui';

export type SpacesPageProps = {
  layout?: 'split' | 'cover' | 'stack';
  material?: 'glass' | 'solid' | 'open';
  finish?: 'ambient' | 'plain' | 'transparent';
  onAction?: () => void;
  spacious?: boolean;
};

/** A fictional editorial page, composed with the same public Seria primitives. */
export default function EditorialPage({
  layout = 'split',
  finish = 'ambient',
  onAction,
  spacious = true,
  material = 'glass',
}: SpacesPageProps) {
  return (
    <div
      className="editorial-page"
      data-layout={layout}
      data-finish={finish}
      data-density={spacious ? 'spacious' : 'compact'}
      data-material={material}
    >
      <Cluster justify="between" className="editorial-nav">
        <strong>
          seria<span>/ spaces</span>
        </strong>
        <span className="editorial-nav-links">
          공간 <span>소재</span> 프로젝트 <span aria-hidden="true">↗</span>
        </span>
        <span className="editorial-edition">EDITION 01</span>
      </Cluster>
      <div className="editorial-composition">
        <Hero
          className="editorial-copy"
          headingLevel={3}
          align="start"
          tone={material === 'open' ? 'transparent' : finish}
          glass={material === 'glass' ? 'clear' : false}
          eyebrow="SPACE, LIGHT & EVERYDAY LIFE"
          title={
            <>
              <span>여백이 만드는</span>
              <span>좋은 공간.</span>
            </>
          }
          description="빛이 머무는 자리, 손에 닿는 소재. 오래 머물고 싶은 공간의 새로운 기준을 만나보세요."
          actions={
            onAction ? (
              <Button onClick={onAction} variant="primary">
                공간 둘러보기 <span aria-hidden="true">↗</span>
              </Button>
            ) : (
              <a href="#playground" className="pui-button" data-variant="primary">
                공간 둘러보기 <span aria-hidden="true">↗</span>
              </a>
            )
          }
        >
          <div className="editorial-copy-note">
            <i aria-hidden="true" /> A QUIETER KIND OF EVERYDAY.
          </div>
        </Hero>
        <figure className="editorial-visual">
          <img
            src="./images/seria-space.png"
            alt="햇빛이 드는 밝은 공간에 올리브색 의자와 석재 테이블이 놓인 모습"
            width="1536"
            height="1024"
            fetchPriority="high"
          />
          <figcaption>
            <span>THE QUIET ROOM</span>
            <span>OLIVE / 01</span>
          </figcaption>
          <span className="editorial-image-mark" aria-hidden="true">
            S.
          </span>
        </figure>
      </div>
      <Columns min="12rem" gap={3} className="editorial-lower">
        <Card
          glass={material === 'glass' ? 'clear' : false}
          className="editorial-material"
          elevation={finish === 'ambient' ? 'raised' : 'flat'}
        >
          <Stack gap={3}>
            <Cluster justify="between">
              <span className="editorial-label">MATERIAL STUDY</span>
              <span className="editorial-arrow" aria-hidden="true">
                ↗
              </span>
            </Cluster>
            <div className="editorial-swatches" aria-label="올리브, 리넨, 스톤 소재 색상">
              <i />
              <i />
              <i />
              <i />
            </div>
            <Cluster justify="between">
              <strong>자연에서 찾은 균형.</strong>
              <span className="editorial-label">OLIVE / LINEN / STONE</span>
            </Cluster>
          </Stack>
        </Card>
        <Card
          glass={material === 'glass' ? 'clear' : false}
          className="editorial-project"
          tone="subtle"
        >
          <span className="editorial-project-no">02</span>
          <Stack gap={2}>
            <span className="editorial-label">DESIGN NOTES</span>
            <strong>작은 공간을 넓게 쓰는 방법.</strong>
            <p>낮은 시선과 가벼운 동선, 그 사이의 여유.</p>
          </Stack>
          <span className="editorial-arrow" aria-hidden="true">
            ↗
          </span>
        </Card>
      </Columns>
      <Cluster justify="between" className="editorial-footer">
        <span>SERIA / SPACES</span>
        <span>가상 페이지 예시 · AI 생성 이미지</span>
      </Cluster>
    </div>
  );
}
