import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test, type Locator, type Page } from '@playwright/test';

/*
  홈 첫 구간 검증 — spec-portfolio-home-foundation.md의 I/O & Edge-Case Matrix와 Acceptance Criteria.
  preview 서버(빌드 결과물)를 대상으로 한다.
*/

const H1_TEXT = '기획과 UI/UX 디자인을 이해하고, 사용자 경험과 흐름을 설계하는 프론트엔드 개발자';
const KEYWORDS = ['기획', 'UI/UX 디자인', '사용자 경험'];
/** keyword-pillar 3개(사용자 결정 2026-10-16): 01·02는 h1 강조어와 같고 03은 "개발" */
const PILLARS = [
  {
    title: '기획',
    body: 'FINCH에서 PM을 맡았고, 캐치테이블 재구축에서 서비스 구조와 기능을 설계했습니다.',
    related: 'FINCH · NEW:LEARN · 캐치테이블 재구축',
  },
  {
    title: 'UI/UX 디자인',
    body: 'Figma로 와이어프레임과 주요 화면 흐름을 설계하고, 개발 핸드오프까지 직접 진행했습니다.',
    related: 'NEW:LEARN · OURWISH · Boogle · MoonSunPower',
  },
  {
    title: '개발',
    body: 'React·TypeScript로 화면 구현부터 상태 관리, API 연동까지 이어지는 프론트엔드 개발을 해왔습니다.',
    related: 'FINCH · Boogle · DevOops',
  },
];
const EMAIL = 'seojini00@naver.com';
const PROJECTS = [
  { slug: 'newlearn', name: 'NEW:LEARN' },
  { slug: 'finch', name: 'FINCH' },
  { slug: 'banggoot', name: '방긋' },
  { slug: 'ourwish', name: 'OURWISH' },
  { slug: 'boogle', name: 'Boogle' },
  { slug: 'moa', name: 'Moa' },
  { slug: 'devoops', name: 'DevOops' },
  { slug: 'msp', name: 'MoonSunPower' },
];
const METRICS = [
  { slug: 'finch', value: '20', unit: '개', label: '화면 프로토타입' },
  { slug: 'banggoot', value: '21', unit: '종', label: '공용 컴포넌트 구현(37종 중)' },
  { slug: 'ourwish', value: '588', unit: '개', label: 'FE·BE 조건 조합 대조' },
  { slug: 'msp', value: '9,400', unit: '회', label: '월 조회수(2025.03)' },
];

const COLOR = {
  primary: 'rgb(64, 106, 191)',
  primaryTint: 'rgb(223, 231, 246)',
  inkSecondary: 'rgb(75, 85, 102)',
  borderHairline: 'rgb(228, 232, 238)',
  borderStrong: 'rgb(206, 213, 223)',
};
const NAV_HEIGHT = 64;
/** 앵커로 이동하면 섹션 머리글(영문 라벨)은 Projects와 같이 내비 아래 64px에 온다(Projects 위 여백 = space-8). */
const HEADING_TOP = NAV_HEIGHT + 64;
const LIFTED = 'matrix(1, 0, 0, 1, 0, -4)';
const ZOOMED = 'matrix(1.04, 0, 0, 1.04, 0, 0)';

/** 홈 하단 섹션의 h2 (Projects 다음, 섹션 순서 = EXPERIENCE.md Information Architecture) */
const H2_TEXTS = ['소개', '기술 스택', '프로젝트', '개발 경험', '활동']; // 페이지 끝 contact-band는 없앴다(사용자 결정)
/** 히어로 → About → Tech Stack → Projects → Experience → Activities (내비 순서와 같음, 사용자 결정 2026-10-16) */
const SECTION_ORDER = ['about', 'tech-stack', 'projects', 'experience', 'activities'];
/** 내비 항목(순서 = 섹션 순서) */
const NAV_NAMES = { about: 'About', 'tech-stack': 'Tech Stack', projects: 'Projects', experience: 'Experience', activities: 'Activities' } as const;
/**
 * tech-chip 집계: 프로젝트 기술 스택 필드(카드 스택 + 상세 extraStack − 사용 예정) 기준. 상세 헤더의 스택과 같다.
 * NEW:LEARN은 React · TypeScript · SEED Design만 센다(D3.js 등은 사용 예정이라 제외).
 */
const CHIP_PROJECTS: Record<string, string[]> = {
  javascript: ['msp'],
  typescript: ['newlearn', 'finch', 'banggoot', 'ourwish', 'boogle', 'devoops'],
  react: ['newlearn', 'finch', 'boogle', 'msp'],
  'vue-js': ['ourwish'],
  'next-js': ['devoops'],
  'react-native': ['banggoot'],
  expo: ['banggoot'],
  flutter: ['moa'],
  dart: ['moa'],
  webrtc: ['banggoot'],
  figma: ['ourwish', 'boogle', 'moa', 'msp'],
  arcore: ['banggoot'],
  'tanstack-query': ['devoops'],
  'seed-design': ['newlearn'],
  vercel: ['ourwish', 'boogle', 'devoops', 'msp'],
};
/** 쓴 프로젝트가 없는 기술: 버튼이 아닌 정적 칩 */
const STATIC_CHIPS = [
  'html5',
  'css3',
  'zustand',
  'python',
  'django',
  'c',
  'jira',
  'photoshop',
  'git',
  'github',
  'notion',
  'slack',
  'openai',
];
const AWARDS = [
  { date: '2026.08', name: 'SSAFY 2학기 공통 프로젝트 우수상 (1위)' },
  { date: '2026.06', name: 'SSAFY 1학기 관통 프로젝트 최우수상 (1위)' },
  { date: '2024.12', name: '서강 융합기술 경진대회 특별상 (AI/SW상)' },
  { date: '2024.12', name: '서강 융합기술 경진대회 특별상 (인기상)' },
  { date: '2021.12', name: '2021 서강이 만들어가는 세상 UNTACT 3위' },
  { date: '2020.12', name: '2020 서강 온라인 창업 아이디어톤 우수상' },
];

const normalize = (text: string | null) => (text ?? '').replace(/\s+/g, ' ').trim();
const PROJECT_ROOT = fileURLToPath(new URL('..', import.meta.url));
/** 정적 HTML 검사 대상. 기본은 dist/, 병렬 작업 중에는 TEST_DIST_DIR로 다른 빌드 폴더를 가리킬 수 있다. */
const DIST_DIR = process.env.TEST_DIST_DIR ?? 'dist';

async function openHome(page: Page, path = '/') {
  await page.goto(path);
  // Pretendard는 비차단(preload → stylesheet)으로 붙으므로, 붙은 뒤 글꼴 로드를 기다린다(CDN이 막혀도 테스트는 진행)
  await expect
    .poll(() => page.evaluate(() => Array.from(document.styleSheets).some((sheet) => sheet.href?.includes('pretendard'))), {
      timeout: 5_000,
    })
    .toBe(true)
    .catch(() => {});
  await page.evaluate(() => document.fonts.ready);
}

/** 스크롤(부드러운 스크롤 포함)이 멈출 때까지 기다린다. 페이지 JS가 꺼져 있어도 동작하도록 테스트 쪽에서 잰다. */
async function waitForScrollIdle(page: Page) {
  let last = Number.NaN;
  let stable = 0;
  for (let attempt = 0; attempt < 100 && stable < 4; attempt += 1) {
    const current = await page.evaluate(() => window.scrollY);
    stable = current === last ? stable + 1 : 0;
    last = current;
    await page.waitForTimeout(40);
  }
}

async function waitForAnimations(page: Page) {
  await page.waitForFunction(() => document.getAnimations().every((animation) => animation.playState !== 'running'));
}

/** 리빌이 끝난 상태로 요소를 화면 가운데에 둔다. */
async function bringIntoView(page: Page, locator: Locator) {
  await locator.evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await waitForScrollIdle(page);
  const handle = await locator.elementHandle();
  await page.waitForFunction((element) => {
    const revealed = element?.closest('[data-reveal]');
    return !revealed || !revealed.matches('.reveal-pending, .is-revealing');
  }, handle);
  await waitForAnimations(page);
}

const card = (page: Page, slug: string) => page.locator(`a.card[data-card="${slug}"]`);

