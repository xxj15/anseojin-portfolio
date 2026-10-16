// OG 공유 이미지를 scripts/og/og.html에서 다시 그린다(1200×630 PNG → public/og/default.png).
// 실행: 저장소 루트에서 `node scripts/og/render-og.cjs [출력 경로]`. 설치된 Edge와 @playwright/test를 쓰고, Pretendard는 CDN에서 받는다.
// 이미지 속 문구를 바꾸면 src/layouts/BaseLayout.astro의 DEFAULT_OG_IMAGE.alt도 같은 문구로 맞춘다.
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('@playwright/test');

const WIDTH = 1200;
const HEIGHT = 630;

(async () => {
  const out = path.resolve(process.argv[2] || path.join(__dirname, '../../public/og/default.png'));
  const browser = await chromium.launch({ channel: 'msedge' });
  try {
    const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(path.join(__dirname, 'og.html')).href, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    // 글꼴이 실제로 Pretendard인지, 글자가 프레임 밖으로 넘치지 않는지 확인한다
    const check = await page.evaluate(() => {
      const loaded = [...document.fonts].some((font) => font.family.includes('Pretendard') && font.status === 'loaded');
      const overflow = [...document.querySelectorAll('.top, h1 .line, .strengths')]
        .filter((element) => {
          const range = document.createRange();
          range.selectNodeContents(element);
          const rect = range.getBoundingClientRect();
          return rect.left < 96 - 0.5 || rect.right > 1200 - 96 + 0.5;
        })
        .map((element) => element.className || element.tagName);
      const strengths = document.querySelector('.strengths').getBoundingClientRect().width;
      return { loaded, overflow, strengths: Math.round(strengths) };
    });
    if (!check.loaded) throw new Error('Pretendard를 불러오지 못했다(인터넷 연결 확인)');
    if (check.overflow.length) throw new Error(`프레임 밖으로 넘친 요소: ${check.overflow.join(', ')}`);

    await page.screenshot({ path: out, type: 'png' });
    console.log(`[og] ${path.relative(process.cwd(), out)} (${WIDTH}×${HEIGHT}), 강점 줄 폭 ${check.strengths}px`);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error('[og]', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
