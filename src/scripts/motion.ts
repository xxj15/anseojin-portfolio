/** 모션 공용 유틸. 각 스크립트는 서로 독립적으로 이 함수만 공유한다. */
export function prefersReducedMotion(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
