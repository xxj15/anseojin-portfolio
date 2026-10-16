/**
 * 프로젝트 상세 콘텐츠 — slug별. 이름·기간·수상·스택·한 줄은 projects.ts에서 가져와 카드와 상세가 어긋나지 않게 한다.
 * 문구·수치·링크의 출처:
 * - 7개 프로젝트: 레거시 사이트(Anseojin Portfolio.html)의 상세 화면과 anseojin-portfolio.pdf(p5–p21)
 * - NEW:LEARN: 팀 PRD(prd-S15P31A102-2026-10-14), NEW:LEARN 디자인 시스템 v2 README, 발표 자료 README·화면(프로토타입 v15)
 * - 예정 스택·진행 단계: EXPERIENCE.md(Information Architecture, NEW:LEARN 메모)
 * case-block 라벨은 원문 라벨을 그대로 쓴다. RESULT가 있으면 항상 마지막이다(아래 assertResultLast가 빌드에서 확인).
 * 원문에 없는 수치·사실은 쓰지 않는다.
 */
import type { ImageMetadata } from 'astro';
import { projects, type Project, type ProjectMedia, type ProjectSlug } from './projects';
import type { RichText } from './types';

import ourwishCriteria from '../assets/projects/details/ourwish/recommend-criteria.png';
import ourwishLogic from '../assets/projects/details/ourwish/recommend-logic.png';
import ourwishChatbot1 from '../assets/projects/details/ourwish/chatbot-1.jpg';
import ourwishChatbot2 from '../assets/projects/details/ourwish/chatbot-2.jpg';
import ourwishChatbot3 from '../assets/projects/details/ourwish/chatbot-3.jpg';
import ourwishStreaming from '../assets/projects/details/ourwish/streaming-sequence.png';
import ourwishStructure from '../assets/projects/details/ourwish/frontend-structure.png';
import banggootWeb from '../assets/projects/banggoot-web.jpg';
import banggootAppStart from '../assets/projects/details/banggoot/app-start.jpg';
import banggootAr from '../assets/projects/details/banggoot/ar-inspection.jpg';
import banggootApp1 from '../assets/projects/details/banggoot/app-1.jpg';
import banggootApp2 from '../assets/projects/details/banggoot/app-2.jpg';
import mspPoster from '../assets/projects/details/msp/contest-poster.jpg';
import mspGa0302 from '../assets/projects/details/msp/ga-2025-03-02.jpg';
import mspGa0326 from '../assets/projects/details/msp/ga-2025-03-26.jpg';
import newlearnLanding from '../assets/projects/details/newlearn/landing.png';
import newlearnIssueMap from '../assets/projects/details/newlearn/issue-map.png';
import newlearnMindmap from '../assets/projects/details/newlearn/article-mindmap.png';
import newlearnChangeList from '../assets/projects/details/newlearn/change-list-conflict.png';
import newlearnChangeCard from '../assets/projects/details/newlearn/pattern-change-card.png';

// ---------- types ----------

export interface DetailImage {
  src: ImageMetadata;
  alt: string;
  /** 다이어그램 가로 스크롤 영역의 이름(없으면 alt의 첫 구절) */
  label?: string;
  /** 그림 아래 caption(예: 캡처 날짜) */
  caption?: string;
}

export interface Formula {
  title: string;
  note: string;
  rows: readonly { term: string; expression: string; hint?: string }[];
}

export type BlockContent =
  /** emphasis: ink-primary 600(RESULT 문단은 자동으로 같은 강조) */
  | { kind: 'text'; text: RichText; tone?: 'emphasis' }
  | { kind: 'list'; items: readonly RichText[] }
  /** 단계 흐름: A → B → C */
  | { kind: 'flow'; steps: readonly string[]; title?: string }
  | { kind: 'tags'; items: readonly string[] }
  | { kind: 'formulas'; items: readonly Formula[] }
  /**
   * diagram: 블록 폭 전체(확대하지 않고 맞춤)
   * gallery: 세로형 화면 여러 장을 같은 높이로
   * grid: 가로형 캡처를 2~3열로, 그림마다 caption
   */
  | {
      kind: 'figure';
      layout: 'diagram' | 'gallery' | 'grid';
      images: readonly DetailImage[];
      note?: string;
      /** diagram을 블록 폭보다 좁게(가운데) 둔다. 자체 여백이 큰 미리보기 이미지용 */
      compact?: boolean;
    };

export interface CaseBlock {
  /** 원문 라벨(예: WHY · VALIDATION · CALCULATION · HOW 01 · RESULT · ISSUE · APPROACH · 01) */
  label?: string;
  title?: string;
  content: readonly BlockContent[];
  /** 블록 끝의 secondary 버튼(선택) */
  action?: DetailLink;
}

/** 한 면에 나란히 놓는 두 블록(예: WHY + VALIDATION) */
export interface CaseBlockPair {
  pair: readonly [CaseBlock, CaseBlock];
}

export type CaseRow = CaseBlock | CaseBlockPair;

export interface DetailLink {
  label: string;
  /** external: 외부 URL, asset: 사이트에 함께 올린 파일(base 경로를 거친다). 둘 다 새 탭으로 연다. */
  kind: 'external' | 'asset';
  href: string;
}

export interface CaseStudy {
  /** 영문 섹션 라벨(CASE 01, STEP 01) */
  label: string;
  title: string;
  lead?: readonly RichText[];
  rows: readonly CaseRow[];
}

export interface Highlights {
  /** 원문 제목: 주요 구현 및 개선 · 트러블슈팅 */
  heading: string;
  items: readonly { title: RichText; detail?: RichText }[];
}

