/** 천 단위 쉼표(예: 9400 → "9,400"). 서버 렌더와 카운트업 레이어가 같은 형식을 쓴다. */
export function formatNumber(value: number): string {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? '-' : '';
  return sign + String(Math.abs(rounded)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
