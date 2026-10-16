/**
 * 홈 하단 섹션(Experience · Activities · About)의 콘텐츠 단일 출처.
 * 원문은 루트 anseojin-portfolio.pdf(주석의 p번호)와 예전 사이트(Anseojin Portfolio.html)다.
 * 문장은 원문을 옮기거나 합니다체로만 다듬었고, 수치·사실을 새로 만들지 않는다.
 */
import type { ImageMetadata } from 'astro';
import type { RichText } from './types';
import { detailStack, projectDetails } from './project-details';
import { getProject, projects, type ProjectSlug } from './projects';

import profilePhoto from '../assets/profile/profile.jpg';
import catchtable1 from '../assets/profile/activities/catchtable-1.png';
import catchtable2 from '../assets/profile/activities/catchtable-2.png';
import catchtable3 from '../assets/profile/activities/catchtable-3.png';
import ourwishPrototype from '../assets/profile/activities/ourwish-prototype.jpg';
import startcampIdeathon from '../assets/profile/activities/startcamp-ideathon.png';
import kakaoHackathon from '../assets/profile/activities/kakao-ai-hackathon.png';

export interface LinkItem {
  label: string;
  href: string;
}

export interface ImageItem {
  src: ImageMetadata;
  alt: string;
}

// ---------------------------------------------------------------------------
// Skills: tech-chip 그룹 (EXPERIENCE.md Component Patterns › Tech chip)
// ---------------------------------------------------------------------------

export interface SkillProjectRef {
  slug: ProjectSlug;
  name: string;
}

export interface Skill {
  /** DOM id·data 속성에 쓰는 고정 키 */
  id: string;
  name: string;
  /** 이 기술을 쓴 프로젝트(카드 순서 = 최신순). 비어 있으면 펼칠 목록이 없는 정적 칩이다. */
  projects: readonly SkillProjectRef[];
}

export interface SkillCategory {
  id: string;
  label: string;
  skills: readonly Skill[];
}

interface SkillSource {
  name: string;
  /** 프로젝트 스택 표기가 다를 때(예: 스택은 "Vue", 칩은 "Vue.js") */
  aliases?: readonly string[];
}

/**
 * 칩 목록은 예전 사이트의 Tech Skills 이미지(카테고리 5개, 이미지 속 순서)를 그대로 옮겼다.
 * SEED Design만 더했다: EXPERIENCE.md Tech chip 규칙이 NEW:LEARN의 집계 대상으로 명시한 기술이다.
 */