// ---------------------------------------------------------------------------
test.describe('빌드 결과물(정적 HTML)', () => {
  test('dist/index.html에 h1 문장과 카드 링크 8개가 정적으로 들어 있다', () => {
    const html = readFileSync(join(PROJECT_ROOT, DIST_DIR, 'index.html'), 'utf8');
    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '';
    expect(normalize(h1.replace(/<[^>]+>/g, ''))).toBe(H1_TEXT);
    for (const { slug } of PROJECTS) {
      expect(html).toContain(`href="/projects/${slug}/"`);
    }
    expect(html.match(/class="card"/g)?.length).toBe(8);
    // 홈 하단 섹션과 칩 펼침 목록의 프로젝트 링크도 정적 HTML이다(JS 없이 읽힘)
    for (const id of SECTION_ORDER) expect(html).toContain(`id="${id}"`);
    expect(html).toContain('id="skill-panel-react"');
    expect(html).toContain('id="exp-dailytick-details"');
  });

  test('ASTRO_BASE 하위 경로로 빌드하면 루트 기준 href·src·srcset이 모두 base로 시작한다', () => {
    test.setTimeout(180_000);
    execFileSync(process.execPath, [join(PROJECT_ROOT, 'node_modules/astro/bin/astro.mjs'), 'build', '--outDir', 'dist-base'], {
      cwd: PROJECT_ROOT,
      env: { ...process.env, ASTRO_BASE: '/anseojin-portfolio' },
      stdio: 'pipe',
    });
    const html = readFileSync(join(PROJECT_ROOT, 'dist-base/index.html'), 'utf8');
    const urls = [...html.matchAll(/\s(?:href|src)="([^"]*)"/g)].map((match) => match[1]);
    const srcset = [...html.matchAll(/\ssrcset="([^"]*)"/g)].flatMap((match) =>
      match[1].split(',').map((candidate) => candidate.trim().split(/\s+/)[0]),
    );
    const rootRelative = [...urls, ...srcset].filter((url) => url.startsWith('/') && !url.startsWith('//'));
    expect(rootRelative.length).toBeGreaterThan(20);
    expect(rootRelative.filter((url) => !url.startsWith('/anseojin-portfolio/'))).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
test.describe('첫 화면 1440×900', () => {
  test('h1(54px, 3줄, 왼쪽 8컬럼) 키워드 3개 강조, 기둥 3개(기획 · UI/UX 디자인 · 개발), 보조 문장·칩·CTA 없음, 하단에 ABOUT 라벨과 소개 제목', async ({
    page,
  }) => {
    await openHome(page);
    await waitForAnimations(page);

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    expect(normalize(await h1.textContent())).toBe(H1_TEXT);

    const keywords = h1.locator('.kw');
    await expect(keywords).toHaveText(KEYWORDS);
    for (const keyword of await keywords.all()) {
      await expect(keyword).toHaveCSS('color', COLOR.primary);
      await expect(keyword).toHaveCSS('white-space', 'nowrap');
      const background = await keyword.evaluate((element) => getComputedStyle(element).backgroundImage);
      expect(background).toContain('linear-gradient');
      expect(background).toContain(COLOR.primaryTint);
    }

    // h1은 히어로 전용 54px(행간 1.22 · 자간 -0.03em 유지), 세 줄
    await expect(h1).toHaveCSS('font-size', '54px');
    await expect(h1).toHaveCSS('line-height', `${54 * 1.22}px`);
    expect(Math.round((await h1.boundingBox())!.height / (54 * 1.22))).toBe(3);

    // keyword-pillar 3개: ol(role=list) 안의 강조 텍스트 제목, 위쪽 1px border-strong, 번호 · 제목 · 근거 · 관련
    const pillarList = page.locator('ol.pillars');
    await expect(pillarList).toHaveAttribute('role', 'list');
    await expect(pillarList).toHaveAttribute('aria-label', '세 가지 키워드의 근거');
    const pillars = pillarList.locator('> li');
    await expect(pillars).toHaveCount(3);
    await expect(pillars.locator('.pillar-number')).toHaveText(['01', '02', '03']);
    await expect(pillars.locator('strong.pillar-title')).toHaveText(PILLARS.map((pillar) => pillar.title));
    await expect(pillars.locator('.pillar-body')).toHaveText(PILLARS.map((pillar) => pillar.body));
    await expect(pillars.locator('.pillar-related-label')).toHaveText(['관련', '관련', '관련']);
    await expect(pillars.locator('.pillar-related > span:last-child')).toHaveText(PILLARS.map((pillar) => pillar.related));
    await expect(page.locator('.pillars :is(h2, h3, h4, a)')).toHaveCount(0);
    for (const pillar of await pillars.all()) {
      await expect(pillar).toHaveCSS('border-top', `1px solid ${COLOR.borderStrong}`);
      await expect(pillar).toBeInViewport({ ratio: 1 });
    }
    // 1440에서 세 근거 문장은 같은 줄 수(03이 더 길어지면 짧은 문장으로 바꾼다)
    const bodyLines = await pillars.locator('.pillar-body').evaluateAll((bodies) =>
      bodies.map((body) => Math.round(body.getBoundingClientRect().height / parseFloat(getComputedStyle(body).lineHeight))),
    );
    expect(new Set(bodyLines).size).toBe(1);

    // 칩(수상 · 조회수 · 강점)과 CTA 없음(사용자 결정 2026-10-16). 히어로 안에는 링크가 없다.
    await expect(page.locator('.proof-chip, .strength-chip, .hero-strengths, .hero .btn, .hero-ctas')).toHaveCount(0);
    await expect(page.locator('.hero a')).toHaveCount(0);
    await expect(page.locator('.hero')).not.toContainText('9,400');
    // 보조 문장과 오른쪽 단 없음(사용자 결정): 눈썹 + h1은 왼쪽 8컬럼 폭, 오른쪽 4컬럼은 빈 여백
    await expect(page.locator('.hero-lead, .hero-side, .hero-top')).toHaveCount(0);
    await expect(page.locator('.hero')).not.toContainText('상태 관리와 API 연동까지 연결하며');
    const container = (await page.locator('.hero .container').evaluate((element) => {
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return { left: box.left + parseFloat(style.paddingLeft), width: box.width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) };
    }))!;
    const eightColumns = ((container.width - 11 * 24) * 8) / 12 + 7 * 24;
    const idBox = (await page.locator('.hero-id').boundingBox())!;
    expect(Math.abs(idBox.x - container.left)).toBeLessThanOrEqual(1);
    expect(Math.abs(idBox.width - eightColumns)).toBeLessThanOrEqual(1);
    expect((await h1.boundingBox())!.x + (await h1.boundingBox())!.width).toBeLessThanOrEqual(container.left + eightColumns + 1);

    // V2 여백: 히어로 아래 64px, About은 바로 이어서 위 여백 64px(Projects부터는 160px)
    const heroBox = (await page.locator('.hero').boundingBox())!;
    expect(heroBox.height).toBeLessThanOrEqual(900 * 0.88);
    await expect(page.locator('.hero')).toHaveCSS('padding-bottom', '64px');
    const aboutBox = (await page.locator('#about').boundingBox())!;
    expect(Math.abs(aboutBox.y - (heroBox.y + heroBox.height))).toBeLessThanOrEqual(1);
    await expect(page.locator('#about')).toHaveCSS('padding-top', '64px');
    // 첫 화면 하단: ABOUT 라벨 · 소개 제목까지. 사진 · Projects · 카드는 첫 화면 아래
    await expect(page.locator('#about .section-label')).toBeInViewport({ ratio: 1 });
    await expect(page.locator('#about-title')).toBeInViewport({ ratio: 1 });
    expect((await page.locator('#about .about-photo').boundingBox())!.y).toBeGreaterThanOrEqual(900);
    expect((await page.locator('#projects .section-label').boundingBox())!.y).toBeGreaterThan(900);
    for (const slug of ['newlearn', 'finch']) {
      const box = await card(page, slug).boundingBox();
      expect(box!.y).toBeGreaterThan(900);
    }
  });
});

// ---------------------------------------------------------------------------
test.describe('카드 그리드', () => {
  test('8개 최신순, 2열×4행 같은 높이, 슬롯 위치 정렬, 수상 없는 카드는 배지 자리를 비운다', async ({ page }) => {
    await openHome(page);
    const cards = page.locator('a.card');
    await expect(cards).toHaveCount(8);
    await expect(cards.locator('.card-name')).toHaveText(PROJECTS.map((project) => project.name));
    for (const [index, { slug }] of PROJECTS.entries()) {
      await expect(cards.nth(index)).toHaveAttribute('href', `/projects/${slug}/`);
    }
    await expect(page.locator('a.card a')).toHaveCount(0);
    await expect(card(page, 'ourwish')).toHaveAccessibleName('OURWISH');
    await expect(card(page, 'ourwish')).toHaveAccessibleDescription(/^공시금리 대신/);
    await expect(page.locator('#projects button')).toHaveCount(0); // 기술 필터 버튼 없음

    const layout = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>('a.card')).map((element) => {
        const rect = (selector: string) => element.querySelector(selector)!.getBoundingClientRect();
        const box = element.getBoundingClientRect();
        return {
          x: Math.round(box.x),
          y: Math.round(box.y),
          height: box.height,
          oneliner: rect('.card-oneliner').top - box.top,
          badgeSlot: rect('.card-badge-slot').height,
          result: rect('.card-result-inner').top - box.top,
          stack: rect('.card-stack').top - box.top,
          media: rect('.card-media'),
        };
      }),
    );

    const columns = new Set(layout.map((item) => item.x));
    const rows = new Set(layout.map((item) => item.y));
    expect(columns.size).toBe(2);
    expect(rows.size).toBe(4);
    for (const [index, item] of layout.entries()) {
      expect(item.x).toBe(index % 2 === 0 ? Math.min(...columns) : Math.max(...columns));
      expect(Math.abs(item.height - layout[0].height)).toBeLessThan(1);
      expect(Math.abs(item.badgeSlot - layout[0].badgeSlot)).toBeLessThan(0.5);
      expect(Math.abs(item.media.width / item.media.height - 16 / 10)).toBeLessThan(0.01);
    }
    for (let row = 0; row < 4; row += 1) {
      const [left, right] = [layout[row * 2], layout[row * 2 + 1]];
      expect(Math.abs(left.oneliner - right.oneliner)).toBeLessThan(0.5);
      expect(Math.abs(left.result - right.result)).toBeLessThan(0.5);
      expect(Math.abs(left.stack - right.stack)).toBeLessThan(0.5);
    }

    // 배지 자리: 진행 중 · 수상 · 빈칸
    await expect(card(page, 'newlearn').locator('.card-badge-slot .status-pill')).toHaveText('진행 중');
    await expect(card(page, 'newlearn').locator('.card-badge-slot svg')).toHaveCount(0);
    for (const slug of ['finch', 'boogle', 'moa']) {
      await expect(card(page, slug).locator('.card-badge-slot > *')).toHaveCount(0);
    }
    await expect(card(page, 'banggoot').locator('.award-badge')).toHaveText('SSAFY 2학기 공통 프로젝트 우수상 (1위)');
    await expect(card(page, 'ourwish').locator('.award-badge')).toHaveText('SSAFY 1학기 관통 프로젝트 최우수상 (1위)');
    await expect(card(page, 'devoops').locator('.award-badge')).toHaveText('Mash UP 동아리 내 프로젝트 1위');
    await expect(card(page, 'msp').locator('.award-badge')).toHaveText('서강 융합기술 경진대회 특별상 (AI/SW상, 인기상)');

    // 사용자 결정 콘텐츠
    await expect(card(page, 'newlearn').locator('.card-period')).toHaveText('2026.10 – 2026.11');
    await expect(card(page, 'newlearn').locator('.card-stack')).toHaveText('React · TypeScript · SEED Design · D3.js');
    await expect(card(page, 'devoops').locator('.card-period')).toHaveText('2025.04 – 2025.10');

    // 성과 슬롯: metric 4개, 나머지는 성과 문장
    for (const metric of METRICS) {
      const stat = card(page, metric.slug).locator('.metric-stat');
      await expect(stat.locator('.metric-final')).toHaveText(metric.value);
      await expect(stat.locator('.metric-unit')).toHaveText(metric.unit);
      await expect(stat.locator('.metric-label')).toHaveText(metric.label);
    }
    for (const slug of ['newlearn', 'boogle', 'moa', 'devoops']) {
      await expect(card(page, slug).locator('.metric-stat')).toHaveCount(0);
      await expect(card(page, slug).locator('.outcome-text')).toHaveCSS('font-weight', '600');
    }
  });
});

