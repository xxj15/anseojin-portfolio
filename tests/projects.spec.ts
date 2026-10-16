import { expect, test, type Locator, type Page } from '@playwright/test';

/*
  프로젝트 상세(/projects/<slug>) 8개와 Not found 검증.
  기준: EXPERIENCE.md Component Patterns(Button · Case block · Project pager · Focus ring), State Patterns(JS 미실행 · 없는 slug ·
  짧은 상세), Accessibility Floor, Responsive & Platform. 빌드 결과물을 서버에 띄워 검증한다.
  Not found는 /404.html로 직접 연다(없는 경로를 404.html로 돌려주는 일은 호스팅이 맡는다).
*/

const PROJECTS = [
  { slug: 'newlearn', name: 'NEW:LEARN', period: '2026.10 – 2026.11', badge: { kind: 'status', text: '진행 중' } },
  { slug: 'finch', name: 'FINCH', period: '2026.08 – 2026.09' },
  { slug: 'banggoot', name: '방긋', period: '2026.07 – 2026.08', badge: { kind: 'award', text: 'SSAFY 2학기 공통 프로젝트 우수상 (1위)' } },
  { slug: 'ourwish', name: 'OURWISH', period: '2026.05 – 2026.06', badge: { kind: 'award', text: 'SSAFY 1학기 관통 프로젝트 최우수상 (1위)' } },
  { slug: 'boogle', name: 'Boogle', period: '2026.01 – 2026.07' },
  { slug: 'moa', name: 'Moa', period: '2025.09 – 2025.11' },
  { slug: 'devoops', name: 'DevOops', period: '2025.04 – 2025.10', badge: { kind: 'award', text: 'Mash UP 동아리 내 프로젝트 1위' } },
  { slug: 'msp', name: 'MoonSunPower', period: '2024.09 – 2025.09', badge: { kind: 'award', text: '서강 융합기술 경진대회 특별상 (AI/SW상, 인기상)' } },
] as const;

/** 상세 헤더 버튼(원문에 링크가 있는 것만, 첫 번째가 primary) */
const HEADER_BUTTONS: Record<(typeof PROJECTS)[number]['slug'], readonly string[]> = {
  newlearn: ['프로토타입 보기'],
  finch: ['서비스 바로가기', 'GitHub'],
  banggoot: ['서비스 바로가기', '소개 영상 보기'],
  ourwish: ['서비스 바로가기', 'GitHub'],
  boogle: ['서비스 바로가기', 'GitHub'],
  moa: ['GitHub'],
  devoops: ['GitHub'],
  msp: ['GitHub', '인스타그램'],
};

const METRICS: Partial<Record<(typeof PROJECTS)[number]['slug'], { value: string; unit: string; label: string }>> = {
  finch: { value: '20', unit: '개', label: '화면 프로토타입' },
  banggoot: { value: '21', unit: '종', label: '공용 컴포넌트 구현(37종 중)' },
  ourwish: { value: '588', unit: '개', label: 'FE·BE 조건 조합 대조' },
  msp: { value: '9,400', unit: '회', label: '월 조회수(2025.03)' },
};

const COLOR = {
  primary: 'rgb(64, 106, 191)',
  inkPrimary: 'rgb(28, 35, 51)',
  borderHairline: 'rgb(228, 232, 238)',
  borderStrong: 'rgb(206, 213, 223)',
};
const NAV_HEIGHT = 64;
const PROTOTYPE_PATH = '/prototypes/newlearn-v15.html';

const normalize = (text: string | null) => (text ?? '').replace(/\s+/g, ' ').trim();
const detailPath = (slug: string) => `/projects/${slug}/`;

/** 링크의 보이는 글자(스크린리더 전용 텍스트 제외) */
const visibleLabel = (link: Locator) =>
  link.evaluate((element) => {
    const clone = element.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.sr-only').forEach((node) => node.remove());
    return (clone.textContent ?? '').replace(/\s+/g, ' ').trim();
  });

/** pager 칸의 caption과 이름 */
const pagerText = async (link: Locator) => [
  normalize(await link.locator('.pager-caption').textContent()),
  normalize(await link.locator('.pager-name').textContent()),
];

async function openPage(page: Page, path: string) {
  await page.goto(path);
  await page.evaluate(() => document.fonts.ready);
}

