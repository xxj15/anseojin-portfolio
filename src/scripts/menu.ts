/**
 * 모바일 메뉴 (768px 미만, EXPERIENCE.md Component Patterns › Nav bar · State Patterns › 메뉴 열림)
 * - "메뉴" 버튼이 aria-expanded / aria-controls로 패널을 연다.
 * - 링크 클릭 · Esc · 바깥 클릭으로 닫히고, 닫히면 포커스가 버튼으로 돌아온다.
 * - 열린 동안 본문 스크롤을 잠근다.
 */
const MOBILE_QUERY = '(max-width: 767.98px)';
const OPEN_CLASS = 'is-menu-open';
const LOCK_CLASS = 'is-scroll-locked';

function initMenu(): void {
  const header = document.querySelector<HTMLElement>('[data-site-header]');
  const button = document.querySelector<HTMLButtonElement>('[data-menu-button]');
  const panelId = button?.getAttribute('aria-controls');
  const panel = panelId ? document.getElementById(panelId) : null;
  if (!header || !button || !panel) return;

  let open = false;

  const setOpen = (next: boolean, restoreFocus: boolean) => {
    if (open === next) return;
    open = next;
    button.setAttribute('aria-expanded', String(next));
    header.classList.toggle(OPEN_CLASS, next);
    const root = document.documentElement;
    if (next) {
      const scrollbar = Math.max(0, window.innerWidth - root.clientWidth);
      root.style.setProperty('--scrollbar-compensation', `${scrollbar}px`);
    } else {
      root.style.removeProperty('--scrollbar-compensation');
    }
    root.classList.toggle(LOCK_CLASS, next);
    if (!next && restoreFocus) button.focus({ preventScroll: true });
  };

  button.addEventListener('click', () => setOpen(!open, false));

  // 링크를 누르면 닫고 포커스를 버튼으로 돌려준다.
  // 같은 문서의 앵커는 직접 이동한다. 브라우저 기본 앵커 이동은 포커스를 비워 버려 버튼으로 돌아온 포커스를 잃기 때문이다.
  panel.addEventListener('click', (event) => {
    const link = event.target instanceof Element ? event.target.closest('a') : null;
    if (!open || !link) return;
    setOpen(false, false);

    const sameDocument =
      link.hash !== '' && link.origin === location.origin && link.pathname === location.pathname && link.search === location.search;
    if (sameDocument && !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey) {
      event.preventDefault();
      if (location.hash !== link.hash) history.pushState(null, '', link.hash);
      // behavior 기본값(auto)은 CSS scroll-behavior를 따른다: 평소엔 부드럽게, 모션 감소면 즉시
      document.getElementById(decodeURIComponent(link.hash.slice(1)))?.scrollIntoView({ block: 'start' });
    }
    button.focus({ preventScroll: true });
  });

  document.addEventListener('keydown', (event) => {
    if (open && event.key === 'Escape') {
      event.preventDefault();
      setOpen(false, true);
    }
  });

  document.addEventListener('click', (event) => {
    if (!open || !(event.target instanceof Node)) return;
    if (panel.contains(event.target) || button.contains(event.target)) return;
    setOpen(false, true);
  });

  // Tab으로 패널 밖의 다른 요소로 나가면 닫는다(포커스는 사용자가 옮긴 곳에 둔다)
  header.addEventListener('focusout', (event) => {
    const next = event.relatedTarget;
    if (open && next instanceof Node && !header.contains(next)) setOpen(false, false);
  });

  // 데스크톱 폭으로 바뀌면 패널 상태를 정리한다
  const media = window.matchMedia(MOBILE_QUERY);
  media.addEventListener('change', (event) => {
    if (!event.matches) setOpen(false, false);
  });
}

try {
  initMenu();
} catch (error) {
  document.documentElement.classList.remove(LOCK_CLASS);
  console.error('[menu]', error);
}
