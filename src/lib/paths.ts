/**
 * 내부 링크는 모두 이 함수를 거친다. 하위 경로 호스팅(base 변경)에도 링크가 깨지지 않게 한다.
 * withBase('/') → '/' 또는 '/sub/'
 * withBase('/#projects') → '/#projects' 또는 '/sub/#projects'
 * withBase('/projects/finch/') → '/projects/finch/' 또는 '/sub/projects/finch/'
 */
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

export function withBase(path: string): string {
  if (/^[a-z][a-z0-9+.-]*:/i.test(path)) return path; // 외부·mailto·tel 링크는 그대로
  if (path.startsWith('#')) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}${normalized}`;
}

/**
 * 프로젝트 상세 경로. slug는 기존 값을 유지한다(EXPERIENCE.md Information Architecture).
 * 빌드 결과가 /projects/<slug>/index.html이라 끝에 /를 붙인다(GitHub Pages의 301 우회를 피함).
 */
export function projectPath(slug: string): string {
  return withBase(`/projects/${slug}/`);
}