/** 리빌을 모두 끝낸 상태로 만든다(스크롤 리빌은 별도 테스트 대상이 아님). */
async function revealAll(page: Page) {
  await page.evaluate(() =>
    document.querySelectorAll('.reveal-pending, .is-revealing').forEach((element) => {
      element.classList.remove('reveal-pending', 'is-revealing');
    }),
  );
}

test.describe('상세 페이지 8개', () => {
  for (const [index, project] of PROJECTS.entries()) {
    test(`${project.slug}: h1 = 프로젝트명, 고유 title·description, 기간·배지가 카드 데이터와 같다`, async ({ page }) => {
      await openPage(page, detailPath(project.slug));

      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);
      await expect(h1).toHaveText(project.name);
      await expect(page).toHaveTitle(new RegExp(`^${project.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} — \\S`));
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description?.length ?? 0).toBeGreaterThan(20);

      await expect(page.locator('.detail-period')).toHaveText(project.period);
      await expect(page.locator('main [data-section-label], main .section-label').first()).toContainText(
        `PROJECT ${String(index + 1).padStart(2, '0')}`,
      );

      const status = page.locator('.detail-head [data-status-pill]');
      const award = page.locator('.detail-head [data-award-badge]');
      if (!('badge' in project)) {
        await expect(status).toHaveCount(0);
        await expect(award).toHaveCount(0);
      } else if (project.badge.kind === 'status') {
        await expect(status).toHaveText(project.badge.text);
        await expect(status.locator('svg')).toHaveCount(0);
        await expect(award).toHaveCount(0);
      } else {
        await expect(award).toHaveText(project.badge.text);
        await expect(status).toHaveCount(0);
      }

      const metric = METRICS[project.slug];
      const stat = page.locator('.detail-head [data-countup]');
      if (metric) {
        await expect(stat.locator('[data-countup-final]')).toHaveText(metric.value);
        await expect(stat.locator('.metric-unit')).toHaveText(metric.unit);
        await expect(stat.locator('.metric-label')).toHaveText(metric.label);
      } else {
        await expect(stat).toHaveCount(0);
      }

      // 랜드마크·개요: main 안에 article, h2 섹션 제목, 상세 하단 pager
      await expect(page.locator('main article[data-progress-root]')).toHaveCount(1);
      await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
      await expect(page.locator('nav[aria-label="프로젝트 이동"]')).toHaveCount(1);
    });
  }

  test('NEW:LEARN: 아직 쓰지 않은 기술은 "사용 예정"으로 따로 보인다', async ({ page }) => {
    await openPage(page, detailPath('newlearn'));
    const used = normalize(await page.locator('[data-stack="used"]').textContent());
    const planned = normalize(await page.locator('[data-stack="planned"]').textContent());
    expect(used).toBe('React · TypeScript · SEED Design');
    for (const tech of ['Vite', 'TailwindCSS', 'D3.js', 'TanStack Query', 'Zustand', 'Axios', 'React Router']) {
      expect(planned).toContain(tech);
      expect(used).not.toContain(tech);
    }
    // 진행 단계 4개: 서비스 소개 → PRD → 디자인 시스템 → 프로토타입
    await expect(page.locator('section[data-case] h2')).toHaveText([
      '서비스 소개',
      'BMAD로 PRD 작성',
      'SEED Design 기반 디자인 시스템',
      '프로토타입',
    ]);
  });

  test('Moa: 요약과 트러블슈팅만 있는 짧은 상세(케이스 블록 없음)', async ({ page }) => {
    await openPage(page, detailPath('moa'));
    await expect(page.locator('[data-highlights] h2')).toHaveText('트러블슈팅');
    await expect(page.locator('[data-highlights] li')).toHaveCount(2);
    await expect(page.locator('[data-case]')).toHaveCount(0);
    await expect(page.locator('[data-case-block]')).toHaveCount(0);
  });
});

