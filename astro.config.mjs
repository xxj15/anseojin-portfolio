// @ts-check
import { defineConfig } from 'astro/config';

// 하위 경로 호스팅 대비: 배포 단계에서 ASTRO_BASE(예: /anseojin-portfolio)로 base를 바꿀 수 있다.
// 내부 링크는 모두 src/lib/paths.ts의 withBase()를 거친다.
const base = process.env.ASTRO_BASE || '/';

// canonical·og:url·og:image 같은 절대 URL의 기준(도메인만, 경로는 base가 맡는다).
// 커스텀 도메인으로 옮기면 ASTRO_SITE로 바꾼다.
const site = process.env.ASTRO_SITE || 'https://xxj15.github.io';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});