// ---------------------------------------------------------------------------
test.describe('JS 꺼짐', () => {
  test.use({ javaScriptEnabled: false });

  test('모든 텍스트·카드가 보이고 metric은 최종값, 앵커는 일반 링크로 동작한다', async ({ page }) => {
    await openHome(page);
    await expect(page.locator('html')).not.toHaveClass(/\bjs\b/);
    await expect(page.locator('[data-hero-line]').first()).toHaveCSS('opacity', '1');

    const cells = page.locator('.card-cell');
    await expect(cells).toHaveCount(8);
    for (const cell of await cells.all()) {
      await expect(cell).toHaveCSS('opacity', '1');
      await expect(cell).toBeVisible();
    }
    for (const metric of METRICS) {
      const final = card(page, metric.slug).locator('.metric-final');
      await expect(final).toHaveText(metric.value);
      await expect(final).toHaveCSS('opacity', '1');
    }
    await expect(page.locator('footer, .contact-band')).toHaveCount(0);

    await page.getByRole('navigation').getByRole('link', { name: 'Projects' }).click();
    await expect(page).toHaveURL(/\/#projects$/);
    await waitForScrollIdle(page);
    const top = await page.locator('#projects .section-label').evaluate((element) => element.getBoundingClientRect().top);
    expect(Math.abs(top - HEADING_TOP)).toBeLessThanOrEqual(1);
  });

  test('Tech Stack · Experience · Activities · About이 모두 보인다: 칩 목록·자세히 보기 내용은 펼친 채, 동작하지 않는 토글·복사 버튼은 숨김', async ({
    page,
  }) => {
    await openHome(page);
    for (const id of ['tech-stack', 'experience', 'activities', 'about']) {
      const section = page.locator(`#${id}`);
      await expect(section).toBeVisible();
      for (const element of await section.locator('[data-reveal]').all()) {
        await expect(element).toHaveCSS('opacity', '1');
      }
    }

    // 칩 목록: JS가 없으면 모두 보인다(링크로 이동 가능)
    const panels = page.locator('[data-skill-panel]');
    await expect(panels).toHaveCount(Object.keys(CHIP_PROJECTS).length);
    for (const panel of await panels.all()) await expect(panel).toBeVisible();
    await expect(page.locator('#skill-panel-react a')).toHaveText(['NEW:LEARN', 'FINCH', 'Boogle', 'MoonSunPower']);

    // DAILY TICK 파이프라인·검증 표: 처음부터 보이고, 토글 버튼은 숨김
    await expect(page.locator('#exp-dailytick-details')).toBeVisible();
    await expect(page.locator('#exp-dailytick-details tbody tr')).toHaveCount(5);
    await expect(page.locator('[data-timeline-toggle]')).toBeHidden();

    // About: 사진·학력·수상·연락처가 보인다(mailto 그대로)
    await expect(page.locator('#about img')).toBeVisible();
    await expect(page.locator('#about .award-list > li')).toHaveCount(AWARDS.length);
    await expect(page.locator('#about a[href^="mailto:"]')).toBeVisible();
    await expect(page.locator('[data-copy-email], [role="status"]')).toHaveCount(0); // 이메일 복사 · toast 없음

    await page.getByRole('navigation').getByRole('link', { name: 'Experience' }).click();
    await expect(page).toHaveURL(/\/#experience$/);
    await waitForScrollIdle(page);
    const top = await page.locator('#experience .section-label').evaluate((element) => element.getBoundingClientRect().top);
    expect(Math.abs(top - HEADING_TOP)).toBeLessThanOrEqual(1);
  });

  test('좁은 화면에서도 내비 앵커가 보이고 가로 스크롤이 없다', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await openHome(page);
    await expect(page.locator('[data-menu-button]')).toBeHidden();
    await expect(page.getByRole('button', { name: '이메일 복사' })).toHaveCount(0);
    await expect(page.locator('.nav-link').first()).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

// ---------------------------------------------------------------------------
test.describe('모션 감소', () => {
  test.use({ reducedMotion: 'reduce' });

  test('리빌·카운트업·카드 이동/확대 없이 테두리·그림자만 바뀐다', async ({ page }) => {
    await openHome(page);
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
    await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');

    for (const slug of ['ourwish', 'msp']) {
      await card(page, slug).evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await expect(page.locator('.reveal-pending, .is-revealing')).toHaveCount(0);
      const stat = card(page, slug).locator('.metric-stat');
      await expect(stat).not.toHaveClass(/is-counting/);
      await expect(stat.locator('.metric-anim')).toHaveText('');
      await expect(stat.locator('.metric-final')).toHaveCSS('opacity', '1');
    }

    const target = card(page, 'ourwish');
    await target.hover();
    await expect(target).toHaveCSS('border-color', COLOR.borderStrong);
    await expect(target).not.toHaveCSS('box-shadow', 'none');
    await expect(target).toHaveCSS('transform', 'none');
    await expect(target.locator('.card-image').first()).toHaveCSS('transform', 'none');
  });
});

// ---------------------------------------------------------------------------
test.describe('이미지 실패', () => {
  test('16:10 프레임을 유지하고 가운데에 프로젝트명을 보이며 alt를 유지한다', async ({ page }) => {
    await page.route(/\/_astro\/(newlearn-timeline|msp-service)\.[^/]*\.webp/, (route) =>
      route.fulfill({ status: 404, body: '' }),
    );
    await openHome(page);
    const heightBefore = (await card(page, 'devoops').boundingBox())!.height;

    for (const { slug, name, alt } of [
      { slug: 'newlearn', name: 'NEW:LEARN', alt: 'NEW:LEARN 이슈 타임라인 프로토타입 화면' },
      { slug: 'msp', name: 'MoonSunPower', alt: 'MoonSunPower 서비스 화면' },
    ]) {
      const target = card(page, slug);
      await bringIntoView(page, target);
      const frame = target.locator('.card-media');
      await expect(frame).toHaveClass(/is-media-failed/);
      const fallback = frame.locator('.card-media-fallback');
      await expect(fallback).toBeVisible();
      await expect(fallback).toHaveText(name);
      await expect(fallback).toHaveCSS('font-size', '14px');
      await expect(fallback).toHaveCSS('color', COLOR.inkSecondary);
      await expect(frame.locator('img')).toHaveAttribute('alt', alt);

      const frameBox = (await frame.boundingBox())!;
      const fallbackBox = (await fallback.boundingBox())!;
      expect(Math.abs(frameBox.width / frameBox.height - 16 / 10)).toBeLessThan(0.01);
      expect(Math.abs(fallbackBox.x + fallbackBox.width / 2 - (frameBox.x + frameBox.width / 2))).toBeLessThan(1);
    }

    // 레이아웃 이동 없음: 같은 행 카드와 높이가 같고, 실패 전후 카드 높이가 같다
    const msp = (await card(page, 'msp').boundingBox())!;
    const devoops = (await card(page, 'devoops').boundingBox())!;
    expect(Math.abs(msp.height - devoops.height)).toBeLessThan(1);
    expect(Math.abs(devoops.height - heightBefore)).toBeLessThan(1);
  });
});

// ---------------------------------------------------------------------------
for (const width of [375, 320]) {
  test.describe(`좁은 화면 ${width}px`, () => {
    test.use({ viewport: { width, height: 760 } });

    test('1열, display-mobile, 가로 스크롤 없음', async ({ page }) => {
      await openHome(page);
      await expect(page.locator('h1')).toHaveCSS('font-size', '34px');
      const xs = await page.locator('a.card').evaluateAll((elements) =>
        elements.map((element) => Math.round(element.getBoundingClientRect().x)),
      );
      expect(new Set(xs).size).toBe(1);
      await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
      await waitForScrollIdle(page);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });

    test('Experience · Activities · About: 칩 목록과 자세히 보기를 펼쳐도 가로 스크롤이 없고, 칩·토글은 44px 이상', async ({
      page,
    }) => {
      await openHome(page);
      await expect(page.locator('#experience .home-section-title')).toHaveCSS('font-size', '26px');
      await expect(page.locator('#experience')).toHaveCSS('padding-top', '96px');
      await expect(page.locator('#tech-stack')).toHaveCSS('padding-top', '96px');

      // 가장 긴 목록(TypeScript, 6개)과 DAILY TICK 상세를 펼친다
      const chip = page.locator('[data-tech-chip="typescript"]');
      await bringIntoView(page, chip);
      await chip.click();
      await expect(page.locator('#skill-panel-typescript')).toBeVisible();
      const toggle = page.locator('[data-timeline-toggle]');
      await bringIntoView(page, toggle);
      await toggle.click();
      await expect(page.locator('#exp-dailytick-details')).toBeVisible();

      for (const target of [chip, toggle, page.locator('[data-tech-chip="react"]')]) {
        expect((await target.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      }

      const offenders = await page.evaluate(() => {
        const width = document.documentElement.clientWidth;
        return Array.from(document.querySelectorAll<HTMLElement>('#tech-stack *, #experience *, #activities *, #about *'))
          .filter((element) => {
            const rect = element.getBoundingClientRect();
            return rect.width > 0 && (rect.right > width + 0.5 || rect.left < -0.5);
          })
          .filter((element) => !element.closest('.sr-only'))
          .map((element) => `${element.tagName}.${element.className}`);
      });
      expect(offenders).toEqual([]);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });

    test('"메뉴" 패널은 Esc·바깥 클릭·링크로 닫히고 포커스가 버튼으로 돌아오며, 열린 동안 스크롤을 잠근다', async ({
      page,
    }) => {
      await openHome(page);
      const button = page.locator('[data-menu-button]');
      const panel = page.locator('#site-nav-menu');
      await expect(button).toBeVisible();
      await expect(button).toHaveText('메뉴');
      await expect(button).toHaveAttribute('aria-expanded', 'false');
      await expect(button).toHaveAttribute('aria-controls', 'site-nav-menu');
      await expect(panel).toBeHidden();

      const open = async () => {
        await button.click();
        await expect(button).toHaveAttribute('aria-expanded', 'true');
        await expect(panel).toBeVisible();
      };

      // 열림: 스크롤 잠금, 항목 높이 48px
      await open();
      await expect(page.locator('html')).toHaveCSS('overflow-y', 'hidden');
      const itemHeights = await panel.locator('a').evaluateAll((links) => links.map((link) => link.getBoundingClientRect().height));
      expect(itemHeights).toEqual([48, 48, 48, 48, 48]);
      const before = await page.evaluate(() => window.scrollY);
      await page.mouse.move(width / 2, 600);
      await page.mouse.wheel(0, 600);
      await page.waitForTimeout(200);
      expect(await page.evaluate(() => window.scrollY)).toBe(before);

      // Esc
      await page.keyboard.press('Escape');
      await expect(button).toHaveAttribute('aria-expanded', 'false');
      await expect(panel).toBeHidden();
      await expect(button).toBeFocused();
      await expect(page.locator('html')).not.toHaveCSS('overflow-y', 'hidden');

      // 바깥 클릭
      await open();
      await page.mouse.click(4, 740);
      await expect(button).toHaveAttribute('aria-expanded', 'false');
      await expect(panel).toBeHidden();
      await expect(button).toBeFocused();

      // 링크
      await open();
      await panel.getByRole('link', { name: 'Projects' }).click();
      await expect(button).toHaveAttribute('aria-expanded', 'false');
      await expect(panel).toBeHidden();
      await expect(button).toBeFocused();
      await expect(page).toHaveURL(/\/#projects$/);
      await waitForScrollIdle(page);
      const top = await page.locator('#projects .section-label').evaluate((element) => element.getBoundingClientRect().top);
      expect(Math.abs(top - HEADING_TOP)).toBeLessThanOrEqual(1);
    });
  });
}

// ---------------------------------------------------------------------------
test.describe('앵커 딥링크', () => {
  test('/#projects 직접 진입: 머리글이 내비 아래 64px에 오고 활성 내비를 동기화한다', async ({ page }) => {
    await openHome(page, '/#projects');
    await waitForScrollIdle(page);
    const top = await page.locator('#projects .section-label').evaluate((element) => element.getBoundingClientRect().top);
    expect(Math.abs(top - HEADING_TOP)).toBeLessThanOrEqual(1);

    const nav = page.getByRole('navigation', { name: '주요 섹션' });
    await expect(nav.getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'location');
    for (const name of ['About', 'Tech Stack', 'Experience', 'Activities']) {
      await expect(nav.getByRole('link', { name })).not.toHaveAttribute('aria-current', /.*/);
    }
    // 스크롤한 뒤에는 내비 테두리와 진행 바가 보인다
    await expect(page.locator('[data-site-header]')).toHaveClass(/is-scrolled/);
    const progress = await page
      .locator('[data-section-progress]')
      .evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).a);
    expect(progress).toBeGreaterThan(0);
    expect(progress).toBeLessThan(1);
  });

  test('About · Tech Stack · Projects · Experience · Activities: 내비 앵커로 이동하면 머리글이 모두 같은 자리에 오고 스크롤 스파이가 활성 항목을 바꾼다', async ({
    page,
  }) => {
    await openHome(page);
    const nav = page.getByRole('navigation', { name: '주요 섹션' });
    const names = NAV_NAMES;
    const headingTop = (id: string) =>
      page.locator(`#${id} .section-label`).first().evaluate((element) => element.getBoundingClientRect().top);
    // 문서 순서대로(히어로 바로 다음 About은 위 여백 64px, 나머지는 160px이지만 머리글 위치는 같다)
    // 내비 순서 = 섹션 순서
    await expect(nav.getByRole('link')).toHaveText(Object.values(NAV_NAMES));
    for (const id of SECTION_ORDER as (keyof typeof NAV_NAMES)[]) {
      await expect(nav.locator(`a[href="/#${id}"]`)).toHaveCount(1);
      await expect(page.locator(`section#${id}`)).toHaveCount(1);

      await nav.getByRole('link', { name: names[id], exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`/#${id}$`));
      await waitForScrollIdle(page);
      // 섹션 위 여백(160px)까지 내려가지 않고, 영문 라벨이 내비 아래 64px에 온다
      expect(Math.abs((await headingTop(id)) - HEADING_TOP), id).toBeLessThanOrEqual(1);
      await expect(nav.getByRole('link', { name: names[id], exact: true })).toHaveAttribute('aria-current', 'location');
      for (const other of Object.keys(names).filter((key) => key !== id) as (keyof typeof names)[]) {
        await expect(nav.getByRole('link', { name: names[other], exact: true })).not.toHaveAttribute('aria-current', /.*/);
      }
    }

    // 딥링크로 들어와도 같은 위치·같은 활성 항목
    await openHome(page, '/#activities');
    await waitForScrollIdle(page);
    expect(Math.abs((await headingTop('activities')) - HEADING_TOP)).toBeLessThanOrEqual(1);
    await expect(nav.getByRole('link', { name: 'Activities' })).toHaveAttribute('aria-current', 'location');

    // 딥링크 /#about(히어로 바로 다음 섹션)도 같은 자리
    await openHome(page, '/#about');
    await waitForScrollIdle(page);
    expect(Math.abs((await headingTop('about')) - HEADING_TOP)).toBeLessThanOrEqual(1);
    await expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'location');

    // 맨 아래: 문서에서 마지막 섹션(Activities)이 활성
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await waitForScrollIdle(page);
    const progress = await page
      .locator('[data-section-progress]')
      .evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).a);
    expect(progress).toBeCloseTo(1, 2);
    await expect(nav.getByRole('link', { name: 'Activities' })).toHaveAttribute('aria-current', 'location');
    await expect(nav.locator('[aria-current]')).toHaveCount(1);
  });

  test('/#project-<slug> 딥링크(상세 pager의 "전체 프로젝트"): 그 카드 위쪽이 내비 바로 아래에 오고 Projects가 활성이다', async ({
    page,
  }) => {
    await openHome(page, '/#project-msp');
    await waitForScrollIdle(page);
    await expect(page.locator('li.card-cell[id^="project-"]')).toHaveCount(PROJECTS.length);
    for (const { slug } of PROJECTS) await expect(page.locator(`li.card-cell#project-${slug} a.card[data-card="${slug}"]`)).toHaveCount(1);
    await expect(page.locator('#project-msp')).not.toHaveClass(/reveal-pending|is-revealing/);
    await waitForAnimations(page);
    const top = await card(page, 'msp').evaluate((element) => element.getBoundingClientRect().top);
    expect(Math.abs(top - NAV_HEIGHT)).toBeLessThanOrEqual(1);
    await expect(page.getByRole('navigation', { name: '주요 섹션' }).getByRole('link', { name: 'Projects' })).toHaveAttribute(
      'aria-current',
      'location',
    );
  });

  test('최상단에서는 내비 테두리가 없고 활성 항목도 없다', async ({ page }) => {
    await openHome(page);
    await expect(page.locator('[data-site-header]')).not.toHaveClass(/is-scrolled/);
    const hairline = await page
      .locator('[data-site-header]')
      .evaluate((element) => getComputedStyle(element, '::after').opacity);
    expect(hairline).toBe('0');
    await expect(page.locator('.nav-link[aria-current]')).toHaveCount(0);
  });
});

// ---------------------------------------------------------------------------
test.describe('AC: 키보드', () => {
  test('첫 Tab에 "본문으로 건너뛰기", Tab 순서 = 읽기 순서, 2px 포커스 링이 내비에 가리지 않는다', async ({ page }) => {
    test.setTimeout(120_000); // 상호작용 요소 55개를 하나씩 Tab으로 지나간다
    await openHome(page);
    await waitForAnimations(page);

    const total = await page.evaluate(() => {
      const focusables = Array.from(
        document.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      ).filter((element) => {
        const style = getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden' && element.getClientRects().length > 0;
      });
      focusables.forEach((element, index) => element.setAttribute('data-tab-order', String(index)));
      return focusables.length;
    });
    // 읽기 순서: skip · 로고 · 내비 5(About · Tech Stack · Projects · Experience · Activities) (7, 히어로에는 링크 · 칩 · CTA 없음)
    // + About: 수상 관련 링크 5(프로젝트 4 · 서강투데이 ↗) · 이메일 · 휴대폰 · PDF · GitHub · velog · Blog (11, 이메일 복사 없음)
    // + Tech Stack: tech-chip 15 (닫힌 칩 목록 링크는 제외)
    // + Projects: 카드 8
    // + Experience: DAILY TICK 링크 2 · 자세히 보기 1 · 물류관리 시스템 GitHub 1 (4)
    // + Activities: OURWISH 프로젝트 보기 · SSAFYcial 인스타그램 · 서강투데이 인스타그램 · 서강투데이 책자
    //   · Mash UP(DevOops 프로젝트 보기 · Next.js 스터디 GitHub · DevOops GitHub) (7)
    // (페이지 끝 contact-band는 없앴다. 내비에 Tech Stack이 늘어 51 → 52)
    expect(total).toBe(52);

    await page.keyboard.press('Tab');
    const skip = page.locator('.skip-link');
    await expect(skip).toBeFocused();
    await expect(skip).toHaveText('본문으로 건너뛰기');
    await expect(skip).toBeInViewport({ ratio: 1 });
    await expect(skip).toHaveCSS('outline-style', 'solid');
    await expect(skip).toHaveCSS('outline-width', '2px');

    for (let index = 1; index < total; index += 1) {
      await page.keyboard.press('Tab');
      await waitForScrollIdle(page);
      const focused = page.locator(':focus');
      await expect(focused).toHaveAttribute('data-tab-order', String(index));
      await waitForAnimations(page);

      const ring = await focused.evaluate((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        const header = document.querySelector('[data-site-header]')!;
        return {
          style: style.outlineStyle,
          width: style.outlineWidth,
          offset: style.outlineOffset,
          color: style.outlineColor,
          inHeader: header.contains(element),
          ringTop: rect.top - parseFloat(style.outlineWidth) - parseFloat(style.outlineOffset),
          ringBottom: rect.bottom + parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset),
          headerBottom: header.getBoundingClientRect().bottom,
          viewport: window.innerHeight,
        };
      });
      expect(ring.style, `item ${index}`).toBe('solid');
      expect(ring.width, `item ${index}`).toBe('2px');
      expect(ring.offset, `item ${index}`).toBe('2px');
      expect(ring.color, `item ${index}`).toBe(COLOR.primary);
      if (!ring.inHeader) {
        expect(ring.ringTop, `item ${index} hidden under nav`).toBeGreaterThanOrEqual(ring.headerBottom);
      } else {
        expect(ring.ringTop, `item ${index}`).toBeGreaterThanOrEqual(0);
      }
      expect(ring.ringBottom, `item ${index}`).toBeLessThanOrEqual(ring.viewport);
    }
  });
});

// ---------------------------------------------------------------------------
test.describe('AC: 문서 구조', () => {
  test('랜드마크, h1 1개, h2 섹션 제목, lang="ko", aria-current, 메뉴 버튼 aria', async ({ page }) => {
    await openHome(page);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
    await expect(page).toHaveTitle('안서진 — 사용자 경험과 흐름을 설계하는 프론트엔드 개발자');
    // 링크 미리보기는 제목 한 줄만(사용자 결정): 설명 태그 없음, og:title은 저장소 이름
    await expect(page.locator('meta[name="description"], meta[property="og:description"]')).toHaveCount(0);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'anseojin-portfolio');
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
      'content',
      '안서진 · FRONTEND DEVELOPER. 기획과 UI/UX 디자인을 이해하고, 사용자 경험과 흐름을 설계하는 프론트엔드 개발자. 사용자 관점의 흐름 설계 · 기획부터 개발까지 직접 연결 · 아이디어를 실제 서비스로 완성',
    );
    for (const selector of ['meta[property="og:image:alt"]']) {
      expect(await page.locator(selector).getAttribute('content'), selector).not.toMatch(/9,400|1위|\d+회/);
    }

    await expect(page.getByRole('banner')).toHaveCount(1);
    await expect(page.getByRole('navigation')).toHaveCount(1);
    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.getByRole('contentinfo')).toHaveCount(0); // footer(contact-band) 없음
    await expect(page.getByRole('banner').getByRole('navigation')).toHaveCount(1);

    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h2')).toHaveText(H2_TEXTS);
    await expect(page.locator('#projects .section-label + h2, #projects .section-label ~ h2')).toHaveText('프로젝트');
    // 섹션 순서: 히어로 → About → Tech Stack → Projects → Experience → Activities, 각 섹션은 영문 라벨 + h2(aria-labelledby)
    const order = await page.locator('main > section[id]').evaluateAll((sections) => sections.map((section) => section.id));
    expect(order).toEqual(SECTION_ORDER);
    // 페이지 끝: 마지막 섹션(Activities) 아래에 섹션 간격 160px, 그 아래는 문서 끝
    await expect(page.locator('#activities')).toHaveCSS('padding-bottom', '160px');
    expect(
      await page.evaluate(
        () => document.documentElement.scrollHeight - (document.getElementById('activities')!.getBoundingClientRect().bottom + window.scrollY),
      ),
    ).toBeLessThanOrEqual(1);
    // 위 여백: 히어로 바로 다음(About)만 64px, Projects부터는 섹션 간격 160px
    for (const [id, label, title, top] of [
      ['about', 'ABOUT', '소개', '64px'],
      ['tech-stack', 'TECH STACK', '기술 스택', '160px'],
      ['projects', 'PROJECTS', '프로젝트', '160px'],
      ['experience', 'EXPERIENCE', '개발 경험', '160px'],
      ['activities', 'ACTIVITIES', '활동', '160px'],
    ]) {
      const section = page.locator(`#${id}`);
      await expect(section.locator('.section-label').first()).toHaveText(label);
      await expect(section.locator('.section-label + h2')).toHaveText(title);
      await expect(section).toHaveAccessibleName(title);
      await expect(section, id).toHaveCSS('padding-top', top);
    }
    // Tech Stack: h2 아래 칩 행만(소제목 없음). Experience: h2 "개발 경험"을 되풀이하는 h3 없이 행 제목이 h3
    await expect(page.locator('#tech-stack :is(h3, h4)')).toHaveCount(0);
    await expect(page.locator('#tech-stack [data-skill-group]')).toHaveCount(5);
    await expect(page.locator('#experience [data-skill-group], #experience [data-tech-chip]')).toHaveCount(0);
    await expect(page.locator('#experience h3')).toHaveText(['DAILY TICK', '데이터베이스시스템 프로젝트', '싸피레이스']);
    await expect(page.locator('#experience h4')).toHaveCount(0);
    await expect(page.locator('#activities h3')).toHaveText(['UI/UX Design 작업물', '콘텐츠 기획·제작', '동아리·교육 활동']);
    await expect(page.locator('#about h3')).toHaveText(['학력·교육·어학', '수상', '연락처', '아카이브']);

    const button = page.locator('[data-menu-button]');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    const controls = await button.getAttribute('aria-controls');
    await expect(page.locator(`#${controls}`)).toHaveCount(1);

    await page.locator('#projects').evaluate((element) => element.scrollIntoView({ behavior: 'instant' }));
    await expect(page.locator('.nav-link[data-nav-link="projects"]')).toHaveAttribute('aria-current', 'location');
  });

  test('외부 링크는 새 탭 + ↗ + "(새 창)", 전화는 tel:, PDF는 download 링크', async ({ page, request }) => {
    await openHome(page);
    // About 수상 UNTACT → 서강투데이 ↗ · GitHub/velog/Blog (4) + DAILY TICK 서비스/GitHub · 물류관리 시스템 GitHub (3)
    // + SSAFYcial · 서강투데이 인스타그램/책자 (3) + Mash UP Next.js 스터디 · DevOops GitHub (2).
    // 히어로 GitHub 버튼과 contact-band는 없앴다.
    const external = page.locator('a[href^="http"]');
    await expect(external).toHaveCount(12);
    for (const link of await external.all()) {
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
      await expect(link.locator('.sr-only')).toHaveText('(새 창)');
      await expect(link.locator('svg[aria-hidden="true"]')).toHaveCount(1);
    }

    // 연락처는 About 연락처 블록에만 있다
    await expect(page.locator('a[href^="mailto:"]')).toHaveText(EMAIL);
    await expect(page.locator('#about a[href^="mailto:"]')).toHaveCount(1);
    const phone = page.locator('a[href^="tel:"]');
    await expect(phone).toHaveText('010-5465-2165');

    const pdf = page.getByRole('link', { name: '포트폴리오 PDF 받기' });
    await expect(pdf).toHaveCount(1);
    await expect(page.locator('#about').getByRole('link', { name: '포트폴리오 PDF 받기' })).toHaveCount(1);
    await expect(pdf).toHaveAttribute('download', 'anseojin-portfolio.pdf');
    await expect(pdf).toHaveAttribute('href', '/anseojin-portfolio.pdf');
    await expect(pdf).not.toHaveAttribute('target', /.*/);
    await expect(pdf).toHaveClass(/btn-secondary/);
    // About 링크가 가리키는 파일을 그대로 받아 본다
    const response = await request.head((await pdf.getAttribute('href'))!);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('pdf');
    // 남아 있던 public/ 사본이 아니라 루트 원본과 같은 파일인지
    expect(Number(response.headers()['content-length'])).toBe(statSync(join(PROJECT_ROOT, 'anseojin-portfolio.pdf')).size);

    // 홈에는 primary 버튼이 없다(히어로 CTA 제거, 사용자 결정). 포커스 때만 보이는 건너뛰기 링크는 제외.
    await expect(page.locator('.btn-primary:not(.skip-link)')).toHaveCount(0);
  });
});

