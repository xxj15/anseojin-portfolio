/**
 * 스크롤 리빌 (EXPERIENCE.md Interaction Primitives)
 * - 요소 상단이 뷰포트 하단 15% 선에 닿으면 1회: opacity 0→1, translateY 16px→0, 480ms.
 * - 같은 부모의 형제는 60ms 간격(최대 4개).
 * - 숨김 클래스는 이 스크립트가 붙인다. 스크립트가 실행되지 않으면 아무것도 숨기지 않는다.
 * - 로드 시점에 이미 보이는 요소는 숨기지 않는다(깜빡임 방지). 모션 감소면 아무것도 하지 않는다.
 */
import { prefersReducedMotion } from './motion';

const SELECTOR = '[data-reveal]';
const PENDING = 'reveal-pending';
const REVEALING = 'is-revealing';
const DURATION_MS = 480;
const STAGGER_MS = 60;
const MAX_STAGGER_INDEX = 3; // 0·60·120·180ms → 최대 4개

function revealNow(element: HTMLElement): void {
  element.classList.remove(PENDING, REVEALING);
  element.style.removeProperty('--reveal-delay');
}

function initReveal(): void {
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;

  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const pending = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR)).filter(
    (element) => element.getBoundingClientRect().top >= viewportHeight,
  );
  if (pending.length === 0) return;

  const remaining = new Set(pending);
  const revealAll = () => pending.forEach(revealNow);

  try {
    let observer: IntersectionObserver;

    /** 함께 드러나는 형제끼리 문서 순서대로 60ms씩 늦춘다. */
    const start = (elements: HTMLElement[]) => {
      elements.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
      const siblingIndex = new Map<Element | null, number>();

      for (const element of elements) {
        observer.unobserve(element);
        remaining.delete(element);
        const index = siblingIndex.get(element.parentElement) ?? 0;
        siblingIndex.set(element.parentElement, index + 1);
        const delay = Math.min(index, MAX_STAGGER_INDEX) * STAGGER_MS;

        element.style.setProperty('--reveal-delay', `${delay}ms`);
        element.classList.add(REVEALING);
        element.classList.remove(PENDING);
        window.setTimeout(() => revealNow(element), DURATION_MS + delay + 50);
      }
    };

    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting && remaining.has(entry.target as HTMLElement))
          .map((entry) => entry.target as HTMLElement);
        if (visible.length > 0) start(visible);
      },
      { rootMargin: '0px 0px -15% 0px', threshold: 0 },
    );

    // 화면이 아주 길면 마지막 요소가 하단 15% 선을 끝내 넘지 못한다. 더 내려갈 수 없으면 남은 것을 모두 드러낸다.
    const revealAtEnd = () => {
      if (remaining.size === 0) {
        window.removeEventListener('scroll', revealAtEnd);
        window.removeEventListener('resize', revealAtEnd);
        return;
      }
      const root = document.documentElement;
      if (window.scrollY + window.innerHeight >= root.scrollHeight - 1) start(Array.from(remaining));
    };
    window.addEventListener('scroll', revealAtEnd, { passive: true });
    window.addEventListener('resize', revealAtEnd);

    for (const element of pending) {
      element.classList.add(PENDING);
      observer.observe(element);
    }

    // 키보드로 아직 리빌 전·중인 요소에 들어오면 바로 보인다. 브라우저는 리빌 이동(16px) 전 위치로 포커스 스크롤
    // 목표를 잡으므로, 다음 프레임에 최종 위치 기준으로 다시 맞춰 포커스 링이 내비 아래로 들어가지 않게 한다.
    document.addEventListener('focusin', (event) => {
      const focused = event.target;
      const container = focused instanceof Element ? focused.closest<HTMLElement>(SELECTOR) : null;
      if (!container || !container.matches(`.${PENDING}, .${REVEALING}`)) return;
      observer.unobserve(container);
      remaining.delete(container);
      revealNow(container);
      requestAnimationFrame(() => {
        if (document.activeElement === focused && focused instanceof HTMLElement) {
          focused.scrollIntoView({ block: 'center', inline: 'nearest' });
        }
      });
    });

    // 인쇄할 때는 모두 보이게 한다
    window.addEventListener('beforeprint', revealAll, { once: true });
  } catch (error) {
    revealAll();
    console.error('[reveal]', error);
  }
}

try {
  initReveal();
} catch (error) {
  document.querySelectorAll<HTMLElement>(SELECTOR).forEach(revealNow);
  console.error('[reveal]', error);
}
