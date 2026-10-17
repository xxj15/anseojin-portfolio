/**
 * 프로젝트 8개 — 홈 카드·상세 페이지·pager가 함께 쓰는 단일 출처.
 * 순서는 최신순(EXPERIENCE.md Information Architecture). 문구·수치는 EXPERIENCE.md Project Card Content Model과
 * 승인된 홈 목업을 그대로 옮기며, 수치를 지어내지 않는다.
 */
import type { ImageMetadata } from 'astro';
import type { RichText } from './types';

import newlearnTimeline from '../assets/projects/newlearn-timeline.png';
import finchHome from '../assets/projects/finch-home.png';
import finchPortfolio from '../assets/projects/finch-portfolio.png';
import banggootWeb from '../assets/projects/banggoot-web.jpg';
import ourwishService from '../assets/projects/ourwish-service.jpg';
import boogleStart from '../assets/projects/boogle-start.jpg';
import moaHome from '../assets/projects/moa-home.jpg';
import devoopsService from '../assets/projects/devoops-service.png';
import mspService from '../assets/projects/msp-service.png';

export type ProjectSlug = 'newlearn' | 'finch' | 'banggoot' | 'ourwish' | 'boogle' | 'moa' | 'devoops' | 'msp';

export interface ProjectImage {
  src: ImageMetadata;
  alt: string;
  /**
   * shot: 화면 캡처(작은 모서리 + 옅은 외곽선)
   * device: 기기 프레임 PNG(프레임 바탕과 곱하기)
   * plain: 그대로(이미 목업이 그려진 이미지)
   * laptop · phone · tablet: CSS 기기 목업에 넣는다(src/components/MediaImage.astro)
   */
  kind: 'shot' | 'device' | 'plain' | 'laptop' | 'phone' | 'tablet';
}

export interface ProjectMedia {
  images: readonly ProjectImage[];
  /** 미디어 프레임 안쪽 여백. 가로로 꽉 찬 캡처는 small. */
  inset: 'default' | 'small';
}

/** 성과 슬롯: 원문에 수치가 있으면 metric, 없으면 성과 문장(outcome). 두 경우의 높이는 같다. */
export type ProjectResult =
  | { kind: 'metric'; value: number; unit: string; label: string }
  | { kind: 'outcome'; text: string; detail: RichText };

export interface Project {
  slug: ProjectSlug;
  name: string;
  /** YYYY.MM */
  period: { start: string; end: string };
  /** 진행 중이면 award-badge 자리에 status-pill "진행 중"을 둔다. */
  status: 'in-progress' | 'completed';
  /** 수상명 원문(줄이지 않는다) */
  award?: string;
  /** 카드 한 줄: 문제와 해결 */
  oneLiner: RichText;
  role: string;
  result: ProjectResult;
  /** 카드 스택(최대 4개, 카드 마지막 줄) */
  stack: readonly string[];
  media: ProjectMedia;
}

