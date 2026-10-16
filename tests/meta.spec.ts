import { expect, test, type Page } from '@playwright/test';

/*
  공유 미리보기 · 탭 아이콘 · 레거시 해시 리다이렉트 검증 (BaseLayout.astro).
  - 미리보기의 절대 URL은 astro.config.mjs의 site(배포 도메인)를 가리키므로, 파일 응답은 경로만 떼어 테스트 서버에 요청한다.
  - 상세 페이지가 아직 없는 빌드에서도 돌도록 리다이렉트는 주소 변화만 확인한다.
*/

const NAV_HEIGHT = 64;

const meta = (page: Page, selector: string) => page.locator(selector).first().getAttribute('content');

/** 스크롤(부드러운 스크롤 포함)이 멈출 때까지 기다린다. */
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

/** 테스트 서버 기준 홈 주소(base 포함). baseURL에 경로가 없으면 '/'. */
function homeUrl(baseURL: string | undefined): string {
  const url = new URL(baseURL ?? 'http://127.0.0.1');
  if (!url.pathname.endsWith('/')) url.pathname += '/';
  return url.href;
}

/** 절대 URL에서 경로만 떼어 테스트 서버 주소로 바꾼다. */
const onTestServer = (absolute: string, baseURL: string | undefined) =>
  new URL(new URL(absolute).pathname, homeUrl(baseURL)).href;

function pngSize(body: Buffer) {
  expect(body.subarray(1, 4).toString('latin1')).toBe('PNG');
  return { width: body.readUInt32BE(16), height: body.readUInt32BE(20) };
}

/** 레거시 주소로 들어간다. head에서 바로 주소를 바꾸므로 응답 커밋까지만 기다리고, 결과 주소는 호출한 쪽이 기다린다. */
async function gotoLegacy(page: Page, hash: string) {
  await page.goto(`./${hash}`, { waitUntil: 'commit' });
}