// ---------------------------------------------------------------------------
test.describe('AC: 스크롤 리빌', () => {
  test.use({ reducedMotion: 'no-preference', viewport: { width: 1440, height: 900 } });

  test('첫 화면 밖 카드는 리빌 대기 후 스크롤하면 나타나고, 첫 화면 요소는 숨기지 않으며, 히어로 줄 리빌은 900ms 안에 끝난다', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/\bjs\b/);

    // 히어로 줄 리빌: 줄마다 CSS 애니메이션, 가장 늦은 줄의 delay + duration ≤ 900ms
    const heroTimings = await page.evaluate(() =>
      document
        .getAnimations()
        .filter((animation) => {
          const target = (animation.effect as KeyframeEffect | null)?.target;
          return target instanceof Element && target.matches('[data-hero-line]');
        })
        .map((animation) => {
          const timing = animation.effect!.getTiming();
          return Number(timing.delay ?? 0) + Number(timing.duration ?? 0);
        }),
    );
    expect(heroTimings.length).toBe(5); // 눈썹 · h1 3줄 · 기둥
    expect(Math.max(...heroTimings)).toBeLessThanOrEqual(900);

    // 첫 화면 안(하단)의 About 머리글은 숨기지 않는다
    const head = page.locator('#about .home-section-head');
    await expect(head).not.toHaveClass(/reveal-pending/);
    await expect(head).toHaveCSS('opacity', '1');

    // 첫 화면 밖 카드는 대기 상태(opacity 0)였다가 스크롤하면 나타난다
    const cell = page.locator('.card-cell').nth(4);
    await expect(cell).toHaveClass(/reveal-pending/);
    await expect(cell).toHaveCSS('opacity', '0');
    await cell.evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await expect(cell).not.toHaveClass(/reveal-pending|is-revealing/);
    await expect(cell).toHaveCSS('opacity', '1');
  });
});

