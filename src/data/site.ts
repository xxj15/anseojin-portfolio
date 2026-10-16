/**
 * 사이트 공용 콘텐츠: 내비, 히어로(정체성 문장 · keyword-pillar 3개), 연락처.
 * 문구·수치는 EXPERIENCE.md(Project Card Content Model › 히어로 콘텐츠)와 승인된 홈 목업을 그대로 옮긴다.
 */
import type { RichText, Segment } from './types';

export const person = {
  name: '안서진',
  role: 'FRONTEND DEVELOPER',
} as const;

export interface NavItem {
  label: string;
  /** 홈 섹션 id. 대상 섹션이 아직 없어도 링크는 그대로 둔다. */
  sectionId: string;
}

/** 내비 순서는 About이 맨 앞이다(사용자 결정 2026-10-16). 홈 섹션 순서와는 별개다. */
export const navItems: readonly NavItem[] = [
  { label: 'About', sectionId: 'about' },
  { label: 'Projects', sectionId: 'projects' },
  { label: 'Experience', sectionId: 'experience' },
  { label: 'Activities', sectionId: 'activities' },
];

export type IconName =
  | 'trophy'
  | 'arrow-right'
  | 'external'
  | 'download'
  | 'chevron-down';

export interface KeywordPillar {
  number: string;
  title: string;
  body: RichText;
  related: readonly string[];
}

/** 연락처 원문: PDF p2 */
export const contact = {
  email: 'seojini00@naver.com',
  phone: { label: '010-5465-2165', href: 'tel:010-5465-2165' },
  github: { label: 'github.com/xxj15', href: 'https://github.com/xxj15' },
  velog: { label: 'velog.io/@xxj15/posts', href: 'https://velog.io/@xxj15/posts' },
  pdf: {
    /** 버튼 문구는 "label size". size는 줄이 바뀌어도 쪼개지지 않게 한 덩어리로 둔다. */
    label: '포트폴리오 PDF 받기',
    size: '(약 15MB)',
    /** scripts/copy-pdf.mjs가 빌드 전에 루트 PDF를 public/으로 복사한다. */
    href: '/anseojin-portfolio.pdf',
    fileName: 'anseojin-portfolio.pdf',
  },
} as const;

const kw = (text: string): Segment => ({ text, tone: 'keyword' });

export const hero = {
  eyebrow: [person.name, person.role] as const,
  /** h1 정체성 문장. 줄 단위로 리빌되므로 줄마다 나눈다. 강조 키워드 3개는 primary + 밑줄 띠로 칠한다. */
  headlineLines: [
    [kw('기획'), '과 ', kw('UI/UX 디자인'), '을 이해하고,'],
    [kw('사용자 경험'), '과 흐름을 설계하는'],
    ['프론트엔드 개발자'],
  ] as const satisfies readonly (readonly Segment[])[],
  /**
   * keyword-pillar 3개(사용자 결정 2026-10-16). 01·02 제목은 h1 강조어와 같고, 03은 "개발"이다(h1의 "사용자 경험"과 일부러 다름).
   * 관련 줄의 프로젝트명은 링크가 아닌 텍스트다(EXPERIENCE.md Keyword pillar).
   */
  pillars: [
    {
      number: '01',
      title: '기획',
      body: 'FINCH에서 PM을 맡았고, 캐치테이블 재구축에서 서비스 구조와 기능을 설계했습니다.', // PDF p13(FINCH PM) · p29(캐치테이블 재구축)
      related: ['FINCH', 'NEW:LEARN', '캐치테이블 재구축'],
    },
    {
      number: '02',
      title: 'UI/UX 디자인',
      body: 'Figma로 와이어프레임과 주요 화면 흐름을 설계하고, 개발 핸드오프까지 직접 진행했습니다.',
      related: ['NEW:LEARN', 'OURWISH', 'Boogle', 'MoonSunPower'],
    },
    {
      number: '03',
      title: '개발',
      // React·Next.js + TypeScript 프로젝트 중 상세(PDF)에 상태 관리·API 연동이 있는 것:
      // FINCH(세션 관리·인증 Interceptor) · Boogle(Kakao API 연동) · DevOops(TanStack Query · API Client·타입). OURWISH는 Vue라 뺐다.
      body: 'React·TypeScript로 화면 구현부터 상태 관리, API 연동까지 이어지는 프론트엔드 개발을 해왔습니다.',
      related: ['FINCH', 'Boogle', 'DevOops'],
    },
  ] satisfies readonly KeywordPillar[],
} as const;

export const homeMeta = {
  title: '안서진 — 사용자 경험과 흐름을 설계하는 프론트엔드 개발자',
  // 링크 미리보기 문구에는 수치를 넣지 않는다(사용자 결정 2026-10-16)
  description: '기획과 UI/UX 디자인을 이해하고, 사용자 경험과 흐름을 설계하는 프론트엔드 개발자 안서진의 포트폴리오입니다.',
} as const;