test.describe('project-pager', () => {
  for (const [index, project] of PROJECTS.entries()) {
    test(`${project.slug}: 최신순 이전/다음, 순환하지 않고 끝에서는 "전체 프로젝트"(→ 홈의 이 프로젝트 카드)`, async ({ page }) => {
      await openPage(page, detailPath(project.slug));
      const prev = page.locator('[data-pager="prev"]');
      const next = page.locator('[data-pager="next"]');
      await expect(prev).toHaveCount(1);
      await expect(next).toHaveCount(1);

      const before = PROJECTS[index - 1];
      const after = PROJECTS[index + 1];

      if (before) {
        await expect(prev).toHaveAttribute('data-pager-kind', 'project');
        expect(new URL((await prev.getAttribute('href')) ?? '', 'http://x').pathname).toBe(detailPath(before.slug));
        expect(await pagerText(prev)).toEqual(['이전 프로젝트', before.name]);
      } else {
        await expect(prev).toHaveAttribute('data-pager-kind', 'all');
        // 홈 Projects의 이 프로젝트 카드(li#project-<slug>)로 돌아간다
        expect(await prev.getAttribute('href')).toMatch(new RegExp(`/#project-${project.slug}$`));
        expect(await pagerText(prev)).toEqual([`${PROJECTS.length}개 프로젝트`, '전체 프로젝트']);
      }

      if (after) {
        await expect(next).toHaveAttribute('data-pager-kind', 'project');
        expect(new URL((await next.getAttribute('href')) ?? '', 'http://x').pathname).toBe(detailPath(after.slug));
        expect(await pagerText(next)).toEqual(['다음 프로젝트', after.name]);
      } else {
        await expect(next).toHaveAttribute('data-pager-kind', 'all');
        expect(await next.getAttribute('href')).toMatch(new RegExp(`/#project-${project.slug}$`));
        expect(await pagerText(next)).toEqual([`${PROJECTS.length}개 프로젝트`, '전체 프로젝트']);
      }
    });
  }

  test('pager 링크를 따라가면 실제 상세 페이지가 열린다', async ({ page }) => {
    await openPage(page, detailPath('ourwish'));
    await page.locator('[data-pager="next"]').click();
    await expect(page.locator('h1')).toHaveText('Boogle');
    await page.locator('[data-pager="prev"]').click();
    await expect(page.locator('h1')).toHaveText('OURWISH');
  });

  test('hover 가능한 기기: hover와 focus-visible에서 border-strong + 그림자, 이동 없음', async ({ page }) => {
    await openPage(page, detailPath('ourwish'));
    await revealAll(page);
    const next = page.locator('[data-pager="next"]');
    await next.scrollIntoViewIfNeeded();
    const restBox = await next.boundingBox();
    await expect(next).toHaveCSS('border-top-color', COLOR.borderHairline);

    await next.hover();
    await expect(next).toHaveCSS('border-top-color', COLOR.borderStrong);
    await expect.poll(() => next.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe('none');
    const hoverBox = await next.boundingBox();
    expect(hoverBox?.y).toBeCloseTo(restBox?.y ?? 0, 0);
    expect(await next.evaluate((element) => getComputedStyle(element).transform)).toBe('none');

    await page.mouse.move(0, 0);
    await page.locator('[data-pager="prev"]').focus();
    await page.keyboard.press('Tab');
    await expect(next).toBeFocused();
    await expect(next).toHaveCSS('border-top-color', COLOR.borderStrong);
  });
});

test.describe('버튼과 외부 링크', () => {
  for (const project of PROJECTS) {
    test(`${project.slug}: 원문 링크가 있는 버튼만, 첫 번째만 primary, 새 탭 + ↗ + "(새 창)"`, async ({ page }) => {
      await openPage(page, detailPath(project.slug));

      const buttons = page.locator('.detail-actions .btn');
      const expected = HEADER_BUTTONS[project.slug];
      await expect(buttons).toHaveCount(expected.length);
      for (const [i, label] of expected.entries()) {
        const button = buttons.nth(i);
        expect(await visibleLabel(button)).toBe(label);
        await expect(button.locator('.sr-only')).toHaveText('(새 창)');
        await expect(button).toHaveClass(i === 0 ? /btn-primary/ : /btn-secondary/);
      }
      // primary는 페이지당 1개(포커스 때만 보이는 "본문으로 건너뛰기" 제외)
      await expect(page.locator('main .btn-primary')).toHaveCount(1);

      // 링크 없는 버튼·비활성 버튼은 없다
      for (const button of await page.locator('main .btn').all()) {
        const tag = await button.evaluate((element) => element.tagName);
        expect(tag).toBe('A');
        const href = (await button.getAttribute('href')) ?? '';
        expect(href.trim()).not.toBe('');
        expect(href).not.toBe('#');
        expect(await button.getAttribute('aria-disabled')).toBeNull();
      }

      // main 안의 새 탭 링크는 모두 rel noopener + ↗ 아이콘 + 스크린리더용 "(새 창)"
      const external = page.locator('main a[target="_blank"]');
      expect(await external.count()).toBeGreaterThan(0);
      for (const link of await external.all()) {
        expect(await link.getAttribute('rel')).toContain('noopener');
        await expect(link.locator('svg[aria-hidden="true"]')).toHaveCount(1);
        await expect(link.locator('.sr-only')).toHaveText('(새 창)');
      }
      // 외부 URL로 가는 링크는 모두 새 탭
      for (const link of await page.locator('main a[href^="http"]').all()) {
        await expect(link).toHaveAttribute('target', '_blank');
      }
    });
  }

  test('NEW:LEARN "프로토타입 보기"는 사이트에 함께 올린 프로토타입(200)을 새 탭으로 연다', async ({ page, request, context }) => {
    await openPage(page, detailPath('newlearn'));
    const links = page.locator('a[data-detail-link="asset"]');
    expect(await links.count()).toBeGreaterThanOrEqual(1);
    for (const link of await links.all()) {
      expect(new URL((await link.getAttribute('href')) ?? '', 'http://x').pathname).toBe(PROTOTYPE_PATH);
      await expect(link).toHaveAttribute('target', '_blank');
    }

    const href = (await links.first().getAttribute('href')) ?? '';
    const response = await request.get(href);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
    expect((await response.body()).byteLength).toBeGreaterThan(1_000_000);

    const [popup] = await Promise.all([context.waitForEvent('page'), links.first().click()]);
    // 약 6MB 단일 HTML이라 다 그릴 때까지 기다리지 않고, 새 탭이 그 주소로 열렸는지만 본다
    await popup.waitForURL((url) => url.pathname === PROTOTYPE_PATH, { waitUntil: 'commit' });
    await popup.close();
  });
});

test.describe('case-block', () => {
  for (const project of PROJECTS) {
    test(`${project.slug}: RESULT가 있으면 마지막 블록이고 ink-primary 600으로 강조한다`, async ({ page }) => {
      await openPage(page, detailPath(project.slug));
      for (const section of await page.locator('section[data-case]').all()) {
        const labels = await section
          .locator('[data-case-block]')
          .evaluateAll((blocks) => blocks.map((block) => block.getAttribute('data-block-label') ?? ''));
        expect(labels.length).toBeGreaterThan(0);
        if (labels.includes('RESULT')) {
          expect(labels.indexOf('RESULT')).toBe(labels.length - 1);
          const result = section.locator('[data-case-block][data-block-label="RESULT"] [data-block-text]').first();
          await expect(result).toHaveCSS('font-weight', '600');
          await expect(result).toHaveCSS('color', COLOR.inkPrimary);
        }
        await expect(section.locator('h2')).toHaveCount(1);
      }
      // 블록 라벨은 primary
      const label = page.locator('.block-label').first();
      if ((await label.count()) > 0) await expect(label).toHaveCSS('color', COLOR.primary);
      // 모든 그림에 alt가 있다
      for (const image of await page.locator('main img').all()) {
        expect(((await image.getAttribute('alt')) ?? '').trim().length).toBeGreaterThan(0);
      }
    });
  }

  test('OURWISH 다이어그램: 블록 폭에 맞추고 alt에 흐름 요약을 넣는다', async ({ page }) => {
    await openPage(page, detailPath('ourwish'));
    const diagram = page.locator('img[alt="후보 상품 필터링 → 우대조건 판별 → 세후 수령액 계산 → 추천 결과 생성"]');
    await expect(diagram).toHaveCount(1);
    const frame = page.locator('.diagram-frame', { has: diagram });
    const [imageWidth, frameWidth] = await Promise.all([
      diagram.evaluate((element) => element.getBoundingClientRect().width),
      frame.evaluate((element) => element.clientWidth - parseFloat(getComputedStyle(element).paddingLeft) * 2),
    ]);
    expect(Math.abs(imageWidth - frameWidth)).toBeLessThan(2);
    // 데스크톱에서는 가로로 넘기지 않고 안내도 없다
    await expect(page.locator('[data-scroll-hint]').first()).toBeHidden();
    for (const scroller of await page.locator('[data-diagram-scroller]').all()) {
      const [scrollWidth, clientWidth] = await scroller.evaluate((element) => [element.scrollWidth, element.clientWidth]);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    }
  });
});

test.describe('section-progress', () => {
  test('상세에서는 article을 기준으로 잰다(article 끝이 화면 아래에 닿으면 가득)', async ({ page }) => {
    await openPage(page, detailPath('ourwish'));
    const scale = () =>
      page.evaluate(() => {
        const transform = getComputedStyle(document.querySelector('[data-section-progress]') as Element).transform;
        return transform === 'none' ? 0 : new DOMMatrix(transform).a;
      });
    expect(await scale()).toBeLessThan(0.02);

    // article 아래쪽이 화면 아래에 오도록(문서는 pager와 아래 여백만큼 더 남아 있음)
    await page.evaluate(() => {
      const article = document.querySelector('[data-progress-root]') as HTMLElement;
      const bottom = article.getBoundingClientRect().bottom + window.scrollY;
      window.scrollTo({ top: bottom - window.innerHeight, behavior: 'instant' });
    });
    await expect.poll(scale).toBeGreaterThan(0.99);
    const remaining = await page.evaluate(
      () => document.documentElement.scrollHeight - window.innerHeight - window.scrollY,
    );
    expect(remaining).toBeGreaterThan(100);

    // 중간쯤이면 중간
    await page.evaluate(() => {
      const article = document.querySelector('[data-progress-root]') as HTMLElement;
      const top = article.getBoundingClientRect().top + window.scrollY;
      const readable = article.offsetHeight - (window.innerHeight - 64);
      window.scrollTo({ top: top - 64 + readable / 2, behavior: 'instant' });
    });
    await expect.poll(scale).toBeLessThan(0.6);
    expect(await scale()).toBeGreaterThan(0.4);
  });
});

test.describe('키보드', () => {
  test('Tab으로 헤더 버튼과 pager에 가면 2px primary 포커스 링이 내비에 가리지 않고 보인다', async ({ page }) => {
    await openPage(page, detailPath('ourwish'));
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();

    const targets = ['.detail-actions .btn-primary', '[data-pager="next"]'];
    for (const selector of targets) {
      const target = page.locator(selector);
      let reached = false;
      for (let i = 0; i < 80 && !reached; i += 1) {
        await page.keyboard.press('Tab');
        reached = await target.evaluate((element) => element === document.activeElement);
      }
      expect(reached).toBe(true);
      await expect(target).toHaveCSS('outline-style', 'solid');
      await expect(target).toHaveCSS('outline-width', '2px');
      await expect(target).toHaveCSS('outline-color', COLOR.primary);
      await expect(target).toHaveCSS('outline-offset', '2px');
      await page.waitForTimeout(700); // 부드러운 스크롤·리빌이 끝난 뒤
      const top = await target.evaluate((element) => element.getBoundingClientRect().top);
      expect(top).toBeGreaterThanOrEqual(NAV_HEIGHT);
    }
  });
});

test.describe('좁은 화면', () => {
  for (const width of [375, 320]) {
    test.describe(`${width}px`, () => {
      test.use({ viewport: { width, height: 800 } });

      test('상세 8개와 Not found에 가로 스크롤이 없고 프로젝트명은 display-mobile이다', async ({ page }) => {
        for (const project of PROJECTS) {
          await openPage(page, detailPath(project.slug));
          await revealAll(page);
          const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
          expect(overflow, project.slug).toBeLessThanOrEqual(0);
          await expect(page.locator('h1')).toHaveCSS('font-size', '34px');
        }
        await openPage(page, '/404.html');
        expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
      });

      test('다이어그램은 읽히는 폭(최소 640px 또는 원본 폭)을 지키고 그림 영역만 가로로 넘긴다(키보드 가능)', async ({ page }) => {
        for (const slug of ['ourwish', 'newlearn']) {
          await openPage(page, detailPath(slug));
          await revealAll(page);
          const scrollers = page.locator('[data-diagram-scroller]');
          expect(await scrollers.count()).toBeGreaterThan(0);
          for (const scroller of await scrollers.all()) {
            await expect(scroller).toHaveAttribute('tabindex', '0');
            await expect(scroller).toHaveAttribute('role', 'region');
            expect(((await scroller.getAttribute('aria-label')) ?? '').trim().length).toBeGreaterThan(0);
            const image = scroller.locator('img');
            const [rendered, natural] = await image.evaluate((element) => [
              element.getBoundingClientRect().width,
              Number(element.getAttribute('width')),
            ]);
            expect(rendered).toBeGreaterThanOrEqual(Math.min(640, natural) - 1);
            const [scrollWidth, clientWidth] = await scroller.evaluate((element) => [element.scrollWidth, element.clientWidth]);
            expect(scrollWidth).toBeGreaterThan(clientWidth);
            // 키보드로 넘길 수 있다
            await scroller.focus();
            await page.keyboard.press('ArrowRight');
            await expect.poll(() => scroller.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
          }
          await expect(page.locator('[data-scroll-hint]').first()).toBeVisible();
          await expect(page.locator('[data-scroll-hint]').first()).toHaveText('옆으로 밀어 보기');
          expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), slug).toBeLessThanOrEqual(0);
        }
      });

      test('헤더 버튼은 개수와 상관없이 모두 전폭으로 세로로 쌓인다', async ({ page }) => {
        for (const project of PROJECTS) {
          await openPage(page, detailPath(project.slug));
          const actions = page.locator('.detail-actions');
          const actionsBox = await actions.boundingBox();
          let previousBottom = -Infinity;
          for (const button of await actions.locator('.btn').all()) {
            const box = await button.boundingBox();
            expect(Math.abs((box?.width ?? 0) - (actionsBox?.width ?? 0)), project.slug).toBeLessThan(1);
            expect(box?.y ?? 0, project.slug).toBeGreaterThan(previousBottom - 1);
            previousBottom = (box?.y ?? 0) + (box?.height ?? 0);
          }
        }
      });
    });
  }
});

