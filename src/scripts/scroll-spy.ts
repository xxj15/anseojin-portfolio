/**
 * section-progress + 스크롤 스파이 + 스크롤 후 내비 테두리 (EXPERIENCE.md Component Patterns › Nav bar · Section progress)
 * - 진행 바: 문서 전체 스크롤 비율을 실시간으로 반영한다. 페이지에 [data-progress-root]가 있으면(상세 페이지의 article)
 *   그 요소를 기준으로 잰다: 요소 위쪽이 내비 아래에 있을 때 0, 요소 아래쪽이 화면 아래에 닿으면 1.
 * - 스크롤 스파이: URL은 바꾸지 않고 활성 항목(aria-current="location")만 갱신한다. 대상이 없는 앵커는 무시한다.
 * - 내비 테두리: 최상단에서는 없고 스크롤한 뒤에만 보인다.
 */

/** 활성 판정선: 내비 아래 남은 화면의 위쪽 1/3 지점 */
const ACTIVATION_RATIO = 1 / 3;

function initScrollSpy(): void {
  const header = document.querySelector<HTMLElement>('[data-site-header]');
  if (!header) return;
  const progress = header.querySelector<HTMLElement>('[data-section-progress]');
  const progressRoot = document.querySelector<HTMLElement>('[data-progress-root]');

  /** 진행 비율(0–1). 기준 요소가 없으면 문서 전체. */
  const progressRatio = (scrollY: number, viewportHeight: number): number => {
    if (!progressRoot) {
      const scrollable = document.documentElement.scrollHeight - viewportHeight;
      return scrollable > 0 ? Math.min(1, Math.max(0, scrollY / scrollable)) : 0;
    }
    const rect = progressRoot.getBoundingClientRect();
    const navBottom = header.getBoundingClientRect().bottom;
    const readable = rect.height - (viewportHeight - navBottom);
    const read = navBottom - rect.top;
    if (readable <= 0) return read >= 0 ? 1 : 0;
    return Math.min(1, Math.max(0, read / readable));
  };

  const targets = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]')).flatMap((link) => {
    const id = link.dataset.navLink;
    const section = id ? document.getElementById(id) : null;
    return section ? [{ link, id: id as string, section }] : [];
  });
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]'));

  let activeId: string | null | undefined;
  let scheduled = false;

  const update = () => {
    scheduled = false;
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const ratio = progressRatio(scrollY, viewportHeight);

    if (progress) progress.style.transform = `scaleX(${ratio})`;
    header.classList.toggle('is-scrolled', scrollY > 0);

    const navBottom = header.getBoundingClientRect().bottom;
    const line = navBottom + Math.max(0, viewportHeight - navBottom) * ACTIVATION_RATIO;
    let nextId: string | null = null;
    for (const { id, section } of targets) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= line && rect.bottom > line) nextId = id;
    }

    // 맨 아래까지 내리면 판정선이 섹션 사이 여백이나 contact band에 걸려 아무것도 활성이 안 될 수 있다.
    // 더 내려갈 수 없으면 문서에서 가장 아래에 있는 대상 섹션(홈에서는 Activities)을 활성으로 둔다.
    const atEnd = scrollY > 0 && scrollY + viewportHeight >= document.documentElement.scrollHeight - 1;
    if (atEnd && targets.length > 0) {
      const last = targets.reduce((a, b) =>
        a.section.compareDocumentPosition(b.section) & Node.DOCUMENT_POSITION_FOLLOWING ? b : a,
      );
      if (last.section.getBoundingClientRect().top < viewportHeight) nextId = last.id;
    }

    if (nextId === activeId) return;
    activeId = nextId;
    for (const link of links) {
      if (link.dataset.navLink === nextId) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    }
  };

  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('hashchange', schedule);
  window.addEventListener('load', schedule);
  update();
}

try {
  initScrollSpy();
} catch (error) {
  console.error('[scroll-spy]', error);
}
