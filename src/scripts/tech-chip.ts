/**
 * tech-chip 펼침 (EXPERIENCE.md Component Patterns › Tech chip · State Patterns › 칩 펼침)
 * - 칩(button)을 누르면 aria-controls가 가리키는 "사용한 프로젝트" 목록을 연다. 한 번에 하나만 열린다.
 * - 같은 칩을 다시 누르거나 Esc를 누르면 닫는다. Esc로 닫으면 포커스는 그 칩으로 돌아온다.
 * - 다른 행의 목록이 닫히며 누른 칩이 위로 밀려 올라가지 않도록, 바뀐 만큼 스크롤을 보정한다.
 * - 목록은 html.js일 때만 CSS로 닫아 둔다. 이 스크립트가 없으면 모든 목록이 보인다.
 */
const CHIP_SELECTOR = '[data-tech-chip]';
const OPEN = 'is-open';

function initTechChips(): void {
  const chips = Array.from(document.querySelectorAll<HTMLButtonElement>(CHIP_SELECTOR));
  if (chips.length === 0) return;

  const panelOf = (chip: HTMLButtonElement) => {
    const id = chip.getAttribute('aria-controls');
    return id ? document.getElementById(id) : null;
  };

  let openChip: HTMLButtonElement | null = null;

  const setExpanded = (chip: HTMLButtonElement, expanded: boolean) => {
    chip.setAttribute('aria-expanded', String(expanded));
    panelOf(chip)?.classList.toggle(OPEN, expanded);
  };

  /** 상태를 바꾸는 동안 기준 칩의 화면 위치가 변하지 않게 한다(위쪽 목록이 닫히며 생기는 점프 방지). */
  const keepInPlace = (anchor: HTMLElement, change: () => void) => {
    const before = anchor.getBoundingClientRect().top;
    change();
    const delta = anchor.getBoundingClientRect().top - before;
    if (Math.abs(delta) >= 1) window.scrollBy({ top: delta, left: 0, behavior: 'instant' });
  };

  const close = (restoreFocus: boolean) => {
    if (!openChip) return;
    const chip = openChip;
    openChip = null;
    setExpanded(chip, false);
    if (restoreFocus) chip.focus({ preventScroll: true });
  };

  for (const chip of chips) {
    chip.addEventListener('click', () => {
      if (openChip === chip) {
        close(false);
        return;
      }
      keepInPlace(chip, () => {
        if (openChip) setExpanded(openChip, false);
        openChip = chip;
        setExpanded(chip, true);
      });
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !openChip || event.defaultPrevented) return;
    const panel = panelOf(openChip);
    const active = document.activeElement;
    // 포커스가 칩이나 목록 안에 있을 때만 포커스를 칩으로 돌린다
    const inside = active === openChip || (!!panel && !!active && panel.contains(active));
    close(inside);
  });
}

try {
  initTechChips();
} catch (error) {
  console.error('[tech-chip]', error);
}

// 모듈 범위(다른 스크립트와 전역 이름이 겹치지 않게)
export {};