test.describe('JS 꺼짐', () => {
  test.use({ javaScriptEnabled: false });

  test('모든 콘텐츠가 보이고 metric은 최종값, pager는 일반 링크다', async ({ page }) => {
    for (const project of PROJECTS) {
      await page.goto(detailPath(project.slug));
      await expect(page.locator('h1')).toHaveText(project.name);
      const hidden = await page
        .locator('[data-reveal], [data-case-block], [data-highlights]')
        .evaluateAll((elements) => elements.filter((element) => getComputedStyle(element).opacity !== '1').length);
      expect(hidden, project.slug).toBe(0);
      const metric = METRICS[project.slug];
      if (metric) await expect(page.locator('.detail-head [data-countup-final]')).toHaveText(metric.value);
      await expect(page.locator('[data-pager="next"]')).toBeVisible();
    }
    await page.goto(detailPath('ourwish'));
    await page.locator('[data-pager="next"]').click();
    await expect(page.locator('h1')).toHaveText('Boogle');
  });
});

test.describe('Not found', () => {
  test('"찾는 프로젝트가 없어요." + "전체 프로젝트 보기"(→ /#projects), 내비 유지, contact-band 없이 아래 여백으로 끝남', async ({
    page,
  }) => {
    await openPage(page, '/404.html');
    await expect(page.locator('h1')).toHaveText('찾는 프로젝트가 없어요.');
    const action = page.locator('[data-not-found-action]');
    await expect(action).toHaveText('전체 프로젝트 보기');
    expect(await action.getAttribute('href')).toMatch(/\/#projects$/);
    await expect(action).toHaveClass(/btn-primary/);
    await expect(page.locator('header nav')).toHaveCount(1);
    await expect(page.locator('footer, .contact-band')).toHaveCount(0);
    await expect(page.locator('.not-found')).toHaveCSS('padding-bottom', '160px');
    expect(normalize(await page.locator('main').textContent())).not.toMatch(/404|Not Found/i);
    await expect(page).toHaveTitle(/찾는 프로젝트가 없어요/);
  });
});
