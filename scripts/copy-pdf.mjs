// 루트의 anseojin-portfolio.pdf를 public/으로 복사한다.
// 원본은 README의 raw 링크가 가리키므로 제자리에 둔다. 사본은 .gitignore 대상이다.
// 오래된 사본이 남지 않도록 매번 덮어쓴다.
import { copyFile, mkdir, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, 'anseojin-portfolio.pdf');
const target = resolve(root, 'public', 'anseojin-portfolio.pdf');

try {
  const { size } = await stat(source);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(source, target);
  console.log(`[copy-pdf] copied anseojin-portfolio.pdf (${(size / 1024 / 1024).toFixed(1)}MB) to public/`);
} catch (error) {
  console.error('[copy-pdf] failed to copy anseojin-portfolio.pdf:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