// ---------------------------------------------------------------------------
test.describe('공유 미리보기(홈)', () => {
  test('canonical · Open Graph · Twitter 카드 · theme-color가 있고 URL은 절대 주소다', async ({ page }) => {
    await page.goto('./');

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toMatch(/^https:\/\//);
    // 배포 도메인 기준이지만 경로는 지금 페이지(base 포함)와 같다
    expect(new URL(canonical!).pathname).toBe(new URL(page.url()).pathname);

    expect(await meta(page, 'meta[property="og:type"]')).toBe('website');
    expect(await meta(page, 'meta[property="og:site_name"]')).toBe('안서진 포트폴리오');
    expect(await meta(page, 'meta[property="og:locale"]')).toBe('ko_KR');
    // 홈 미리보기는 제목 한 줄만(사용자 결정): og:title은 저장소 이름, 설명 태그는 없다
    expect(await meta(page, 'meta[property="og:title"]')).toBe('anseojin-portfolio');
    await expect(page.locator('meta[property="og:description"], meta[name="description"]')).toHaveCount(0);
    expect(await meta(page, 'meta[property="og:url"]')).toBe(canonical);

    const ogImage = await meta(page, 'meta[property="og:image"]');
    expect(ogImage).toMatch(/^https:\/\/.+\/og\/default\.png$/);
    expect(new URL(ogImage!).origin).toBe(new URL(canonical!).origin);
    expect(await meta(page, 'meta[property="og:image:width"]')).toBe('1200');
    expect(await meta(page, 'meta[property="og:image:height"]')).toBe('630');
    expect((await meta(page, 'meta[property="og:image:alt"]'))?.length).toBeGreaterThan(10);

    expect(await meta(page, 'meta[name="twitter:card"]')).toBe('summary_large_image');
    expect(await meta(page, 'meta[name="theme-color"]')).toMatch(/^#[0-9a-f]{6}$/i);
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
  });

  test('OG 이미지는 200으로 응답하는 1200×630 PNG다', async ({ page, request, baseURL }) => {
    await page.goto('./');
    const ogImage = await meta(page, 'meta[property="og:image"]');
    const response = await request.get(onTestServer(ogImage!, baseURL));
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
    expect(pngSize(await response.body())).toEqual({ width: 1200, height: 630 });
  });

  test('파비콘·apple-touch-icon 링크가 모두 열리고 이미지로 디코딩된다', async ({ page, request }) => {
    const failed: string[] = [];
    page.on('response', (response) => {
      if (/favicon|apple-touch-icon/.test(response.url()) && response.status() >= 400) failed.push(response.url());
    });
    await page.goto('./');

    const icons = page.locator('link[rel~="icon"], link[rel="apple-touch-icon"]');
    await expect(icons).toHaveCount(3);
    const hrefs = await icons.evaluateAll((links) => links.map((link) => (link as HTMLLinkElement).href));
    for (const href of hrefs) {
      const response = await request.get(href);
      expect(response.status(), href).toBe(200);
      expect(response.headers()['content-type'], href).toMatch(/^image\//);
    }

    const decoded = await page.evaluate(
      (urls) =>
        Promise.all(
          urls.map(
            (url) =>
              new Promise<[string, number]>((resolve) => {
                const image = new Image();
                image.onload = () => resolve([url, image.naturalWidth]);
                image.onerror = () => resolve([url, 0]);
                image.src = url;
              }),
          ),
        ),
      hrefs,
    );
    for (const [url, width] of decoded) expect(width, url).toBeGreaterThan(0);

    const apple = await request.get(hrefs.find((href) => href.includes('apple-touch-icon'))!);
    expect(pngSize(await apple.body())).toEqual({ width: 180, height: 180 });
    expect(failed).toEqual([]);
  });

  test('404 페이지는 색인에서 빠지고 canonical·og:url이 없다', async ({ page }) => {
    const response = await page.goto('./404.html');
    test.skip(response?.status() === 404, '404 페이지(src/pages/404.astro)가 아직 빌드에 없다');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    await expect(page.locator('meta[property="og:url"]')).toHaveCount(0);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https:\/\//);
  });
});

// ---------------------------------------------------------------------------
test.describe('레거시 해시 경로', () => {
  test('#/about → 홈 최상단(다시 불러오지 않고 해시만 지운다)', async ({ page, baseURL }) => {
    const documents: string[] = [];
    page.on('request', (request) => {
      if (request.resourceType() === 'document') documents.push(request.url());
    });
    await gotoLegacy(page, '#/about');
    await page.waitForURL(homeUrl(baseURL));
    await page.waitForLoadState('load');
    expect(page.url()).toBe(homeUrl(baseURL));
    expect(documents).toHaveLength(1);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test('#/projects/finch → /projects/finch', async ({ page, baseURL }) => {
    await gotoLegacy(page, '#/projects/finch');
    await page.waitForURL(/\/projects\/finch\/?$/);
    expect(new URL(page.url()).pathname).toMatch(new RegExp(`^${new URL(homeUrl(baseURL)).pathname}projects/finch/?$`));
  });

  test('#/tech → /#experience', async ({ page, baseURL }) => {
    await gotoLegacy(page, '#/tech');
    await page.waitForURL(`${homeUrl(baseURL)}#experience`);
  });

  test('#/activities → /#activities', async ({ page, baseURL }) => {
    await gotoLegacy(page, '#/activities');
    await page.waitForURL(`${homeUrl(baseURL)}#activities`);
  });

  test('예전 프로젝트 목록(#/projects)과 없는 slug는 /#projects로 가서 Projects 섹션을 연다', async ({ page, baseURL }) => {
    await gotoLegacy(page, '#/projects');
    await page.waitForURL(`${homeUrl(baseURL)}#projects`);
    await page.waitForLoadState('load');
    // 직접 /#projects로 들어온 것과 같이, Projects 머리글(영문 라벨)이 내비 아래 64px에 멈춘다(섹션 위 여백은 scroll-margin으로 당김)
    await page.evaluate(() => document.fonts.ready);
    await expect
      .poll(async () => {
        await waitForScrollIdle(page);
        return page.locator('#projects .section-label').evaluate((label) => Math.round(label.getBoundingClientRect().top));
      })
      .toBe(NAV_HEIGHT + 64);

    await gotoLegacy(page, '#/projects/unknown-project');
    await page.waitForURL(`${homeUrl(baseURL)}#projects`);
  });

  test('알 수 없는 #/x → 홈 최상단', async ({ page, baseURL }) => {
    await gotoLegacy(page, '#/x');
    await page.waitForURL(homeUrl(baseURL));
    await page.waitForLoadState('load');
    expect(page.url()).toBe(homeUrl(baseURL));
  });

  test('일반 앵커 #projects는 그대로 둔다', async ({ page, baseURL }) => {
    await page.goto('./#projects');
    await page.waitForLoadState('load');
    await page.waitForTimeout(300);
    expect(page.url()).toBe(`${homeUrl(baseURL)}#projects`);
  });

  test('이미 열린 페이지에 예전 주소를 붙여 넣어도(hashchange) 새 주소로 간다', async ({ page }) => {
    await page.goto('./');
    await page.evaluate(() => {
      location.hash = '/projects/finch';
    });
    await page.waitForURL(/\/projects\/finch\/?$/);
  });
});