export interface ProjectDetail {
  /** <title>의 짧은 요약(PDF p5 프로젝트 목록 문구 기준) */
  titleSummary: string;
  /** 상세 리드 한 줄(원문의 "설명") */
  lead: RichText;
  /** 상세 역할(원문 그대로, Frontend → 프론트엔드) */
  role: string;
  team?: string;
  /** 카드 스택(projects.ts) 뒤에 붙는 상세 전용 스택 */
  extraStack?: readonly string[];
  /** 아직 쓰지 않은 기술(사용 예정). 카드 스택·extraStack에 들어 있는 이름이어야 한다. */
  plannedStack?: readonly string[];
  /** 상세 헤더 버튼. 원문에 링크가 있는 것만 둔다(첫 번째가 primary). */
  links: readonly DetailLink[];
  /** 상세 헤더 미디어. 없으면 카드 미디어(projects.ts)를 쓴다. */
  headerMedia?: ProjectMedia;
  highlights?: Highlights;
  cases: readonly CaseStudy[];
}

// ---------- content ----------

const github = (href: string): DetailLink => ({ label: 'GitHub', kind: 'external', href });
const service = (href: string): DetailLink => ({ label: '서비스 바로가기', kind: 'external', href });

export const PROTOTYPE_PATH = '/prototypes/newlearn-v15.html';