// ---------------------------------------------------------------------------
test.describe('AC: 카운트업', () => {
  test('metric이 50% 보이면 1회 카운트업, DOM 텍스트는 처음부터 최종값, 애니메이션 레이어는 aria-hidden', async ({
    page,
  }) => {
    await openHome(page);
    const stat = card(page, 'ourwish').locator('.metric-stat');
    const final = stat.locator('.metric-final');
    const layer = stat.locator('.metric-anim');

    await expect(final).toHaveText('588');
    await expect(layer).toHaveAttribute('aria-hidden', 'true');
    await expect(stat).toHaveClass(/is-counting/); // 보이기 전: 시각적으로 0에서 대기
    await expect(layer).toHaveText('0');

    // 애니메이션 레이어에 들어간 값과, 그때의 DOM 최종값을 모두 기록한다
    await stat.evaluate((element) => {
      const layerElement = element.querySelector('.metric-anim')!;
      const finalElement = element.querySelector('.metric-final')!;
      const log: { layer: string; final: string }[] = [];
      (window as unknown as { __countLog: typeof log }).__countLog = log;
      new MutationObserver((records) => {
        for (const record of records) {
          for (const node of Array.from(record.addedNodes)) {
            log.push({ layer: node.textContent ?? '', final: finalElement.textContent ?? '' });
          }
        }
      }).observe(layerElement, { childList: true, characterData: true, subtree: true });
    });

    await stat.evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await expect(stat).toHaveAttribute('data-countup-done', 'true', { timeout: 3_000 });
    await expect(stat).not.toHaveClass(/is-counting/);
    await expect(layer).toHaveText('');
    await expect(final).toHaveCSS('opacity', '1');

    const log = await page.evaluate(() => (window as unknown as { __countLog: { layer: string; final: string }[] }).__countLog);
    const values = log.map((entry) => entry.layer);
    const numbers = values.map((value) => Number(value.replace(/,/g, '')));
    expect(values.length).toBeGreaterThan(3);
    expect(values.some((value) => value !== '0' && value !== '588')).toBe(true);
    expect(values.at(-1)).toBe('588');
    expect(numbers.every((value, index) => index === 0 || value >= numbers[index - 1])).toBe(true);
    expect(log.every((entry) => entry.final === '588')).toBe(true);

    // 1회만: 벗어났다 다시 들어와도 다시 세지 않는다
    const count = log.length;
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await stat.evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.waitForTimeout(400);
    expect(await page.evaluate(() => (window as unknown as { __countLog: unknown[] }).__countLog.length)).toBe(count);
  });
});