const SKILL_SOURCE: readonly { id: string; label: string; skills: readonly SkillSource[] }[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    skills: [
      { name: 'HTML5' },
      { name: 'CSS3' },
      { name: 'JavaScript' },
      { name: 'TypeScript' },
      { name: 'React' },
      { name: 'Vue.js', aliases: ['Vue'] },
      { name: 'Next.js' },
      { name: 'TanStack Query' },
      { name: 'Zustand' },
    ],
  },
  {
    id: 'app',
    label: 'App / Real-time',
    skills: [
      { name: 'React Native' },
      { name: 'Expo' },
      { name: 'Flutter' },
      { name: 'Dart' },
      { name: 'WebRTC' },
      { name: 'ARCore' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend / Languages',
    skills: [{ name: 'Python' }, { name: 'Django' }, { name: 'C' }],
  },
  {
    id: 'design',
    label: 'Design & Collaboration',
    skills: [
      { name: 'Figma' },
      { name: 'SEED Design' },
      { name: 'Jira' },
      { name: 'Photoshop' },
      { name: 'Git' },
      { name: 'GitHub' },
      { name: 'Notion' },
      { name: 'Slack' },
    ],
  },
  {
    id: 'ai',
    label: 'AI / Platform',
    skills: [{ name: 'OpenAI' }, { name: 'Vercel' }],
  },
];

/**
 * 칩과 프로젝트의 연결은 각 프로젝트의 기술 스택 필드에서 만든다(EXPERIENCE.md Tech chip).
 * 상세 헤더와 같은 출처를 쓴다: 카드 스택(projects.ts) + 상세 전용 스택(project-details.ts extraStack) − 사용 예정(plannedStack).
 * 그래서 NEW:LEARN은 React · TypeScript · SEED Design만 세고, D3.js 같은 예정 스택은 세지 않는다.
 */
const normalizeTech = (value: string) => value.trim().toLowerCase();
const toId = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const projectTech = projects.map((project) => ({
  project,
  tech: new Set(detailStack(project, projectDetails[project.slug]).used.map(normalizeTech)),
}));

export const skillCategories: readonly SkillCategory[] = SKILL_SOURCE.map((category) => ({
  id: category.id,
  label: category.label,
  skills: category.skills.map((skill) => {
    const names = [skill.name, ...(skill.aliases ?? [])].map(normalizeTech);
    return {
      id: toId(skill.name),
      name: skill.name,
      projects: projectTech
        .filter(({ tech }) => names.some((name) => tech.has(name)))
        .map(({ project }) => ({ slug: project.slug, name: project.name })),
    };
  }),
}));

// ---------------------------------------------------------------------------
// Experience: 개발 경험 timeline-row (예전 사이트 Technical Experience, PDF p23–26)
// ---------------------------------------------------------------------------

export interface ExperienceDetails {
  pipeline: {
    label: string;
    summary: string;
    steps: readonly { name: string; note?: string }[];
    notes: readonly string[];
  };
  validation: {
    label: string;
    summary: string;
    rows: readonly { scope: string; handling: string }[];
  };
}

export interface ExperienceEntry {
  id: string;
  /** 왼쪽 caption: 원문에 날짜가 없어 항목의 성격을 쓴다. */
  meta: string;
  title: string;
  description: string;
  /** 원문에 역할이 없으면 비운다(DAILY TICK은 개인 프로젝트). */
  role?: string;
  outcomes: readonly string[];
  stack: readonly string[];
  links: readonly LinkItem[];
  /** "자세히 보기" 토글 뒤에 두는 내용 */
  details?: ExperienceDetails;
}

export const experiences: readonly ExperienceEntry[] = [
  {
    id: 'dailytick',
    meta: '개인 프로젝트',
    title: 'DAILY TICK',
    description:
      '금융·증권 학습을 위한 Daily Financial Briefing 서비스입니다. 매일 주요 경제 이슈와 금융·증권 개념을 한 번에 확인하고, 학습 기록까지 누적할 수 있게 만들었습니다.',
    outcomes: [
      '최근 24시간 경제 이슈 브리핑, 금융 개념 학습, 날짜별 학습 기록을 하나의 Daily Briefing 흐름으로 구성',
      '매일 브리핑을 사전 생성해 AI 응답 시간과 페이지 로딩을 분리',
      'AI 생성 결과의 형식·출처·신선도·중복 여부를 코드에서 검증',
      '91개 금융·증권 개념을 단계별로 구성하고, 학습 이력에 따라 다음 개념을 순차적으로 선택하도록 설계',
    ],
    stack: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Tailwind CSS v4',
      'Zod',
      'OpenAI Responses API',
      'Supabase PostgreSQL',
      'Vercel Cron',
    ],
    links: [
      { label: 'Daily Tick 서비스', href: 'https://dailyticknews.vercel.app/' },
      { label: 'Daily Tick GitHub', href: 'https://github.com/xxj15/dailytick' },
    ],
    details: {
      pipeline: {
        label: 'DAILY BRIEFING PIPELINE',
        summary: '매일 브리핑을 사전 생성해 AI 응답 시간과 페이지 로딩을 분리했습니다.',
        steps: [
          { name: 'Vercel Cron' },
          { name: '/api/cron/daily-briefing' },
          { name: 'News Search', note: '최근 24시간 뉴스 수집' },
          { name: 'OpenAI Briefing', note: '브리핑 생성' },
          { name: 'Zod Validation', note: '검증 및 후처리' },
          { name: 'Supabase', note: '브리핑 저장' },
          { name: 'Frontend', note: '페이지 조회' },
        ],
        notes: ['07:30(KST) 사전 생성', '접속 시 실시간 생성 없음', 'AI 응답 시간과 페이지 로딩 분리'],
      },
      validation: {
        label: 'AI VALIDATION',
        summary: 'AI 생성 결과의 형식·출처·신선도·중복 여부를 코드에서 검증했습니다.',
        rows: [
          { scope: '응답 형식', handling: 'Zod Schema 검증 · 위반 항목 반영 후 1회 재생성' },
          { scope: '뉴스 구성', handling: '최소 3개 · 국내/글로벌 모두 포함' },
          { scope: '출처', handling: '뉴스별 실제 URL 필수' },
          { scope: '신선도', handling: '최근 24시간 이슈 우선 · 72시간 초과 출처는 발행 제한' },
          { scope: '운영 안정성', handling: 'briefing_date Unique · 실패 시 기존 브리핑 유지' },
        ],
      },
    },
  },
  {
    id: 'database',
    meta: '물류관리 시스템',
    title: '데이터베이스시스템 프로젝트',
    description:
      '편의점 체인의 상품·매장·재고·주문·고객 데이터를 통합 관리하는 물류관리 시스템을 설계하고, MySQL과 C 환경에서 실제 구현까지 완료했습니다.',
    role: 'DB 설계(ERD·정규화), SQL 쿼리 작성, C 기반 조회 프로그램 구현',
    outcomes: [
      'ER Diagram 설계와 BCNF 정규화로 논리·물리 스키마 구축',
      '재고 알림·매출 분석·고객 구매 패턴 등 실무형 SQL 쿼리 7종 작성',
      'C + MySQL C API로 SQL 질의 실행 프로그램 구현',
    ],
    stack: ['MySQL', 'SQL', 'C', 'MySQL C API'],
    links: [{ label: '물류관리 시스템 GitHub', href: 'https://github.com/xxj15/Database-System' }],
  },
  {
    // 기술 경험으로만 둔다. 수상으로 내세우지 않는다(사용자 결정): 배지·트로피 없이, 순위는 강조 없이 마지막에.
    id: 'ssafyrace',
    meta: '자율주행 알고리즘 경진대회',
    title: '싸피레이스',
    description: '실시간 차량·도로 센싱 데이터를 기반으로 조향·속도를 제어하는 자율주행 알고리즘을 개발했습니다.',
    role: '실시간 센서 데이터를 활용한 조향·가감속 제어 로직 구현, 가장 가까운 빈 공간 탐색 기반 장애물 회피 알고리즘 설계',
    outcomes: [
      '장애물 배치 변화에도 안정적으로 완주하는 주행 알고리즘 구현',
      '생성형 AI로 가설·실험·로그를 비교하는 워크플로우를 구축해 성능 개선',
      '278팀 중 2위 (777명 참가)',
    ],
    stack: ['Python', 'Microsoft AirSim', 'Driving API'],
    links: [],
  },
];

