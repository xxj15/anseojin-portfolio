/**
 * timeline-row "자세히 보기" 토글 (EXPERIENCE.md Component Patterns › Timeline row)
 * - button[aria-expanded][aria-controls]가 상세 영역을 열고 닫는다. 라벨은 "자세히 보기" ↔ "접기".
 * - 상세 영역은 html.js일 때만 CSS로 닫아 둔다. 스크립트가 없으면 상세가 보이고 토글 버튼은 숨는다.
 */
const TOGGLE_SELECTOR = '[data-timeline-toggle]';
const OPEN = 'is-open';

function initTimelineToggles(): void {
  document.querySelectorAll<HTMLButtonElement>(TOGGLE_SELECTOR).forEach((button) => {
    const id = button.getAttribute('aria-controls');
    const region = id ? document.getElementById(id) : null;
    const label = button.querySelector<HTMLElement>('[data-toggle-label]');
    if (!region) return;

    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(expanded));
      region.classList.toggle(OPEN, expanded);
      if (label) {
        label.textContent = (expanded ? button.dataset.labelOpen : button.dataset.labelClosed) ?? label.textContent;
      }
    });
  });
}

try {
  initTimelineToggles();
} catch (error) {
  console.error('[timeline-toggle]', error);
}

// 모듈 범위(다른 스크립트와 전역 이름이 겹치지 않게)
export {};