// ---------------------------------------------------------------------------
test.describe('AC: 카드 미리보기 확대', () => {
  test('hover 가능한 기기: hover와 focus-visible에서 ×1.04, −4px, border-strong, hover 그림자(240ms)', async ({ page }) => {
    await openHome(page);
    const target = card(page, 'ourwish');
    await bringIntoView(page, target);
    await expect(target).toHaveCSS('transition-duration', /0\.24s/);
    await expect(target).toHaveCSS('border-color', COLOR.borderHairline);
    await expect(target).toHaveCSS('box-shadow', 'none');

    await target.hover();
    await expect(target).toHaveCSS('transform', LIFTED);
    await expect(target).toHaveCSS('border-color', COLOR.borderStrong);
    await expect(target).toHaveCSS('box-shadow', /rgba\(28, 35, 51, 0\.1\) 0px 16px 40px/);
    await expect(target.locator('.card-image').first()).toHaveCSS('transform', ZOOMED);

    // focus-visible (키보드)
    await page.mouse.move(0, 0);
    await expect(target).toHaveCSS('transform', 'none');
    const previous = card(page, 'banggoot');
    await previous.focus();
    await page.keyboard.press('Tab');
    await expect(target).toBeFocused();
    await expect(target).toHaveCSS('transform', LIFTED);
    await expect(target).toHaveCSS('border-color', COLOR.borderStrong);
    await expect(target).toHaveCSS('box-shadow', /rgba\(28, 35, 51, 0\.1\) 0px 16px 40px/);
    await expect(target.locator('.card-image').first()).toHaveCSS('transform', ZOOMED);
  });

  test.describe('hover가 없는 기기', () => {
    test.use({ hasTouch: true, isMobile: true, viewport: { width: 1024, height: 800 } });

    test('hover 효과가 없다', async ({ page }) => {
      await openHome(page);
      expect(await page.evaluate(() => matchMedia('(hover: hover)').matches)).toBe(false);
      const target = card(page, 'ourwish');
      await bringIntoView(page, target);
      await target.hover();
      await page.waitForTimeout(300);
      await expect(target).toHaveCSS('transform', 'none');
      await expect(target).toHaveCSS('border-color', COLOR.borderHairline);
      await expect(target).toHaveCSS('box-shadow', 'none');
      await expect(target.locator('.card-image').first()).toHaveCSS('transform', 'none');
    });
  });
});

