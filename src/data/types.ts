/**
 * 문장 안에서 일부만 다르게 보여야 할 때 쓰는 조각 단위 텍스트.
 * - keyword: 히어로 강조 키워드(primary + 밑줄 띠, 줄바꿈 없음)
 * - nowrap: 어절 묶음이 줄 끝에서 갈라지지 않게 함
 * - strong: 600 굵기 강조
 */
export type SegmentTone = 'keyword' | 'nowrap' | 'strong';

export type Segment = string | { text: string; tone: SegmentTone };

export type RichText = string | readonly Segment[];

/** 조각 텍스트를 평문으로 펼친다(메타 설명·테스트·alt 등). */
export function toPlainText(value: RichText): string {
  if (typeof value === 'string') return value;
  return value.map((segment) => (typeof segment === 'string' ? segment : segment.text)).join('');
}