export const projectDetails: Record<ProjectSlug, ProjectDetail> = {
  newlearn: {
    titleSummary: '이슈의 흐름을 보여 주는 AI 뉴스 서비스',
    lead: '기사를 AI로 구조화해 마인드맵으로 보여 주고, 관련 기사를 사건 단위로 이어 이슈의 전개를 탐색하는 AI 뉴스 서비스',
    role: 'UI/UX 디자인, 기획, 프론트엔드 개발',
    team: '6명 (PM 1 · 디자인·FE 1 · AI 2 · BE 2)',
    extraStack: ['Vite', 'TailwindCSS', 'TanStack Query', 'Zustand', 'Axios', 'React Router'],
    plannedStack: ['Vite', 'TailwindCSS', 'D3.js', 'TanStack Query', 'Zustand', 'Axios', 'React Router'],
    links: [{ label: '프로토타입 보기', kind: 'asset', href: PROTOTYPE_PATH }],
    cases: [
      {
        label: 'STEP 01',
        title: '서비스 소개',
        lead: [
          [
            '흩어진 뉴스를 ',
            { text: '카테고리 → 이슈 → 사건 → 기사', tone: 'strong' },
            ' 순서로 정리하고, 무엇이 바뀌었는지 원문 근거와 함께 보여 주는 웹 서비스입니다.',
          ],
        ],
        rows: [
          {
            label: 'BACKGROUND',
            content: [
              {
                kind: 'list',
                items: [
                  '취업을 준비하다 보면 시사 이슈를 묻는 자소서 문항을 만나고, 면접 전에는 지원하는 산업의 최근 흐름을 설명할 수 있어야 합니다.',
                  '하나의 이슈를 다룬 기사는 여러 언론사에 몇 주, 몇 달에 걸쳐 흩어져 있어, 무엇이 새로 나왔고 처음 보도와 무엇이 달라졌는지 직접 비교해야 합니다.',
                ],
              },
            ],
          },
          {
            label: 'STRUCTURE',
            content: [
              { kind: 'flow', steps: ['① 이슈 에볼루션 맵', '② 사건', '③ 기사 마인드맵'] },
              {
                kind: 'list',
                items: [
                  [{ text: '이슈를 본다', tone: 'strong' }, ': 같은 사건의 기사를 하나로 묶고, 사건을 시간 순서로 이어 흐름과 변화 카드를 보여 줍니다.'],
                  [{ text: '사건을 본다', tone: 'strong' }, ': 어떤 언론이 그 사건을 어떻게 보도했는지, 그 사건에서 무엇이 바뀌었는지 보여 줍니다.'],
                  [{ text: '기사를 본다', tone: 'strong' }, ': 기사 하나의 인물·기관·사건·시점·배경·결과를 마인드맵으로 구조화합니다.'],
                ],
              },
              { kind: 'text', text: '기사의 진위는 판정하지 않습니다. 보도가 엇갈리면 상충 후보로 보여 주고, 판단은 근거를 본 사용자에게 맡깁니다.' },
            ],
          },
        ],
      },
      {
        label: 'STEP 02',
        title: 'BMAD로 PRD 작성',
        lead: ['팀이 무엇을 만들지 합의하기 위한 기준 문서로, AI 협업 개발 방법론 BMAD를 활용해 PRD를 작성했습니다.'],
        rows: [
          {
            label: 'PRD',
            content: [
              {
                kind: 'list',
                items: [
                  [{ text: '요구사항 32개', tone: 'strong' }, '에 우선순위(P0 · P1 · P2)를 붙이고, MVP 범위와 하지 않는 것을 정리했습니다.'],
                  '동일 사건 클러스터링, 주장 관계 판정처럼 AI가 만드는 결과는 검증 지표 초안을 함께 정의했습니다.',
                  '팀이 모여서 정해야 할 질문은 급한 순서로 모아 회의 안건으로 정리했습니다.',
                ],
              },
            ],
          },
          {
            label: 'USER FLOW',
            content: [
              { kind: 'flow', title: 'Flow A · 이슈부터', steps: ['홈', '분야 · 추천 이슈', '이슈', '이슈 에볼루션 맵', '사건', '기사', '기사 마인드맵'] },
              { kind: 'flow', title: 'Flow B · 기사부터', steps: ['기사 선택 · URL', 'AI 분석', '기사 마인드맵', '소속 이슈', '이슈 에볼루션 맵'] },
              { kind: 'text', text: '어느 길로 들어와도 이슈 에볼루션 맵과 기사 마인드맵을 오가며, 무엇이 달라졌는지와 그 근거를 확인합니다.' },
            ],
          },
        ],
      },
      {
        label: 'STEP 03',
        title: 'SEED Design 기반 디자인 시스템',
        lead: [
          '당근의 오픈소스 디자인 시스템 SEED(Apache 2.0)를 기반으로, 프로토타입마다 화면이 달라지지 않도록 NEW:LEARN 디자인 시스템을 정리했습니다.',
        ],
        rows: [
          {
            label: 'FOUNDATION',
            content: [
              {
                kind: 'list',
                items: [
                  '색상 역할 · 타이포그래피 · 간격 · 모션 · 아이콘은 SEED를 그대로 쓰고, 그 위에 NEW:LEARN의 민트 브랜드 색과 로고를 더했습니다.',
                  '라이트 테마로 고정하고, 밝은 민트는 그래픽에만, 행동을 부르는 버튼과 브랜드 글자는 진한 청록으로 나눠 글자 대비를 지켰습니다.',
                ],
              },
            ],
          },
          {
            label: 'PATTERNS',
            content: [
              { kind: 'text', text: '서비스에서 반복되는 화면 단위 6종을 패턴으로 정리했습니다.' },
              { kind: 'tags', items: ['추천 이슈 카드', '최신 기사 리스트', '카테고리 탭과 필터', '사건 상세 패널', '타임라인 노드', '변화 카드'] },
              {
                kind: 'figure',
                layout: 'diagram',
                compact: true,
                images: [
                  {
                    src: newlearnChangeCard,
                    label: '변화 카드 패턴 미리보기',
                    alt: '변화 카드 패턴: 이전 근거와 이후 근거를 나란히 놓은 갱신(UPDATE) 카드와, 어느 쪽이 맞는지 판정하지 않고 두 보도를 함께 보여 주는 상충 후보(CONFLICT) 카드',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        label: 'STEP 04',
        title: '프로토타입',
        lead: ['디자인 시스템으로 핵심 흐름을 화면으로 옮긴 프로토타입입니다. 아래는 v15 화면이며, 원본은 새 탭에서 직접 눌러 볼 수 있습니다.'],
        rows: [
          {
            content: [
              {
                kind: 'figure',
                layout: 'grid',
                note: '화면 속 언론사, 기사 제목, 발행 시각은 프로토타입용 가상 데이터입니다.',
                images: [
                  { src: newlearnLanding, alt: 'NEW:LEARN 랜딩 화면: 기사는 많아도, 이슈는 한 흐름으로.', caption: '랜딩' },
                  {
                    src: newlearnIssueMap,
                    alt: '이슈 에볼루션 맵: 한 이슈의 사건 8개를 메인 흐름과 반응으로 나눠 시간순으로 이은 타임라인',
                    caption: '이슈 에볼루션 맵',
                  },
                  {
                    src: newlearnMindmap,
                    alt: '기사 마인드맵: 기사 한 건의 핵심 정보를 누가·언제·어디서·무엇을·어떻게·왜 노드로 펼치고 관련 기사를 점선으로 이은 화면',
                    caption: '기사 마인드맵',
                  },
                  {
                    src: newlearnChangeList,
                    alt: '변화 목록: 같은 날 두 언론사가 다르게 보도한 엔지니어 규모(약 900명과 1,500명)를 판정 없이 상충 후보로 보여 주는 카드',
                    caption: '변화 목록 · 상충 후보',
                  },
                ],
              },
            ],
            action: { label: '프로토타입 보기', kind: 'asset', href: PROTOTYPE_PATH },
          },
          {
            label: 'NEXT',
            content: [{ kind: 'text', text: '지금은 이 프로토타입을 바탕으로 FE 구현을 진행하고 있습니다. 진행에 따라 이 페이지를 갱신합니다.' }],
          },
        ],
      },
    ],
  },

  finch: {
    titleSummary: '포트폴리오 기반 AI 주식 투자 어시스턴트',
    lead: '보유종목과 투자 기록을 바탕으로 포트폴리오 분석과 투자 판단을 돕는 AI 주식 투자 어시스턴트',
    role: 'PM, UI/UX·디자인 시스템 설계, 인증 구현, 프론트엔드 개발',
    extraStack: ['JWT', 'Redis'],
    links: [service('https://finchapp.org/login'), github('https://github.com/Team-FINCH/finch-frontend')],
    highlights: {
      heading: '주요 구현 및 개선',
      items: [
        {
          title: '서비스 기획 및 디자인 시스템 구축',
          detail: 'PRD·사용자 흐름·화면 20개 프로토타입 작성, 디자인 시스템 및 Voice & Tone 가이드 수립',
        },
        { title: 'Kakao OAuth·JWT 인증 구현', detail: '로그인부터 JWT 발급·검증·재발급·로그아웃까지 프론트엔드·백엔드 인증 흐름 구현' },
        {
          title: '포트폴리오 분석 화면 및 서비스 안정성 개선',
          detail: '수익률·위험 진단 UI 구현, 인증 경합·배포 중 비정상 로그아웃 및 번들 크기 문제 해결',
        },
      ],
    },
    cases: [
      {
        label: 'CASE 01',
        title: 'Kakao OAuth·JWT 인증 구현',
        lead: [
          '카카오 로그인부터 JWT 발급·재발급과 세션 복구까지 이어지는 프론트엔드·백엔드 인증 흐름을 구현하고, 실제 배포 환경에서 발생한 인증 오류를 개선했습니다.',
        ],
        rows: [
          {
            label: '01',
            title: 'OAuth·JWT 인증 흐름 구현',
            content: [
              {
                kind: 'list',
                items: [
                  'Spring Security 기반 Kakao OAuth 로그인 API와 JWT Access·Refresh Token 발급·검증 로직을 구현했습니다.',
                  '인증 Filter와 @LoginUser Resolver를 적용하고, 재발급·로그아웃 API까지 연결했습니다.',
                ],
              },
            ],
          },
          {
            label: '02',
            title: '프론트엔드 세션 관리 구현',
            content: [
              {
                kind: 'list',
                items: [
                  'HTTP 인증 Interceptor를 구성해 401 발생 시 Access Token을 자동 재발급하도록 구현했습니다.',
                  '앱 부팅 시 세션 복구와 Route Guard를 적용해 로그인 상태에 따라 화면 접근을 제어했습니다.',
                ],
              },
            ],
          },
          {
            label: '03',
            title: '인증 안정성 개선',
            content: [
              {
                kind: 'list',
                items: [
                  '로그인 Callback과 세션 복구가 동시에 실행되며 Refresh Token이 서로 무효화되는 요청 경합 문제를 해결했습니다.',
                  [
                    '롤링 배포 중 일시적인 502를 인증 실패로 판단해 로그아웃되던 문제를 ',
                    { text: '명시적 인증 거절과 일시적 오류로 분리', tone: 'strong' },
                    '하고 재시도하도록 개선했습니다.',
                  ],
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  banggoot: {
    titleSummary: 'AR 원격 하자 검수 월세 관리 서비스',
    lead: 'AR 원격 하자 검수와 월세 관리를 통해 임대인·세입자의 임대차 관리를 돕는 모바일 서비스',
    role: '서비스 기획 및 UI/UX 디자인, React Native 앱 프론트엔드 개발, WebRTC 기반 실시간 검수 연동 및 실제 단말 검증',
    extraStack: ['NativeWind', 'ARCore'],
    links: [
      { label: '서비스 바로가기', kind: 'external', href: 'https://banggoot.com/' },
      { label: '소개 영상 보기', kind: 'external', href: 'https://www.youtube.com/watch?v=83-KALu8I9s&t=3s' },
    ],
    headerMedia: {
      images: [
        { src: banggootWeb, alt: '방긋 웹 서비스 화면', kind: 'shot' },
        { src: banggootAppStart, alt: '방긋 앱 시작 화면', kind: 'shot' },
      ],
      inset: 'default',
    },
    highlights: {
      heading: '주요 구현 및 개선',
      items: [
        { title: '임대인·세입자 사용자 흐름 기획 및 UI/UX 설계', detail: '월세 관리부터 하자 등록·검수까지 이어지는 역할별 모바일 화면 설계' },
        { title: 'React Native 기반 앱 프론트엔드 개발', detail: '집 관리, 월세 관리, 하자 확인 등 주요 서비스 화면과 사용자 인터랙션 구현' },
        { title: '실시간 하자 검수 기능 연동', detail: 'WebRTC 기반 영상 통신과 Unity AR 도면 기능을 React Native 앱의 검수 흐름에 연결' },
      ],
    },
    cases: [
      {
        label: 'CASE 01',
        title: 'React Native 프론트엔드 구현',
        lead: [
          '임대인과 세입자가 월세 관리부터 하자 확인·검수까지 하나의 앱에서 이용할 수 있도록 주요 화면과 사용자 흐름을 React Native로 구현했습니다.',
        ],
        rows: [
          {
            label: '01',
            title: '역할별 사용자 흐름 설계',
            content: [
              {
                kind: 'list',
                items: [
                  '임대인·세입자의 이용 목적에 맞춰 화면과 기능 흐름을 구성했습니다.',
                  '집을 중심으로 월세 관리, 하자 확인, 검수 기능이 이어지도록 설계했습니다.',
                ],
              },
            ],
          },
          {
            label: '02',
            title: '주요 서비스 화면 구현',
            content: [
              {
                kind: 'list',
                items: [
                  '집 등록·계약·월세·하자·수리·퇴거 등 임대인 도메인의 주요 화면과 상태 흐름을 구현했습니다.',
                  '기획과 UI/UX 디자인을 실제 React Native 화면과 인터랙션으로 구현했습니다.',
                  ['공용 UI 컴포넌트 ', { text: '37종 중 21종', tone: 'strong' }, '을 구현해 카드·버튼·탭바 등 화면 표현을 통일했습니다.'],
                ],
              },
              {
                kind: 'figure',
                layout: 'gallery',
                images: [
                  { src: banggootApp1, alt: '방긋 앱 화면 1' },
                  { src: banggootApp2, alt: '방긋 앱 화면 2' },
                ],
              },
            ],
          },
          {
            label: '03',
            title: '하자 검수 흐름 연결',
            content: [
              {
                kind: 'list',
                items: [
                  '하자 확인 화면에서 실시간 검수 기능으로 이어지는 진입 흐름을 구성했습니다.',
                  '여러 기능이 하나의 모바일 사용자 경험으로 연결되도록 화면 흐름을 구현했습니다.',
                ],
              },
              { kind: 'figure', layout: 'gallery', images: [{ src: banggootAr, alt: '방긋 AR 하자 검수 화면' }] },
            ],
          },
        ],
      },
      {
        label: 'CASE 02',
        title: 'WebRTC 실시간 검수 기능 연동 및 검증',
        lead: [
          'WebRTC 기반 영상 통신 기능을 React Native 검수 흐름에 연결하는 과정에 참여하고, 실제 기기에서 영상 송수신과 화면 전환을 반복 검증했습니다.',
        ],
        rows: [
          {
            label: '01',
            title: 'WebRTC 영상 스트림과 React Native UI 연결',
            content: [
              {
                kind: 'list',
                items: [
                  '기존 WebRTC 기반 영상 통신 기능을 React Native 검수 화면에 적용했습니다.',
                  '상대 단말의 실시간 영상이 모바일 화면에 표시되도록 영상 통신 기능과 UI를 연결했습니다.',
                  '사용자가 검수 과정에서 바로 영상 확인으로 진입할 수 있도록 화면 흐름을 구성했습니다.',
                ],
              },
            ],
          },
          {
            label: '02',
            title: 'RTC 세션과 앱 화면 흐름 연결',
            content: [
              { kind: 'flow', steps: ['검수 진입', '영상 확인', '검수 종료'] },
              {
                kind: 'list',
                items: [
                  '실시간 영상 기능이 별도의 화면으로 분리되지 않도록 검수 진입 → 영상 확인 → 검수 종료 흐름과 연결했습니다.',
                  '영상 검수가 시작되고 종료되는 시점에 맞춰 React Native 화면이 전환되도록 구성해, 통신 기능의 동작과 앱의 사용자 흐름을 하나의 검수 과정으로 연결했습니다.',
                ],
              },
            ],
          },
          {
            label: '03',
            title: '모바일 환경에서 통합 동작 검증',
            content: [
              {
                kind: 'list',
                items: [
                  'WebRTC 기능은 실제 단말 간 통신이 포함되기 때문에, 실제 모바일 기기에서 영상 송수신과 화면 전환을 함께 점검했습니다.',
                  'React Native 화면과 영상 통신 기능이 함께 동작하는 과정에서 검수 진입부터 종료까지 흐름이 정상적으로 이어지는지 확인했습니다.',
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  ourwish: {
    titleSummary: '사회초년생을 위한 예·적금 추천 서비스',
    lead: '사회초년생을 위한 예·적금 추천 서비스',
    role: '기획 및 UI/UX 디자인, 프론트엔드 개발, AI 챗봇 UI·프롬프트 설계',
    extraStack: ['Vercel', 'Figma'],
    links: [service('https://our-wish.site/'), github('https://github.com/Our-Wish/ourwish')],
    highlights: {
      heading: '주요 구현 및 개선',
      items: [
        { title: 'BaaS 연동을 고려한 예·적금 추천 흐름 기획', detail: '사용자 조건과 금융 상품 데이터를 연결하는 구조 설계' },
        {
          title: 'AI 챗봇 기반 금융 설명 기능 구현',
          detail: '추천 상품에 대해 사용자가 추가 질문할 수 있도록 챗봇 UI를 구현하고, 추천 기준과 답변 형식을 프롬프트에 정의',
        },
        {
          title: '프론트엔드 구조 및 상태 관리 개선',
          detail: '페이지, 컴포넌트, 서비스 로직을 분리하고 Pinia Store를 활용해 사용자 입력값과 추천 결과 데이터를 일관되게 관리',
        },
      ],
    },
    cases: [
      {
        label: 'CASE 01',
        title: '예상 세후 수령액 기반 금융상품 추천 기준 설계',
        lead: [
          [
            { text: '상품 조건과 사용자별 우대조건을 반영', tone: 'strong' },
            '해 예상 세후 수령액을 계산하고, 이를 개인화 상품 추천 기준으로 활용했습니다.',
          ],
        ],
        rows: [
          {
            pair: [
              {
                label: 'WHY',
                content: [
                  {
                    kind: 'list',
                    items: [
                      '공시금리만으로는 사용자가 실제로 받을 수 있는 혜택을 비교하기 어렵습니다.',
                      '개인의 가입 조건을 반영한 실질적인 상품 비교 기준이 필요합니다.',
                    ],
                  },
                ],
              },
              {
                label: 'VALIDATION',
                content: [
                  {
                    kind: 'text',
                    tone: 'emphasis',
                    text: [
                      'FE·BE 588개 조건 조합을 대조해 8건의 ',
                      { text: '1원 차이', tone: 'nowrap' },
                      '를 확인하고, ',
                      { text: 'Decimal·부동소수점', tone: 'nowrap' },
                      ' 절사 경계가 원인임을 규명했습니다.',
                    ],
                  },
                ],
              },
            ],
          },
          {
            label: 'CALCULATION',
            content: [
              { kind: 'text', text: '상품 유형에 따라 단리·월복리를 분기하고, 일반과세 15.4%와 원 미만 절사를 적용했습니다.' },
              {
                kind: 'formulas',
                items: [
                  {
                    title: '적금',
                    note: '납입 회차마다 이자 적용 기간이 다릅니다.',
                    rows: [
                      {
                        term: '세전 이자',
                        expression: '월 납입액 × (연 금리 ÷ 12) × 회차별 예치기간의 합',
                        hint: '12개월 기준 12 + 11 + … + 1 = 78',
                      },
                      { term: '세후 수령액', expression: '총 납입 원금 + 세전 이자 × (1 − 15.4%)' },
                    ],
                  },
                  {
                    title: '예금',
                    note: '전체 원금이 가입 기간 동안 동일하게 예치됩니다.',
                    rows: [
                      { term: '세전 이자', expression: '예치 원금 × 연 금리 × (가입 개월 수 ÷ 12)' },
                      { term: '세후 수령액', expression: '원금 + 세전 이자 × (1 − 15.4%)' },
                    ],
                  },
                ],
              },
            ],
          },
          {
            label: 'HOW 01',
            title: '추천 기준 설계',
            content: [
              { kind: 'text', text: '단순 최고금리가 아닌, 사용자 조건을 반영한 ‘예상 세후 수령액’을 상품 비교 기준으로 정의했습니다.' },
              {
                kind: 'figure',
                layout: 'diagram',
                images: [
                  {
                    src: ourwishCriteria,
                    label: '추천 기준 설계 다이어그램',
                    alt: '추천 기준 설계: 사용자 중심 목표(‘그래서 내가 얼마 받는지’를 바로 알게)에서 사용자가 체감하는 차별점(정보 제공·쉬운 이해·가입 이후)과 이를 가능케 한 기술 의사결정(후보 풀·우대조건·태그 매칭)으로 이어지는 다이어그램',
                  },
                ],
              },
            ],
          },
          {
            label: 'HOW 02',
            title: '개인화 수령액 계산 및 추천 로직',
            content: [
              { kind: 'flow', steps: ['후보 상품 필터링', '우대조건 판별', '세후 수령액 계산', '추천 결과 생성'] },
              {
                kind: 'figure',
                layout: 'diagram',
                images: [{ src: ourwishLogic, label: '개인화 수령액 계산 및 추천 로직 다이어그램', alt: '후보 상품 필터링 → 우대조건 판별 → 세후 수령액 계산 → 추천 결과 생성' }],
              },
            ],
          },
        ],
      },
      {
        label: 'CASE 02',
        title: 'AI 챗봇의 실시간 대화 경험 구현',
        lead: [
          [
            '금융상품 추천 결과를 쉽게 이해할 수 있도록 ',
            { text: '서버의 AI Streaming 응답을 실시간으로 렌더링하는 챗봇 UI를 구현', tone: 'strong' },
            '했습니다.',
          ],
        ],
        rows: [
          {
            label: 'WHY',
            content: [
              {
                kind: 'list',
                items: [
                  '긴 AI 답변이 한 번에 표시되면 사용자가 응답을 기다리는 시간이 길게 느껴질 수 있었습니다.',
                  ['상품 추천, 일반 설명 등 ', { text: '응답의 성격에 따라 정보를 다르게 보여 줄 필요', tone: 'strong' }, '가 있었습니다.'],
                ],
              },
            ],
          },
          {
            label: 'HOW',
            content: [
              {
                kind: 'list',
                items: [
                  '상품 추천 결과는 카드 형태로, 일반 답변은 텍스트 형태로 구분해 UI를 설계했습니다.',
                  ['서버 응답을 ReadableStream으로 받아 ', { text: 'chunk 단위로 화면에 실시간 렌더링', tone: 'strong' }, '했습니다.'],
                  'Streaming 시작·진행·종료 상태를 관리해 응답 생성 중에도 사용자가 진행 상황을 확인할 수 있도록 했습니다.',
                  '상품 요약과 챗봇 답변이 생활 상황 중심의 쉬운 표현으로 생성되도록 프롬프트 규칙을 설계했습니다.',
                ],
              },
              {
                kind: 'figure',
                layout: 'gallery',
                images: [
                  { src: ourwishChatbot1, alt: 'OURWISH 챗봇 첫 화면: 인사말과 추천 질문 3개' },
                  { src: ourwishChatbot2, alt: 'OURWISH 챗봇 답변 화면: 만기 후 이자율을 예시와 함께 설명' },
                  { src: ourwishChatbot3, alt: 'OURWISH 챗봇이 상품과 관련 없는 주가 질문에는 답하지 않고 상품 설명으로 안내하는 화면' },
                ],
              },
              {
                kind: 'figure',
                layout: 'diagram',
                images: [
                  {
                    src: ourwishStreaming,
                    label: 'AI Streaming 응답 시퀀스 다이어그램',
                    alt: 'AI Streaming 응답 시퀀스: 브라우저(Chat.vue)가 메시지를 POST로 보내면 Django가 최근 5턴과 상품 정보를 담아 LLM에 stream=True로 요청하고, 받은 delta 조각을 text/plain 스트림으로 브라우저에 전달해 답변이 실시간으로 흘러나오는 흐름',
                  },
                ],
              },
            ],
          },
          {
            label: 'RESULT',
            content: [
              {
                kind: 'text',
                text: 'AI 응답을 기다린 뒤 한 번에 보여 주는 방식이 아니라 수신되는 즉시 화면에 전달해, 체감 대기 시간을 줄이고 자연스러운 대화 경험을 구현했습니다.',
              },
            ],
          },
        ],
      },
      {
        label: 'CASE 03',
        title: '확장 가능한 프론트엔드 구조 설계',
        lead: [
          [
            '사용자 인증부터 상품 탐색, 찜, 가입 및 관리까지 이어지는 ',
            { text: '서비스 흐름을 고려해 컴포넌트 구조와 전역 상태 관리 방식을 설계', tone: 'strong' },
            '했습니다.',
          ],
        ],
        rows: [
          {
            label: 'WHY',
            content: [
              {
                kind: 'list',
                items: [
                  ['기능이 확장되며 여러 화면에서 ', { text: '사용자·상품 상태', tone: 'strong' }, '를 공유해야 했습니다.'],
                  ['상태가 한 곳에 집중되지 않도록 ', { text: '기능별 책임과 상태 범위를 분리', tone: 'strong' }, '하고자 했습니다.'],
                ],
              },
            ],
          },
          {
            label: 'HOW',
            content: [
              {
                kind: 'list',
                items: [
                  '페이지·컴포넌트·서비스 로직을 책임별로 분리했습니다.',
                  ['auth, goal, enrollment, favorites 등 ', { text: '도메인별 Pinia Store', tone: 'strong' }, '를 구성했습니다.'],
                  '공통 데이터는 전역 상태로, 화면 내부 데이터는 지역 상태로 구분했습니다.',
                ],
              },
              {
                kind: 'figure',
                layout: 'diagram',
                images: [
                  {
                    src: ourwishStructure,
                    label: 'Vue 컴포넌트 구조 다이어그램',
                    alt: 'Vue 컴포넌트 구조: 진입점(main.ts → App.vue → router) → 페이지 9개 → 기능별 컴포넌트 → Pinia 스토어 6개(auth · enrollment · favorites · videoFavorites · goal · marketRates)와 api · types · constants · utils 순서로 위에서 아래로 의존하는 구조',
                  },
                ],
              },
            ],
          },
          {
            label: 'RESULT',
            content: [{ kind: 'text', text: '기능별 책임과 상태 범위를 명확히 해 기능 확장 시 변경 범위를 줄이고 유지보수성을 높였습니다.' }],
          },
        ],
      },
    ],
  },

  boogle: {
    titleSummary: '신촌·홍대 카공 카페 큐레이션 서비스',
    lead: '신촌·홍대 지역 대학생을 위한 맞춤형 카페 큐레이션 서비스',
    role: '기획 및 UI/UX 디자인, 프론트엔드 개발',
    extraStack: ['Vercel', 'Figma'],
    links: [service('https://boogle.my/'), github('https://github.com/CafeBoogle/boogle-frontend')],
    highlights: {
      heading: '트러블슈팅',
      items: [
        { title: '카카오 Local API 지점별 최대 45개 조회 제한', detail: '5개 중심점 분산 검색 + Promise.all 병렬 요청으로 후보 범위 확대' },
        { title: '소셜 로그인 후 사용자 정보 조회 실패', detail: '403·CORS 오류를 추적해 개발 Origin 허용 목록 누락을 확인하고 해결' },
      ],
    },
    cases: [
      {
        label: 'CASE 01',
        title: '외부 API 제약을 고려한 데이터 수집 개선',
        rows: [
          {
            label: 'ISSUE',
            content: [
              {
                kind: 'text',
                text: '카카오 Places API의 검색 결과 개수 제한으로 인해 단일 좌표·반경 검색만으로는 카페 밀집 지역의 데이터를 충분히 확보하기 어려웠습니다.',
              },
            ],
          },
          {
            label: 'APPROACH',
            content: [
              {
                kind: 'list',
                items: [
                  '검색 좌표를 중앙·상·하·좌·우 5개 지점으로 분산하고 Promise.all로 API 요청을 병렬 처리했습니다.',
                  '카카오 ID 기반 중복 제거 → 거리 재필터링 → category_name 기반 업종 제외 과정을 적용했습니다.',
                ],
              },
            ],
          },
          {
            label: 'RESULT',
            content: [
              {
                kind: 'text',
                text: '외부 API의 제약 안에서 호출 전략 → 중복 제거 → 거리·카테고리 필터링으로 이어지는 데이터 수집·정제 흐름을 구성해, 검색 범위를 넓히면서 서비스 범위와 조건에 맞는 데이터만 노출했습니다.',
              },
            ],
          },
        ],
      },
      {
        label: 'CASE 02',
        title: '소셜 로그인 환경별 인증 흐름 문제 해결',
        rows: [
          {
            label: 'ISSUE',
            content: [
              {
                kind: 'text',
                text: '로컬과 배포 환경에서 OAuth callback 주소와 Origin 설정이 달라, 로그인 후 사용자 정보 조회가 정상적으로 동작하지 않았습니다.',
              },
            ],
          },
          {
            label: 'APPROACH',
            content: [
              {
                kind: 'list',
                items: [
                  'window.location.origin을 redirect 값으로 전달해 실행 환경별 callback 주소를 동적으로 결정했습니다.',
                  '환경별 Cookie·CORS 설정과 요청 Origin을 점검해 OAuth → Cookie → /api/user/me 흐름을 정상화했습니다.',
                ],
              },
            ],
          },
          {
            label: 'RESULT',
            content: [
              {
                kind: 'text',
                text: 'Redirect URI → Cookie → CORS → 사용자 정보 조회로 이어지는 인증 흐름을 점검·개선해, 로컬과 배포 환경 모두에서 동일한 OAuth 로그인 흐름이 정상적으로 동작하도록 했습니다.',
              },
            ],
          },
        ],
      },
    ],
  },

  moa: {
    titleSummary: 'webOS 스탠바이미 가족 공유 홈 화면',
    lead: '가족의 그림, 사진, 일상을 ‘모아’ 한 공간에서 공유하고 소통할 수 있도록 돕는 webOS 기반 스탠바이미 전용 홈 화면 프로젝트',
    role: '팀장, 기획 및 UI/UX 디자인, 프론트엔드 개발',
    extraStack: ['Figma'],
    links: [github('https://github.com/xxj15/moa-showcase.git')],
    highlights: {
      heading: '트러블슈팅',
      items: [
        {
          title: 'webOS 시스템 API 호출 구조 파악',
          detail: '일반 웹과 다른 webOS 시스템 API 호출 구조를 파악하고 Luna Service API를 앱 기능에 연결',
        },
        { title: '스티커 이동 시 반복 저장으로 인터랙션 지연', detail: '이동 중 저장 처리를 제거해 반응 속도 개선' },
      ],
    },
    cases: [],
  },

  devoops: {
    titleSummary: 'PR 기반 질문 생성 개발자 회고 서비스',
    lead: 'PR 내용을 자동으로 분석해 AI가 회고 질문을 만들어 주는 서비스',
    role: '기획, 프론트엔드 개발',
    extraStack: ['TanStack Query'],
    links: [github('https://github.com/mash-up-kr/devoops-web')],
    highlights: {
      heading: '트러블슈팅',
      items: [
        {
          title: '자동 저장 시 변경되지 않은 답변까지 반복 저장되어 불필요한 API 요청 발생',
          detail: 'lastSavedRef로 변경된 답변만 추적하고 Promise.all로 병렬 저장',
        },
        { title: 'API 스펙 변경 시 요청·응답 타입 수동 관리', detail: 'OpenAPI 기반 API Client·Type을 적용해 스펙 변경 대응' },
      ],
    },
    cases: [
      {
        label: 'CASE 01',
        title: '회고 작성 플로우 구현',
        lead: [
          'Next.js와 TypeScript 기반으로 PR별 회고 상세 화면을 구현하고, 질문 생성·수정·삭제 및 답변 작성 API를 연결했습니다. 질문과 답변 상태에 따라 화면을 갱신하며 회고 작성부터 완료까지 이어지는 사용자 흐름을 구성했습니다.',
        ],
        rows: [{ content: [{ kind: 'flow', steps: ['PR 분석', '질문 선택', '답변 작성', '자동 저장', '회고 완료'] }] }],
      },
      {
        label: 'CASE 02',
        title: '변경된 답변만 저장하도록 자동 저장 로직 개선',
        rows: [
          {
            label: 'ISSUE',
            content: [
              { kind: 'text', text: '여러 답변을 작성하는 과정에서 변경되지 않은 내용까지 반복 저장되며 불필요한 API 요청이 발생했습니다.' },
            ],
          },
          {
            label: 'APPROACH',
            content: [
              {
                kind: 'list',
                items: [
                  'lastSavedRef로 마지막 저장 값과 현재 입력 값을 비교해 변경된 답변만 추출했습니다.',
                  '3초간 입력이 없을 때 저장하고, 여러 저장 요청은 Promise.all로 병렬 처리했습니다.',
                ],
              },
            ],
          },
          {
            label: 'RESULT',
            content: [
              {
                kind: 'text',
                text: '변경되지 않은 답변의 중복 저장을 방지해 불필요한 API 요청을 줄이고, 여러 답변을 작성하는 상황에서도 안정적으로 자동 저장되도록 개선했습니다.',
              },
            ],
          },
        ],
      },
      {
        label: 'CASE 03',
        title: 'API 호출 구조 및 타입 관리 개선',
        rows: [
          {
            label: 'ISSUE',
            content: [
              {
                kind: 'text',
                text: 'API 호출과 인증 처리가 화면 로직에 섞여 있었고, API 스펙 변경 시 요청·응답 타입을 직접 확인해야 했습니다.',
              },
            ],
          },
          {
            label: 'APPROACH',
            content: [
              {
                kind: 'list',
                items: [
                  '페이지의 API 호출을 TanStack Query Mutation으로 분리했습니다.',
                  'API Generator로 생성된 API Client와 TypeScript 타입을 활용해 요청·응답 구조를 관리했습니다.',
                ],
              },
            ],
          },
          {
            label: 'RESULT',
            content: [
              {
                kind: 'text',
                text: '화면과 API 호출의 책임을 분리하고, 백엔드 스펙 기반 타입을 활용해 API 변경 시 발생하는 타입 오류를 빠르게 확인할 수 있는 구조로 개선했습니다.',
              },
            ],
          },
        ],
      },
    ],
  },

  msp: {
    titleSummary: '생성형 AI 문해력 향상 학습 서비스',
    lead: '생성형 AI를 활용한 개인 맞춤형 문해력 향상 학습 서비스',
    role: '기획 및 UI/UX 디자인, 프론트엔드 개발, 서비스 운영',
    extraStack: ['Vercel', 'Figma'],
    links: [
      github('https://github.com/xxj15/msp-frontend'),
      { label: '인스타그램', kind: 'external', href: 'https://www.instagram.com/moonsunpower.sg/' },
    ],
    cases: [
      {
        label: 'CASE 01',
        title: '성과 및 운영',
        rows: [
          {
            pair: [
              {
                label: '01',
                title: '운영 성과',
                content: [
                  { kind: 'text', text: '약 1년간 서비스를 운영했습니다.' },
                  { kind: 'text', tone: 'emphasis', text: ['2025.03 기준 월 조회수 9,400회, ', { text: '활성 사용자 318명', tone: 'nowrap' }] },
                ],
              },
              {
                label: '02',
                title: '수상',
                content: [{ kind: 'text', text: '2024 서강 융합기술 경진대회 AI/SW상 · 인기상을 받았습니다.' }],
              },
            ],
          },
          {
            label: '03',
            title: '운영 특징',
            content: [
              {
                kind: 'list',
                items: [
                  '어린이날·만우절 등 시즌성 콘텐츠를 기획하고 업데이트했습니다.',
                  'Google Analytics로 사용자 유입·행동 데이터를 모니터링했습니다.',
                  '콘텐츠 업데이트와 서비스 개선을 이어 갔습니다.',
                ],
              },
            ],
          },
          {
            content: [
              {
                kind: 'figure',
                layout: 'grid',
                images: [
                  { src: mspPoster, alt: 'MoonSunPower 경진대회 포스터', caption: '서강 융합기술 경진대회 포스터' },
                  { src: mspGa0302, alt: 'Google Analytics 지표 2025.03.02', caption: 'Google Analytics · 2025.03.02' },
                  { src: mspGa0326, alt: 'Google Analytics 보고서 2025.03.26', caption: 'Google Analytics · 2025.03.26' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

// ---------- helpers ----------

export function isPair(row: CaseRow): row is CaseBlockPair {
  return 'pair' in row;
}

/** 케이스 안의 블록을 문서 순서대로 펼친다(나란히 놓인 두 블록은 왼쪽 → 오른쪽). */
export function flattenBlocks(caseStudy: CaseStudy): CaseBlock[] {
  return caseStudy.rows.flatMap((row) => (isPair(row) ? [...row.pair] : [row]));
}

/** 상세 헤더의 기술 스택: 카드 스택 + 상세 전용 스택, 그중 "사용 예정"은 따로 */
export function detailStack(project: Project, detail: ProjectDetail): { used: string[]; planned: string[] } {
  const all = [...project.stack, ...(detail.extraStack ?? [])].filter((name, index, list) => list.indexOf(name) === index);
  const planned = new Set(detail.plannedStack ?? []);
  return { used: all.filter((name) => !planned.has(name)), planned: (detail.plannedStack ?? []).filter((name) => all.includes(name)) };
}

/**
 * 콘텐츠 규칙 확인(빌드 시 실패시킴):
 * - RESULT가 있으면 케이스의 마지막 블록이다.
 * - 사용 예정 스택은 카드·상세 스택 안의 이름이다.
 * - 상세 헤더 버튼은 모두 링크가 있다.
 */
function assertContentRules(): void {
  for (const project of projects) {
    const detail = projectDetails[project.slug];
    for (const caseStudy of detail.cases) {
      const blocks = flattenBlocks(caseStudy);
      const resultIndex = blocks.findIndex((block) => block.label === 'RESULT');
      if (resultIndex !== -1 && resultIndex !== blocks.length - 1) {
        throw new Error(`[project-details] ${project.slug} "${caseStudy.title}": RESULT는 마지막 블록이어야 합니다.`);
      }
    }
    const stack = new Set([...project.stack, ...(detail.extraStack ?? [])]);
    for (const name of detail.plannedStack ?? []) {
      if (!stack.has(name)) throw new Error(`[project-details] ${project.slug}: 사용 예정 "${name}"이 스택에 없습니다.`);
    }
    const blockLinks = detail.cases.flatMap((caseStudy) => flattenBlocks(caseStudy).flatMap((block) => (block.action ? [block.action] : [])));
    for (const link of [...detail.links, ...blockLinks]) {
      if (!link.href.trim()) throw new Error(`[project-details] ${project.slug}: "${link.label}" 버튼에 링크가 없습니다.`);
    }
  }
}

assertContentRules();