// ---------------------------------------------------------------------------
test.describe('Tech Stack: tech-chip', () => {
  const chip = (page: Page, id: string) => page.locator(`#tech-stack [data-tech-chip="${id}"]`);
  const panelOf = async (page: Page, id: string) => page.locator(`#${await chip(page, id).getAttribute('aria-controls')}`);

  test('카테고리 5개, 칩은 button(기술명 + 사용 프로젝트 수, ink-tertiary), 쓴 프로젝트가 없는 기술은 정적 칩', async ({ page }) => {
    await openHome(page);
    await expect(page.locator('#tech-stack [data-skill-group] .skill-group-label')).toHaveText([
      'Frontend',
      'App / Real-time',
      'Backend / Languages',
      'Design & Collaboration',
      'AI / Platform',
    ]);

    await expect(page.locator('[data-tech-chip]')).toHaveCount(Object.keys(CHIP_PROJECTS).length);
    for (const [id, slugs] of Object.entries(CHIP_PROJECTS)) {
      const target = chip(page, id);
      expect(await target.evaluate((element) => element.tagName), id).toBe('BUTTON');
      await expect(target).toHaveAttribute('type', 'button');
      await expect(target).toHaveAttribute('aria-expanded', 'false');
      await expect(target.locator('.tech-chip-count')).toHaveText(String(slugs.length));
      await expect(target.locator('.tech-chip-count')).toHaveCSS('color', 'rgb(103, 113, 130)');
      await expect(target).toHaveAccessibleName(new RegExp(`프로젝트 ${slugs.length}개`));
      await expect(target).toHaveCSS('border-radius', '9999px');
      // 숫자와 목록이 같은 출처에서 나온다
      const panel = await panelOf(page, id);
      await expect(panel).toHaveCount(1);
      await expect(panel).toBeHidden();
      expect(await panel.locator('a').evaluateAll((links) => links.map((link) => link.getAttribute('href')))).toEqual(
        slugs.map((slug) => `/projects/${slug}/`),
      );
    }

    // NEW:LEARN은 React · TypeScript · SEED Design만 센다. 사용 예정인 D3.js는 칩·집계에 없다.
    await expect(page.locator('[data-tech-chip="d3-js"], [data-tech-static="d3-js"]')).toHaveCount(0);
    await expect(page.locator('[data-skill-panel] a[href="/projects/newlearn/"]')).toHaveCount(3);

    for (const id of STATIC_CHIPS) {
      const target = page.locator(`[data-tech-static="${id}"]`);
      await expect(target, id).toHaveCount(1);
      expect(await target.evaluate((element) => element.tagName), id).toBe('SPAN');
      await expect(target.locator('.tech-chip-count')).toHaveCount(0);
    }

    // 누를 수 있는 칩: 흰 바탕 + hairline 테두리 / 정적 칩: 테두리 없는 surface-subtle 면, ink-secondary 글자
    const button = chip(page, 'react');
    await expect(button).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(button).toHaveCSS('border-top-color', COLOR.borderHairline);
    const quiet = page.locator('[data-tech-static="html5"]');
    await expect(quiet).toHaveCSS('background-color', 'rgb(243, 245, 248)');
    await expect(quiet).toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)');
    await expect(quiet).toHaveCSS('color', COLOR.inkSecondary);
  });

  test('누르면 칩 아래에 "사용한 프로젝트" 링크가 열리고, 한 번에 하나만 열리며, 다시 누르거나 Esc로 닫힌다', async ({ page }) => {
    await openHome(page);
    const react = chip(page, 'react');
    await bringIntoView(page, react);
    const reactPanel = await panelOf(page, 'react');

    await react.click();
    await expect(react).toHaveAttribute('aria-expanded', 'true');
    await expect(reactPanel).toBeVisible();
    await expect(reactPanel.locator('.skill-panel-label')).toHaveText('React · 사용한 프로젝트');
    await expect(reactPanel.getByRole('link')).toHaveText(['NEW:LEARN', 'FINCH', 'Boogle', 'MoonSunPower']);
    await expect(react).toHaveCSS('background-color', 'rgb(238, 243, 251)'); // primary-weak
    await expect(react).toHaveCSS('color', 'rgb(51, 87, 158)'); // primary-pressed
    // 목록은 칩 그룹 아래에 놓인다
    const chipsBox = (await page.locator('[data-skill-group="frontend"] .skill-chips').boundingBox())!;
    expect((await reactPanel.boundingBox())!.y).toBeGreaterThanOrEqual(chipsBox.y + chipsBox.height);

    // 다른 칩: 이전 목록은 닫힌다(한 번에 하나)
    const typescript = chip(page, 'typescript');
    await typescript.click();
    await expect(react).toHaveAttribute('aria-expanded', 'false');
    await expect(reactPanel).toBeHidden();
    await expect(typescript).toHaveAttribute('aria-expanded', 'true');
    await expect((await panelOf(page, 'typescript')).getByRole('link')).toHaveCount(6);
    await expect(page.locator('[data-skill-panel].is-open')).toHaveCount(1);

    // 같은 칩을 다시 누르면 닫힌다
    await typescript.click();
    await expect(typescript).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('[data-skill-panel]:visible')).toHaveCount(0);

    // 키보드: Enter로 열고, 목록 안으로 포커스, Esc로 닫으면 포커스가 칩으로 돌아온다
    const figma = chip(page, 'figma');
    await bringIntoView(page, figma);
    await figma.focus();
    await page.keyboard.press('Enter');
    await expect(figma).toHaveAttribute('aria-expanded', 'true');
    const figmaPanel = await panelOf(page, 'figma');
    await expect(figmaPanel.getByRole('link')).toHaveText(['OURWISH', 'Boogle', 'Moa', 'MoonSunPower']);
    await figmaPanel.getByRole('link').first().focus();
    await page.keyboard.press('Escape');
    await expect(figma).toHaveAttribute('aria-expanded', 'false');
    await expect(figmaPanel).toBeHidden();
    await expect(figma).toBeFocused();

    // Space로도 열리고 Esc로 닫힌다
    await page.keyboard.press('Space');
    await expect(figma).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(figma).toHaveAttribute('aria-expanded', 'false');
    await expect(figma).toBeFocused();

    // 목록 링크는 프로젝트 상세로 간다
    await figma.click();
    await expect(figmaPanel.getByRole('link', { name: 'Moa' })).toHaveAttribute('href', '/projects/moa/');
  });

  test('펼친 목록이 레이아웃을 크게 밀지 않고, 다른 행의 칩으로 바꿔도 누른 칩이 제자리에 있다', async ({ page }) => {
    await openHome(page);
    const react = chip(page, 'react');
    const nextGroup = page.locator('[data-skill-group="app"]');
    // 두 행이 모두 리빌을 마친 상태에서 잰다(리빌 이동 16px이 측정에 섞이지 않게)
    await bringIntoView(page, nextGroup);
    await expect(react.locator('xpath=ancestor::*[@data-reveal][1]')).not.toHaveClass(/reveal-pending|is-revealing/);
    await waitForAnimations(page);
    const before = (await nextGroup.boundingBox())!.y;
    const reactTop = (await react.boundingBox())!.y;

    await react.click();
    const pushed = (await nextGroup.boundingBox())!.y - before;
    expect(pushed).toBeGreaterThan(0);
    expect(pushed).toBeLessThanOrEqual(64); // 한 줄 목록 + 간격
    expect(Math.abs((await react.boundingBox())!.y - reactTop)).toBeLessThan(1);

    // 같은 행 안에서 바꾸면 아무것도 움직이지 않는다
    const vue = chip(page, 'vue-js');
    const vueTop = (await vue.boundingBox())!.y;
    await vue.click();
    expect(Math.abs((await vue.boundingBox())!.y - vueTop)).toBeLessThan(1);

    // 아래 행의 칩: 위 목록이 닫혀도 누른 칩은 화면에서 같은 자리에 있다(스크롤 보정)
    const vercel = chip(page, 'vercel');
    await bringIntoView(page, vercel); // 리빌이 끝난(보이는) 칩을 누른다
    const vercelTop = (await vercel.boundingBox())!.y;
    await vercel.click();
    await expect(vercel).toHaveAttribute('aria-expanded', 'true');
    await waitForScrollIdle(page);
    // 보정하지 않으면 위 목록 높이(약 60px)만큼 올라간다. 정수 스크롤 위치 반올림만큼의 오차는 허용한다.
    expect(Math.abs((await vercel.boundingBox())!.y - vercelTop)).toBeLessThanOrEqual(4);
  });
});

// ---------------------------------------------------------------------------
test.describe('Experience · 개발 경험', () => {
  test('요약(설명 · 역할 · 핵심 성과 · 링크)을 기본으로 보이고, 싸피레이스는 수상으로 표시하지 않는다', async ({ page }) => {
    await openHome(page);
    const rows = page.locator('#experience .exp-list > li');
    await expect(rows).toHaveCount(3);
    await expect(rows.locator('.timeline-meta')).toHaveText(['개인 프로젝트', '물류관리 시스템', '자율주행 알고리즘 경진대회']);

    const terms = (index: number) => rows.nth(index).locator('.exp-facts dt');
    await expect(terms(0)).toHaveText(['설명', '핵심 성과', '기술 스택', '링크']); // 원문에 역할이 없다(개인 프로젝트)
    await expect(terms(1)).toHaveText(['설명', '역할', '핵심 성과', '기술 스택', '링크']);
    await expect(terms(2)).toHaveText(['설명', '역할', '핵심 성과', '기술 스택']); // 원문에 링크가 없다
    for (const index of [0, 1, 2]) {
      for (const dd of await rows.nth(index).locator('.exp-facts dd').all()) await expect(dd).toBeVisible();
    }
    await expect(rows.nth(0).getByRole('link')).toHaveText(['Daily Tick 서비스(새 창)', 'Daily Tick GitHub(새 창)']);
    await expect(rows.nth(0).getByRole('link').first()).toHaveAttribute('href', 'https://dailyticknews.vercel.app/');
    await expect(rows.nth(1).getByRole('link')).toHaveAttribute('href', 'https://github.com/xxj15/Database-System');

    // 스택: 구분점이 읽히고(aria-hidden 아님), 기술명 + " ·"가 한 덩어리라 줄 첫머리에 "·"가 오지 않는다
    const stack = rows.nth(0).locator('.exp-stack');
    expect(normalize(await stack.textContent())).toBe(
      'Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Zod · OpenAI Responses API · Supabase PostgreSQL · Vercel Cron',
    );
    await expect(stack.locator('[aria-hidden]')).toHaveCount(0);
    const units = await stack.locator('.nw').allTextContents();
    expect(units.slice(0, -1).every((unit) => unit.endsWith(' ·'))).toBe(true);
    expect(units.every((unit) => !unit.startsWith('·'))).toBe(true);

    const race = rows.nth(2);
    await expect(race.locator('h3')).toHaveText('싸피레이스');
    await expect(race.locator('.award-badge, svg')).toHaveCount(0);
    await expect(race.locator('b, strong')).toHaveCount(0);
  });

  test('DAILY TICK "자세히 보기": primary 텍스트 + 셰브런 16px, 테두리 없는 button이 파이프라인·검증 표를 펼친다', async ({ page }) => {
    await openHome(page);
    const toggle = page.locator('[data-timeline-toggle]');
    await expect(toggle).toHaveCount(1);
    await bringIntoView(page, toggle);

    expect(await toggle.evaluate((element) => element.tagName)).toBe('BUTTON');
    await expect(toggle.locator('[data-toggle-label]')).toHaveText('자세히 보기');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveCSS('color', COLOR.primary);
    await expect(toggle).toHaveCSS('border-top-style', 'none');
    await expect(toggle).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    const chevron = toggle.locator('svg[aria-hidden="true"]');
    await expect(chevron).toHaveCount(1);
    await expect(chevron).toHaveCSS('width', '16px');

    const region = page.locator(`#${await toggle.getAttribute('aria-controls')}`);
    await expect(region).toBeHidden();

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(toggle.locator('[data-toggle-label]')).toHaveText('접기');
    await expect(region).toBeVisible();
    await expect(region.locator('.pipeline-step')).toHaveCount(7);
    await expect(region.locator('.pipeline-name').first()).toHaveText('Vercel Cron');
    await expect(region.locator('table thead th')).toHaveText(['검증 범위', '처리']);
    await expect(region.locator('table tbody th')).toHaveText(['응답 형식', '뉴스 구성', '출처', '신선도', '운영 안정성']);
    await expect(toggle).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle.locator('[data-toggle-label]')).toHaveText('자세히 보기');
    await expect(region).toBeHidden();
  });
});

