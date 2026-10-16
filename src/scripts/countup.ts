/**
 * 숫자 카운트업 (EXPERIENCE.md Interaction Primitives · Metric stat)
 * - metric-stat이 50% 보이면 1회, 0 → 최종값 900ms ease-out.
 * - DOM 텍스트(.metric-final)는 처음부터 최종값이고 바뀌지 않는다. 움직이는 숫자는 aria-hidden 레이어에만 쓴다.
 * - 모션 감소·IntersectionObserver 미지원이면 아무것도 하지 않는다(최종값 그대로).
 */
import { formatNumber } from '../lib/format';
import { prefersReducedMotion } from './motion';

const DURATION_MS = 900;
const COUNTING = 'is-counting';

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function finish(stat: HTMLElement, layer: HTMLElement): void {
  stat.classList.remove(COUNTING);
  layer.textContent = '';
  stat.dataset.countupDone = 'true';
}

function run(stat: HTMLElement, layer: HTMLElement, target: number): void {
  const start = performance.now();
  const frame = (now: number) => {
    if (stat.dataset.countupDone) return; // 인쇄 등으로 먼저 끝났으면 멈춘다
    const progress = Math.min(1, (now - start) / DURATION_MS);
    layer.textContent = formatNumber(target * easeOutCubic(progress));
    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      finish(stat, layer);
    }
  };
  requestAnimationFrame(frame);
}

function initCountup(): void {
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;

  const stats = Array.from(document.querySelectorAll<HTMLElement>('[data-countup]')).flatMap((stat) => {
    const layer = stat.querySelector<HTMLElement>('[data-countup-layer]');
    const target = Number(stat.dataset.countupValue);
    if (!layer || !Number.isFinite(target) || stat.dataset.countupDone) return [];
    return [{ stat, layer, target }];
  });
  if (stats.length === 0) return;

  const byElement = new Map(stats.map((item) => [item.stat as Element, item]));
  let observer: IntersectionObserver | undefined;
  const finishAll = () => {
    observer?.disconnect();
    stats.forEach(({ stat, layer }) => finish(stat, layer));
  };

  try {
    observer = new IntersectionObserver(
      (entries, self) => {
        for (const entry of entries) {
          // 첫 콜백은 비율이 작아도 올 수 있으므로 50% 이상일 때만 시작한다
          if (!entry.isIntersecting || entry.intersectionRatio < 0.5) continue;
          const item = byElement.get(entry.target);
          if (!item || item.stat.dataset.countupDone) continue;
          self.unobserve(entry.target);
          run(item.stat, item.layer, item.target);
        }
      },
      { threshold: 0.5 },
    );

    for (const { stat, layer } of stats) {
      // 보이기 전에는 0에서 시작하는 모습으로 둔다(시각 전용)
      layer.textContent = formatNumber(0);
      stat.classList.add(COUNTING);
      observer.observe(stat);
    }

    window.addEventListener('beforeprint', finishAll, { once: true });
  } catch (error) {
    finishAll();
    console.error('[countup]', error);
  }
}

try {
  initCountup();
} catch (error) {
  console.error('[countup]', error);
}