// ---------------------------------------------------------------------------
// Activities (PDF p28–31): UI/UX Design 작업물 → 콘텐츠 기획·제작 → 동아리 활동
// ---------------------------------------------------------------------------

export interface ActivityEntry {
  id: string;
  /** 왼쪽 caption: 기간, 기간이 없으면 맥락. 아직 모르면 비운다(날짜를 지어내지 않는다). */
  meta?: string;
  title: string;
  /** 제목 아래 보조 줄(예: 서비스 개선 프로젝트, 반 내 1위). 수상 배지로 쓰지 않는다. */
  subtitle?: string;
  description?: string;
  points?: readonly string[];
  facts?: readonly { term: string; value: string }[];
  links?: readonly LinkItem[];
  /** 사이트 안의 프로젝트 상세(projectPath(slug)로 만든다) */
  internalLink?: { label: string; slug: ProjectSlug };
  media?: {
    layout: 'phones' | 'single';
    images: readonly ImageItem[];
  };
}

export interface ActivityGroup {
  id: string;
  title: string;
  lead?: string;
  entries: readonly ActivityEntry[];
}

export const activityGroups: readonly ActivityGroup[] = [
  {
    id: 'uiux',
    title: 'UI/UX Design 작업물',
    lead: '다수의 팀 프로젝트와 공모전에서 디자인과 기획을 담당하며, Figma 기반 UI 설계부터 개발 핸드오프까지 직접 진행했습니다. Boogle, OURWISH, 책화점, Moa, MoonSunPower 프로젝트에서 Figma로 와이어프레임과 주요 화면 흐름을 설계했습니다.',
    entries: [
      {
        // 히어로 기둥 01 "기획"의 관련 항목
        id: 'catchtable',
        meta: '소프트웨어공학 수업',
        title: '캐치테이블 재구축',
        subtitle: '서비스 개선 프로젝트',
        description:
          '캐치테이블 서비스를 재구축하며 예약·웨이팅 기능 분리, 지하철역 기반 검색 세분화, 신뢰도 기반 차등 예약금 제도 등 사용자 불편을 분석하고, 이를 개선하기 위한 서비스 구조와 기능을 설계했습니다.',
        media: {
          layout: 'phones',
          images: [
            { src: catchtable1, alt: '캐치테이블 재구축 프로토타입 1' },
            { src: catchtable2, alt: '캐치테이블 재구축 프로토타입 2' },
            { src: catchtable3, alt: '캐치테이블 재구축 프로토타입 3' },
          ],
        },
      },
      {
        id: 'ourwish-prototype',
        meta: 'SSAFY 1학기 관통 프로젝트',
        title: 'OURWISH 프로토타입',
        subtitle: '사회초년생을 위한 예·적금 추천 서비스',
        description:
          'Banking as a Service(BaaS)를 염두에 두고, 금융 기능이 자연스럽게 연결되는 예·적금 추천 서비스로 기획했습니다.',
        internalLink: { label: 'OURWISH 프로젝트 보기', slug: 'ourwish' },
        media: {
          layout: 'single',
          images: [{ src: ourwishPrototype, alt: 'OURWISH 프로토타입' }],
        },
      },
      {
        id: 'startcamp',
        meta: 'SSAFY 15기 스타트캠프',
        title: '아이디어톤 작업물',
        subtitle: '반 내 1위',
        media: {
          layout: 'single',
          images: [{ src: startcampIdeathon, alt: 'SSAFY 15기 스타트캠프 아이디어톤 작업물' }],
        },
      },
      {
        id: 'kakao-hackathon',
        meta: 'SSAFY X Kakao Tech Bootcamp',
        title: 'AI Hackathon 프로토타입',
        media: {
          layout: 'single',
          images: [{ src: kakaoHackathon, alt: 'SSAFY X Kakao Tech Bootcamp AI Hackathon 프로토타입' }],
        },
      },
    ],
  },
  {
    id: 'content',
    title: '콘텐츠 기획·제작',
    entries: [
      {
        id: 'ssafycial',
        meta: '2026.02 – 현재',
        title: 'SSAFYcial 15기',
        points: ['SSAFY 교육생 관점의 영상 콘텐츠 기획 및 제작', '촬영 및 편집을 포함한 콘텐츠 제작 전 과정 참여'],
        links: [{ label: 'SSAFYcial 인스타그램', href: 'https://www.instagram.com/ssafycial_sj/' }],
      },
      {
        id: 'sogangtoday',
        meta: '2021.09 – 2021.12',
        title: '서강투데이',
        description: '‘평범한 서강인들의 평범하지 않은 이야기’를 주제로 교내 학생 및 교수진 인터뷰를 진행했습니다.',
        points: [
          '인터뷰 기획, 취재, 기사 작성 및 편집 과정 참여',
          '인터뷰 내용을 바탕으로 교내 책자 제작',
          '다양한 구성원과의 소통을 통해 커뮤니케이션 및 콘텐츠 제작 역량 강화',
        ],
        links: [
          { label: '서강투데이 인스타그램', href: 'https://www.instagram.com/sogangtoday/' },
          { label: '서강투데이 책자', href: 'https://drive.google.com/file/d/1tzqXZ-rXOyzQi0x5lWi91zMTllCAbqNg/view' },
        ],
      },
    ],
  },
  {
    // 조교 활동이 들어오며 묶음 이름을 "동아리 활동" → "동아리·교육 활동"으로 바꿨다
    id: 'club',
    title: '동아리·교육 활동',
    lead: '개발 경험에서 교육과 협업으로',
    entries: [
      {
        // 사용자 제공(2026-10-16). 정확한 기간은 2025.09.02 – 2025.12.19
        id: 'ai-programming-ta',
        meta: '2025.09 – 2025.12',
        title: '기초인공지능프로그래밍 조교',
        subtitle: '서강대학교',
        description: 'Python 교과목의 조교로 활동했습니다.',
      },
      {
        // 사용자 제공(2026-10-16). 동아리 활동 기간이며, DevOops 프로젝트 기간(2025.04 – 2025.10, PDF 상세)과는 다르다.
        id: 'mashup-15',
        meta: '2025.03 – 2025.08',
        title: 'Mash UP 15기',
        subtitle: 'IT 연합 동아리',
        points: ['프론트엔드 기술 세션·세미나 진행', 'PR 기반 AI 회고 서비스 DevOops 기획·프론트엔드 개발'],
        facts: [{ term: '성과', value: 'Mash UP 동아리 내 프로젝트 평가 1위' }],
        internalLink: { label: 'DevOops 프로젝트 보기', slug: 'devoops' },
        links: [
          { label: 'Next.js 스터디 GitHub', href: 'https://github.com/mash-up-kr/web-nextjs-study' },
          { label: 'DevOops GitHub', href: 'https://github.com/mash-up-kr/devoops-web' },
        ],
      },
      {
        id: 'likelion-9',
        meta: '2021.03 – 2022.02',
        title: '멋쟁이사자처럼 9기 운영진 · 교육팀',
        points: [
          'HTML/CSS, Git 등 웹 개발 기초 교육 자료 제작 및 세션 진행',
          '9기 동아리원들의 프로젝트 개발 과정에서 기술적 문제 해결 지원 및 코드 리뷰 수행',
          '학습 자료 제작과 디버깅 멘토링을 통해 개발 지식 전달 및 커뮤니케이션 역량 강화',
        ],
      },
      {
        id: 'likelion-8',
        meta: '2020.03 – 2021.02',
        title: '멋쟁이사자처럼 8기',
        description: '위치 기반 도서 공유 서비스 ‘책화점’을 기획하고 개발했습니다.',
        points: [
          '서비스 기획부터 UI 디자인, 프론트엔드·백엔드 개발까지 전 과정 참여',
          'Django 기반 웹 서비스를 PythonAnywhere에 배포하여 실제 서비스 환경 구성',
        ],
        facts: [
          { term: '수상', value: '2020 서강 온라인 창업 아이디어톤 우수상' },
          { term: '배포', value: 'PythonAnywhere' },
          { term: '기술 스택', value: 'Python · Django · HTML/CSS' },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// About (PDF p2–3, 예전 사이트 About me)
// ---------------------------------------------------------------------------

export const profile = {
  photo: { src: profilePhoto, alt: '안서진 프로필 사진' } satisfies ImageItem,
  /** 첫 문장만 강조(600 · ink-primary), 나머지는 본문(사용자 제공 문구 2026-10-16) */
  bio: [
    {
      text: '컴퓨터공학 지식에 디자인 감각과 인문학적 시선을 더해, 사용자의 문제를 발견하고 해결하는 서비스를 만듭니다.',
      tone: 'strong',
    },
    ' 사용자 관점에서 흐름을 설계하고, 기획부터 UI/UX 디자인, 개발까지 직접 연결하며 아이디어를 실제 서비스로 완성하는 데 강점이 있습니다.',
  ] satisfies RichText,
};

export interface EducationRow {
  term: string;
  items: readonly { text: string; date?: string }[];
}

export const education: readonly EducationRow[] = [
  { term: '학력', items: [{ text: '서강대학교 유럽문화(독일어 심화) / 컴퓨터공학' }] },
  { term: '교육', items: [{ text: '삼성 청년 SW·AI 아카데미 (SSAFY)' }] },
  {
    term: '어학',
    items: [
      { text: 'OPIc 영어 말하기 IH', date: '2025.07' },
      { text: 'Goethe-Zertifikat 독일어 B1', date: '2025.12' },
      { text: 'DELF 프랑스어 A2', date: '2025.05' },
    ],
  },
];

export interface AwardRow {
  date: string;
  name: string;
  /**
   * 관련 링크: slug는 프로젝트 상세(내부), href는 외부 페이지(새 탭 ↗), 둘 다 없으면 이름만.
   */
  related?: { label: string; slug?: ProjectSlug; href?: string };
}

const projectRef = (slug: ProjectSlug) => {
  const project = getProject(slug);
  return project ? { label: project.name, slug } : undefined;
};

/**
 * Awards 전체(PDF p3 = 예전 사이트 Awards 6건, 최신순). 싸피레이스는 넣지 않는다(사용자 결정).
 * Mash UP 1위(DevOops)와 스타트캠프 아이디어톤 반 내 1위는 원문 Awards 목록에 없어 넣지 않았다
 * (각각 DevOops 카드 배지와 Activities에 원문대로 있다).
 */
export const awards: readonly AwardRow[] = [
  { date: '2026.08', name: 'SSAFY 2학기 공통 프로젝트 우수상 (1위)', related: projectRef('banggoot') },
  { date: '2026.06', name: 'SSAFY 1학기 관통 프로젝트 최우수상 (1위)', related: projectRef('ourwish') },
  { date: '2024.12', name: '서강 융합기술 경진대회 특별상 (AI/SW상)', related: projectRef('msp') },
  { date: '2024.12', name: '서강 융합기술 경진대회 특별상 (인기상)', related: projectRef('msp') },
  {
    date: '2021.12',
    name: '2021 서강이 만들어가는 세상 UNTACT 3위',
    // 링크 대상은 사용자 지정(2026-10-16)
    related: { label: '서강투데이', href: 'https://www.instagram.com/sogangtoday/' },
  },
  { date: '2020.12', name: '2020 서강 온라인 창업 아이디어톤 우수상', related: { label: '책화점' } },
];