// ---------------------------------------------------------------------------
test.describe('Activities', () => {
  test('UI/UX Design 작업물(캐치테이블 재구축 포함) → 콘텐츠 기획·제작 → 동아리 활동, 모두 timeline-row', async ({ page }) => {
    await openHome(page);
    const groups = page.locator('#activities .subsection');
    await expect(groups).toHaveCount(3);
    await expect(groups.locator('h3')).toHaveText(['UI/UX Design 작업물', '콘텐츠 기획·제작', '동아리·교육 활동']);

    const uiux = groups.nth(0).locator('.timeline-row');
    await expect(uiux.locator('h4')).toHaveText(['캐치테이블 재구축', 'OURWISH 프로토타입', '아이디어톤 작업물', 'AI Hackathon 프로토타입']);
    await expect(uiux.first().locator('.timeline-meta')).toHaveText('소프트웨어공학 수업');
    await expect(uiux.first().locator('img')).toHaveCount(3);
    for (const image of await page.locator('#activities img').all()) {
      await expect(image).toHaveAttribute('alt', /.+/);
      await expect(image).toHaveAttribute('loading', 'lazy');
    }
    await expect(groups.nth(0).getByRole('link', { name: 'OURWISH 프로젝트 보기' })).toHaveAttribute('href', '/projects/ourwish/');

    await expect(groups.nth(1).locator('.timeline-meta')).toHaveText(['2026.02 – 현재', '2021.09 – 2021.12']);
    await expect(groups.nth(1).locator('h4')).toHaveText(['SSAFYcial 15기', '서강투데이']);
    // 동아리·교육 활동: 최신순(사용자 제공 기간)
    await expect(groups.nth(2).locator('h4')).toHaveText([
      '기초인공지능프로그래밍 조교',
      'Mash UP 15기',
      '멋쟁이사자처럼 9기 운영진 · 교육팀',
      '멋쟁이사자처럼 8기',
    ]);
    await expect(groups.nth(2).locator('.timeline-meta')).toHaveText([
      '2025.09 – 2025.12',
      '2025.03 – 2025.08',
      '2021.03 – 2022.02',
      '2020.03 – 2021.02',
    ]);
    const clubRows = groups.nth(2).locator('.timeline-row');
    // 조교: 서강대학교 · Python 교과목 조교
    await expect(clubRows.nth(0).locator('.act-subtitle')).toHaveText('서강대학교');
    await expect(clubRows.nth(0).locator('.act-description')).toHaveText('Python 교과목의 조교로 활동했습니다.');
    await expect(clubRows.nth(0).getByRole('link')).toHaveCount(0);
    // Mash UP 15기: 활동 2개 · 성과 · 내부 링크 1 + 외부 링크 2(새 탭 ↗ "(새 창)")
    const mashup = clubRows.nth(1);
    await expect(mashup.locator('.bullets li')).toHaveText([
      '프론트엔드 기술 세션·세미나 진행',
      'PR 기반 AI 회고 서비스 DevOops 기획·프론트엔드 개발',
    ]);
    await expect(mashup.locator('.act-fact dt')).toHaveText(['성과']);
    await expect(mashup.locator('.act-fact dd')).toHaveText(['Mash UP 동아리 내 프로젝트 평가 1위']);
    await expect(mashup.getByRole('link', { name: 'DevOops 프로젝트 보기' })).toHaveAttribute('href', '/projects/devoops/');
    await expect(mashup.getByRole('link', { name: 'DevOops 프로젝트 보기' })).not.toHaveAttribute('target', /.*/);
    const mashupExternal = mashup.locator('a[target="_blank"]');
    await expect(mashupExternal).toHaveText(['Next.js 스터디 GitHub(새 창)', 'DevOops GitHub(새 창)']);
    expect(await mashupExternal.evaluateAll((links) => links.map((link) => link.getAttribute('href')))).toEqual([
      'https://github.com/mash-up-kr/web-nextjs-study',
      'https://github.com/mash-up-kr/devoops-web',
    ]);
    // DevOops 프로젝트 자체 기간(PDF 상세)은 그대로다
    await expect(card(page, 'devoops').locator('.card-period')).toHaveText('2025.04 – 2025.10');

    // 행 사이 hairline, 날짜는 caption · ink-tertiary
    const row = groups.nth(1).locator('.timeline-row').first();
    await expect(row).toHaveCSS('border-top-color', COLOR.borderHairline);
    await expect(row.locator('.timeline-meta')).toHaveCSS('font-size', '14px');
    await expect(row.locator('.timeline-meta')).toHaveCSS('color', 'rgb(103, 113, 130)');
  });
});

// ---------------------------------------------------------------------------
test.describe('About & Contact', () => {
  test('프로필 사진(rounded.lg) · 학력·교육·어학 · Awards 전체(싸피레이스 제외) · 흰 바탕 연락처 블록', async ({ page }) => {
    await openHome(page);
    const about = page.locator('#about');

    const photo = about.locator('img');
    await expect(photo).toHaveCount(1);
    await expect(photo).toHaveAttribute('alt', '안서진 프로필 사진');
    await bringIntoView(page, photo);
    await expect(photo).toHaveCSS('border-radius', '20px');
    await expect.poll(() => photo.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);

    // 소개: 첫 문장만 600 · ink-primary, 나머지는 보통 굵기 본문
    const bio = about.locator('.about-bio');
    await expect(bio).toHaveText(
      '컴퓨터공학 지식에 디자인 감각과 인문학적 시선을 더해, 사용자의 문제를 발견하고 해결하는 서비스를 만듭니다. 사용자 관점에서 흐름을 설계하고, 기획부터 UI/UX 디자인, 개발까지 직접 연결하며 아이디어를 실제 서비스로 완성하는 데 강점이 있습니다.',
    );
    await expect(bio.locator('b')).toHaveText('컴퓨터공학 지식에 디자인 감각과 인문학적 시선을 더해, 사용자의 문제를 발견하고 해결하는 서비스를 만듭니다.');
    await expect(bio.locator('b')).toHaveCSS('font-weight', '600');
    await expect(bio.locator('b')).toHaveCSS('color', 'rgb(28, 35, 51)');
    await expect(bio).toHaveCSS('font-weight', '400');

    await expect(about.locator('.edu-row dt')).toHaveText(['학력', '교육', '어학']);
    await expect(about.locator('.edu-row dd').nth(0)).toHaveText('서강대학교 유럽문화(독일어 심화) / 컴퓨터공학');
    await expect(about.locator('.edu-row dd').nth(1)).toHaveText('삼성 청년 SW·AI 아카데미 (SSAFY)');
    // 점수와 날짜 사이에 실제 공백이 있어 스크린리더·복사에서 붙어 읽히지 않는다
    expect((await about.locator('.edu-row').nth(2).locator('li').allTextContents()).map(normalize)).toEqual([
      'OPIc 영어 말하기 IH 2025.07',
      'Goethe-Zertifikat 독일어 B1 2025.12',
      'DELF 프랑스어 A2 2025.05',
    ]);

    const awards = about.locator('.award-list > li');
    await expect(awards.locator('.timeline-meta')).toHaveText(AWARDS.map((award) => award.date));
    await expect(awards.locator('.award-name')).toHaveText(AWARDS.map((award) => award.name));
    await expect(about.locator('.award-list')).not.toContainText('싸피레이스');
    await expect(about.locator('.award-list')).not.toContainText('Mash UP');
    await expect(awards.nth(0).getByRole('link')).toHaveAttribute('href', '/projects/banggoot/');
    await expect(awards.nth(1).getByRole('link')).toHaveAttribute('href', '/projects/ourwish/');
    // UNTACT 3위 → 서강투데이 인스타그램(새 탭 ↗, "(새 창)"), 다른 수상 링크와 같은 모양
    const untact = awards.nth(4).getByRole('link');
    await expect(untact).toHaveAttribute('href', 'https://www.instagram.com/sogangtoday/');
    await expect(untact).toHaveAttribute('target', '_blank');
    await expect(untact).toHaveAttribute('rel', /noopener/);
    await expect(untact).toHaveText('서강투데이(새 창)');
    await expect(untact.locator('svg[aria-hidden="true"]')).toHaveCount(1);
    await expect(untact).toHaveClass(/award-project/);
    await expect(awards.nth(5).getByRole('link')).toHaveCount(0); // 책화점은 이름만
    // 수상명·제목은 줄 끝 한두 글자 꼬리를 피한다(text-wrap: balance)
    for (const target of [awards.locator('.award-name').first(), about.locator('h3').first(), about.locator('h2')]) {
      expect(await target.evaluate((element) => getComputedStyle(element).getPropertyValue('text-wrap-style'))).toBe('balance');
    }

    // 연락처 블록: 사이트의 유일한 연락처(contact-band 제거), 흰 바탕
    const block = about.locator('.about-contact');
    await expect(block).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(block.locator('a[href^="mailto:"]')).toHaveText(EMAIL);
    await expect(block.locator('a[href^="mailto:"]')).toHaveCSS('font-size', '16px');
    await expect(block.locator('a[href^="tel:"]')).toHaveText('010-5465-2165');
    await expect(block.getByRole('button')).toHaveCount(0); // 이메일 복사 버튼 없음(사용자 결정)
    await expect(block.getByRole('link', { name: '포트폴리오 PDF 받기' })).toHaveAttribute('download', 'anseojin-portfolio.pdf');
    await expect(block.locator('a[target="_blank"]')).toHaveText(['github.com/xxj15(새 창)', 'velog.io/@xxj15/posts(새 창)', 'seojin-blog.vercel.app(새 창)']);
    await expect(block.locator('a[target="_blank"]').last()).toHaveAttribute('href', 'https://seojin-blog.vercel.app/');
    await expect(block.locator('a[target="_blank"]').first()).toHaveAttribute('href', 'https://github.com/xxj15');
  });
});