export const projects: readonly Project[] = [
  {
    slug: 'newlearn',
    name: 'NEW:LEARN',
    period: { start: '2026.10', end: '2026.11' },
    status: 'in-progress',
    oneLiner:
      '흩어진 뉴스를 사건 단위로 묶어 이슈의 흐름을 보여 주는 AI 뉴스 서비스에서, BMAD로 PRD를 쓰고 SEED Design 기반 디자인 시스템과 프로토타입을 만들었습니다.',
    role: 'UI/UX 디자인 · 기획 · FE',
    result: {
      kind: 'outcome',
      text: 'PRD 작성 → 디자인 시스템 구현 → 프로토타입 완성',
      detail: [{ text: 'FE 구현', tone: 'strong' }, ' 진행 중'],
    },
    stack: ['React', 'TypeScript', 'SEED Design', 'D3.js'],
    media: {
      images: [{ src: newlearnTimeline, alt: 'NEW:LEARN 이슈 타임라인 프로토타입 화면', kind: 'laptop' }],
      inset: 'default',
    },
  },
  {
    slug: 'finch',
    name: 'FINCH',
    period: { start: '2026.08', end: '2026.09' },
    status: 'completed',
    oneLiner:
      'PM으로 화면 20개 프로토타입과 디자인 시스템을 세우고, 배포 중 사용자가 로그아웃되던 인증 문제를 직접 해결했습니다.',
    role: 'PM, UI/UX·디자인 시스템, 인증, FE',
    result: { kind: 'metric', value: 20, unit: '개', label: '화면 프로토타입' },
    stack: ['React', 'TypeScript', 'Spring Security', 'OAuth 2.0'],
    media: {
      images: [
        { src: finchHome, alt: 'FINCH 홈 화면', kind: 'device' },
        { src: finchPortfolio, alt: 'FINCH 포트폴리오 분석 화면', kind: 'device' },
      ],
      inset: 'default',
    },
  },
  {
    slug: 'banggoot',
    name: '방긋',
    period: { start: '2026.07', end: '2026.08' },
    status: 'completed',
    award: 'SSAFY 2학기 공통 프로젝트 우수상 (1위)',
    oneLiner: [
      '임대인과 세입자가 만나지 않고도 하자를 확인하도록, 검수 진입부터 ',
      { text: '실시간 영상·종료', tone: 'nowrap' },
      '까지 하나의 앱 흐름으로 이었습니다.',
    ],
    role: '기획·UI/UX, React Native FE, WebRTC 검수 연동·실기기 검증',
    result: { kind: 'metric', value: 21, unit: '종', label: '공용 컴포넌트 구현(37종 중)' },
    stack: ['React Native', 'TypeScript', 'Expo', 'WebRTC'],
    media: {
      images: [{ src: banggootWeb, alt: '방긋 웹 서비스 화면', kind: 'laptop' }],
      inset: 'default',
    },
  },
  {
    slug: 'ourwish',
    name: 'OURWISH',
    period: { start: '2026.05', end: '2026.06' },
    status: 'completed',
    award: 'SSAFY 1학기 관통 프로젝트 최우수상 (1위)',
    oneLiner:
      '공시금리 대신 ‘내가 실제로 받을 세후 수령액’으로 예·적금을 비교하게 만들고, 588개 조건 조합을 대조해 1원 차이의 원인까지 찾았습니다.',
    role: '기획·UI/UX, FE, AI 챗봇 UI·프롬프트',
    result: { kind: 'metric', value: 588, unit: '개', label: 'FE·BE 조건 조합 대조' },
    stack: ['Vue', 'TypeScript', 'Pinia', 'TailwindCSS'],
    media: {
      images: [{ src: ourwishService, alt: 'OURWISH 서비스 화면', kind: 'laptop' }],
      inset: 'default',
    },
  },
  {
    slug: 'boogle',
    name: 'Boogle',
    period: { start: '2026.01', end: '2026.07' },
    status: 'completed',
    oneLiner:
      '카카오 API의 지점당 45개 조회 제한을 5개 지점 분산·병렬 검색으로 넘어, 카페 밀집 지역의 후보 범위를 넓혔습니다.',
    role: '기획·UI/UX, FE',
    result: {
      kind: 'outcome',
      text: '후보 범위 확대',
      detail: [{ text: '5개', tone: 'strong' }, ' 중심점 분산 + Promise.all 병렬 검색'],
    },
    stack: ['React', 'TypeScript', 'TailwindCSS', 'Kakao Maps/Local API'],
    media: {
      images: [{ src: boogleStart, alt: 'Boogle 시작 화면', kind: 'phone' }],
      inset: 'default',
    },
  },
  {
    slug: 'moa',
    name: 'Moa',
    period: { start: '2025.09', end: '2025.11' },
    status: 'completed',
    oneLiner:
      '팀장으로 webOS 스탠바이미용 가족 공유 홈 화면을 만들고, 스티커를 옮기는 동안 반복되던 저장을 없애 반응 속도를 개선했습니다.',
    role: '팀장, 기획·UI/UX, FE',
    result: { kind: 'outcome', text: '인터랙션 지연 해소', detail: '스티커 이동 중 저장 제거' },
    stack: ['Flutter', 'Dart', 'webOS', 'Luna Service API'],
    media: {
      images: [{ src: moaHome, alt: 'Moa 홈 화면', kind: 'tablet' }],
      inset: 'default',
    },
  },
  {
    slug: 'devoops',
    name: 'DevOops',
    // 기간은 PDF p17 상세 기준(사용자 결정 2026-10-16)
    period: { start: '2025.04', end: '2025.10' },
    status: 'completed',
    award: 'Mash UP 동아리 내 프로젝트 1위',
    oneLiner:
      'PR로 회고 질문을 만드는 서비스에서, 바뀐 답변만 골라 저장하도록 자동 저장을 고쳐 불필요한 API 요청을 줄였습니다.',
    role: '기획, FE',
    result: {
      kind: 'outcome',
      text: '변경된 답변만 저장',
      detail: [{ text: '3초', tone: 'strong' }, ' 무입력 후 병렬 저장'],
    },
    stack: ['Next.js', 'TypeScript', 'TailwindCSS', 'Vercel'],
    media: {
      images: [{ src: devoopsService, alt: 'DevOops 서비스 화면', kind: 'laptop' }],
      inset: 'default',
    },
  },
  {
    slug: 'msp',
    name: 'MoonSunPower',
    period: { start: '2024.09', end: '2025.09' },
    status: 'completed',
    award: '서강 융합기술 경진대회 특별상 (AI/SW상, 인기상)',
    oneLiner:
      '생성형 AI 문해력 학습 서비스를 약 1년간 직접 운영했고, 2025년 3월 기준 월 조회수 9,400회·활성 사용자 318명을 기록했습니다.',
    role: '기획·UI/UX, FE, 서비스 운영',
    result: { kind: 'metric', value: 9400, unit: '회', label: '월 조회수(2025.03)' },
    stack: ['React', 'JavaScript', 'CSS Modules', 'Google Analytics'],
    media: {
      images: [{ src: mspService, alt: 'MoonSunPower 서비스 화면', kind: 'plain' }],
      inset: 'small',
    },
  },
];

/** 카드·상세 헤더의 기간 표기: "YYYY.MM – YYYY.MM" */
export function formatPeriod(period: Project['period']): string {
  return `${period.start} – ${period.end}`;
}

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
