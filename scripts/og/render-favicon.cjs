// 임시 탭 아이콘을 scripts/og/favicon.html에서 다시 그린다 → public/favicon.ico(16·32·48), favicon-32.png, apple-touch-icon.png(180).
// 실행: 저장소 루트에서 `node scripts/og/render-favicon.cjs [출력 폴더=public] [미리보기.png]`. 설치된 Edge와 @playwright/test를 쓰고, Pretendard는 CDN에서 받는다.
// 브랜드 아이콘이 정해지면 이 스크립트 대신 public/의 세 파일만 바꾸면 된다(BaseLayout.astro가 링크한다).
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('@playwright/test');

/** 글자 잉크 폭 비율과 모서리 반경 비율. apple-touch-icon은 iOS가 모서리를 깎으므로 꽉 찬 사각형에 글자를 조금 작게. */
const GLYPH = 0.62;
const RADIUS = 0.22;
const SPECS = {
  'favicon-16': { size: 16, radius: RADIUS, glyph: GLYPH, scale: 8 },
  'favicon-32': { size: 32, radius: RADIUS, glyph: GLYPH, scale: 8 },
  'favicon-48': { size: 48, radius: RADIUS, glyph: GLYPH, scale: 8 },
  'apple-touch-icon-180': { size: 180, radius: 0, glyph: GLYPH * 0.86, scale: 4 },
};

/** PNG를 그대로 담은 ICO 컨테이너(현행 브라우저·Windows Vista+ 지원). 새 의존성 없이 만든다. */
function toIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map(({ data }) => data)]);
}

(async () => {
  const [outArg, previewArg] = process.argv.slice(2);
  const outDir = path.resolve(outArg || path.join(__dirname, '../../public'));
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ channel: 'msedge' });
  try {
    const page = await browser.newPage({ viewport: { width: 900, height: 700 } });
    await page.goto(pathToFileURL(path.join(__dirname, 'favicon.html')).href, { waitUntil: 'networkidle' });
    const urls = await page.evaluate((specs) => window.renderAll(specs), SPECS);
    const png = Object.fromEntries(Object.entries(urls).map(([name, url]) => [name, Buffer.from(url.split(',')[1], 'base64')]));

    const files = {
      'favicon.ico': toIco([16, 32, 48].map((size) => ({ size, data: png[`favicon-${size}`] }))),
      'favicon-32.png': png['favicon-32'],
      'apple-touch-icon.png': png['apple-touch-icon-180'],
    };
    for (const [name, data] of Object.entries(files)) fs.writeFileSync(path.join(outDir, name), data);

    if (previewArg) {
      await page.evaluate((u) => window.preview(u), urls);
      await page.waitForTimeout(200);
      await page.locator('#out').screenshot({ path: path.resolve(previewArg) });
    }
    console.log(`[favicon] ${Object.keys(files).join(', ')} → ${path.relative(process.cwd(), outDir) || '.'}`);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error('[favicon]', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
